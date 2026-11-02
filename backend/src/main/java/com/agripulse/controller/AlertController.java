package com.agripulse.controller;

import com.agripulse.entity.Alert;
import com.agripulse.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getAlerts(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(alertService.getAlerts(status));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<Alert> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.resolveAlert(id));
    }

    @PostMapping("/{id}/snooze")
    public ResponseEntity<Alert> snoozeAlert(@PathVariable Long id, @RequestBody(required = false) Map<String, Integer> body) {
        Integer hours = (body != null) ? body.get("hours") : 4;
        return ResponseEntity.ok(alertService.snoozeAlert(id, hours));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> dismissAlert(@PathVariable Long id) {
        alertService.dismissAlert(id);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Alert dismissed"));
    }
}
