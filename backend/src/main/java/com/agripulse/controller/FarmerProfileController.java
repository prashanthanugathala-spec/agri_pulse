package com.agripulse.controller;

import com.agripulse.dto.FarmerProfileDTO;
import com.agripulse.service.FarmerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer-profile")
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;

    public FarmerProfileController(FarmerProfileService farmerProfileService) {
        this.farmerProfileService = farmerProfileService;
    }

    @GetMapping
    public ResponseEntity<FarmerProfileDTO> getProfile(
            @RequestParam(value = "userId", required = false) Long userId
    ) {
        return ResponseEntity.ok(farmerProfileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<FarmerProfileDTO> updateProfile(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestBody FarmerProfileDTO dto
    ) {
        return ResponseEntity.ok(farmerProfileService.updateProfile(userId, dto));
    }

    @GetMapping("/id-card")
    public ResponseEntity<Map<String, Object>> getDigitalIdCard(
            @RequestParam(value = "userId", required = false) Long userId
    ) {
        FarmerProfileDTO p = farmerProfileService.getProfile(userId);
        Map<String, Object> card = new LinkedHashMap<>();
        card.put("farmerUid", p.getFarmerUid());
        card.put("fullName", p.getFullName());
        card.put("farmName", p.getFarmName());
        card.put("totalAcreage", p.getTotalAcreage());
        card.put("surveyNumbers", p.getSurveyNumbers());
        card.put("villageDistrict", p.getVillageMandal() + ", " + p.getDistrict());
        card.put("state", p.getState());
        card.put("pmKisanId", p.getPmKisanId());
        card.put("kccNumber", p.getKccNumber());
        card.put("soilHealthCardNo", p.getSoilHealthCardNo());
        card.put("avatarUrl", p.getAvatarUrl() != null ? p.getAvatarUrl() : "");
        card.put("validity", "2026 - 2029 Certified Pass");
        card.put("issuer", "Ministry of Agriculture & AgriPulse Digital Registry");
        card.put("qrValidationHash", "AGRI-VERIFY-" + p.getFarmerUid() + "-DIGITAL");
        return ResponseEntity.ok(card);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(
            @RequestParam(value = "userId", required = false) Long userId
    ) {
        FarmerProfileDTO p = farmerProfileService.getProfile(userId);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("farmerUid", p.getFarmerUid());
        summary.put("fullName", p.getFullName());
        summary.put("farmName", p.getFarmName());
        summary.put("totalAcreage", p.getTotalAcreage());
        summary.put("activeParcelsCount", p.getActiveParcelsCount());
        summary.put("vitalityScore", p.getVitalityScore());
        summary.put("kccLimit", p.getKccLimit());
        summary.put("verifiedBadges", p.getVerifiedBadges());
        return ResponseEntity.ok(summary);
    }
}
