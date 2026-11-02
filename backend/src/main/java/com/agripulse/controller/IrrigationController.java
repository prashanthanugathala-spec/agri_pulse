package com.agripulse.controller;

import com.agripulse.entity.IrrigationZone;
import com.agripulse.service.IrrigationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/irrigation")
public class IrrigationController {

    private final IrrigationService irrigationService;

    public IrrigationController(IrrigationService irrigationService) {
        this.irrigationService = irrigationService;
    }

    @GetMapping("/zones")
    public ResponseEntity<List<IrrigationZone>> getZones() {
        return ResponseEntity.ok(irrigationService.getZones());
    }

    @PostMapping("/zones/{id}/toggle")
    public ResponseEntity<IrrigationZone> toggleValve(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        Boolean active = body.getOrDefault("active", true);
        return ResponseEntity.ok(irrigationService.toggleValve(id, active));
    }

    @PostMapping("/emergency-stop")
    public ResponseEntity<Map<String, String>> emergencyStop() {
        irrigationService.emergencyStop();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Emergency stop triggered. All valves closed."));
    }
}
