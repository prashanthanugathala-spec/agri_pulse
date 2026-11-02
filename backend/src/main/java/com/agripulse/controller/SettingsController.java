package com.agripulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(Map.of(
                "farmName", "Green Valley Farm",
                "ownerName", "Ravi Kumar",
                "location", "Hyderabad, Telangana",
                "acreage", 12.5,
                "smsAlerts", true,
                "emailAlerts", true,
                "pushNotifications", true,
                "telemetrySyncMinutes", 5,
                "autoIrrigationThreshold", 60.0
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Workspace settings updated successfully"));
    }

    @PutMapping("/notifications")
    public ResponseEntity<Map<String, String>> updateNotifications(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Notification channels saved"));
    }
}
