package com.agripulse.dto;

public class AuthDTO {

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
        private String farmName;
        private Double totalAcreage;

        public RegisterRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getFarmName() { return farmName; }
        public void setFarmName(String farmName) { this.farmName = farmName; }
        public Double getTotalAcreage() { return totalAcreage; }
        public void setTotalAcreage(Double totalAcreage) { this.totalAcreage = totalAcreage; }
    }

    public static class AuthResponse {
        private String token;
        private Long userId;
        private String email;
        private String fullName;
        private String farmName;
        private String message;

        public AuthResponse() {}
        public AuthResponse(String token, Long userId, String email, String fullName, String farmName, String message) {
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.farmName = farmName;
            this.message = message;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getFarmName() { return farmName; }
        public void setFarmName(String farmName) { this.farmName = farmName; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String role;
        private String farmName;
        private Double totalAcreage;

        public UserProfileResponse() {}
        public UserProfileResponse(Long id, String email, String fullName, String phone, String role, String farmName, Double totalAcreage) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.phone = phone;
            this.role = role;
            this.farmName = farmName;
            this.totalAcreage = totalAcreage;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getFarmName() { return farmName; }
        public void setFarmName(String farmName) { this.farmName = farmName; }
        public Double getTotalAcreage() { return totalAcreage; }
        public void setTotalAcreage(Double totalAcreage) { this.totalAcreage = totalAcreage; }
    }
}
