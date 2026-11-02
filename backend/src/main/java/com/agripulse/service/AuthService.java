package com.agripulse.service;

import com.agripulse.dto.AuthDTO;
import com.agripulse.entity.Farm;
import com.agripulse.entity.User;
import com.agripulse.repository.FarmRepository;
import com.agripulse.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final FarmRepository farmRepository;

    // Active session token store: token -> userId
    private final Map<String, Long> activeTokens = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, FarmRepository farmRepository) {
        this.userRepository = userRepository;
        this.farmRepository = farmRepository;
    }

    @PostConstruct
    public void initDefaultData() {
        try {
            if (!userRepository.existsByEmail("ravi@agripulse.io")) {
                User demo = new User("ravi@agripulse.io", "agripulse123", "Ravi Kumar", "+91 98490 12345", "LEAD_AGRONOMIST");
                User savedDemo = userRepository.save(demo);
                log.info("Initialized default demo user: ravi@agripulse.io");

                if (farmRepository.findFirstByUserId(savedDemo.getId()).isEmpty()) {
                    Farm farm = new Farm();
                    farm.setUserId(savedDemo.getId());
                    farm.setName("Green Valley Farm");
                    farm.setLocation("Hyderabad, Telangana");
                    farm.setTotalAcreage(12.5);
                    farm.setLeasedAcreage(0.5);
                    farm.setPrimaryIrrigation("Precision Drip & Automated Micro-Sprinkler");
                    farm.setSoilType("Red Sandy Loam");
                    farmRepository.save(farm);
                    log.info("Initialized default demo farm for user: {}", savedDemo.getId());
                }
            }
        } catch (Exception e) {
            log.warn("Could not auto-seed demo credentials on startup: {}", e.getMessage());
        }
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials: user not found with email " + request.getEmail()));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials: password mismatch");
        }

        String farmName = farmRepository.findFirstByUserId(user.getId())
                .map(Farm::getName)
                .orElseGet(() -> farmRepository.findFirstByOrderByIdAsc()
                        .map(Farm::getName)
                        .orElse("My Precision Farm"));

        String token = "agri_jwt_" + UUID.randomUUID().toString();
        activeTokens.put(token, user.getId());

        log.info("User {} ({}) logged in successfully", user.getFullName(), user.getEmail());
        return new AuthDTO.AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), farmName, "Login successful");
    }

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email address is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account already exists for email " + request.getEmail());
        }

        String fullName = (request.getFullName() != null && !request.getFullName().isBlank())
                ? request.getFullName().trim()
                : "Estate Agronomist";

        User newUser = new User(normalizedEmail, request.getPassword(), fullName, "+91 98490 00000", "AGRONOMIST");
        User savedUser = userRepository.save(newUser);

        String farmName = (request.getFarmName() != null && !request.getFarmName().isBlank())
                ? request.getFarmName().trim()
                : "My Precision Farm";
        Double acreage = request.getTotalAcreage() != null && request.getTotalAcreage() > 0 ? request.getTotalAcreage() : 10.0;

        Farm newFarm = new Farm();
        newFarm.setUserId(savedUser.getId());
        newFarm.setName(farmName);
        newFarm.setLocation("Telangana, India");
        newFarm.setTotalAcreage(acreage);
        newFarm.setLeasedAcreage(0.0);
        newFarm.setPrimaryIrrigation("Drip Irrigation");
        newFarm.setSoilType("Sandy Loam");
        farmRepository.save(newFarm);

        String token = "agri_jwt_" + UUID.randomUUID().toString();
        activeTokens.put(token, savedUser.getId());

        log.info("Registered new user {} with farm {}", savedUser.getEmail(), farmName);
        return new AuthDTO.AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), farmName, "Registration complete");
    }

    public AuthDTO.UserProfileResponse getCurrentUser(String authHeader) {
        String token = null;
        if (authHeader != null && !authHeader.isBlank()) {
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7).trim();
            } else {
                token = authHeader.trim();
            }
        }

        User user = null;
        if (token != null && !token.isBlank()) {
            Long userId = activeTokens.get(token);
            if (userId != null) {
                user = userRepository.findById(userId).orElse(null);
            }
        }

        // Fallback for demonstration / initial active session
        if (user == null) {
            user = userRepository.findAll().stream().findFirst().orElseGet(() -> {
                User demo = new User("ravi@agripulse.io", "agripulse123", "Ravi Kumar", "+91 98490 12345", "LEAD_AGRONOMIST");
                return userRepository.save(demo);
            });
        }

        final User finalUser = user;
        Optional<Farm> farmOpt = farmRepository.findFirstByUserId(finalUser.getId());
        String farmName = farmOpt.map(Farm::getName).orElseGet(() ->
                farmRepository.findFirstByOrderByIdAsc().map(Farm::getName).orElse("Green Valley Farm")
        );
        Double acreage = farmOpt.map(Farm::getTotalAcreage).orElse(12.5);

        return new AuthDTO.UserProfileResponse(
                finalUser.getId(),
                finalUser.getEmail(),
                finalUser.getFullName(),
                finalUser.getPhone(),
                finalUser.getRole(),
                farmName,
                acreage
        );
    }

    public void logout(String authHeader) {
        if (authHeader != null && !authHeader.isBlank()) {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : authHeader.trim();
            activeTokens.remove(token);
            log.info("Token session invalidated successfully");
        }
    }
}
