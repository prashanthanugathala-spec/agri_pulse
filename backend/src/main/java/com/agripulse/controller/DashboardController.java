package com.agripulse.controller;

import com.agripulse.dto.DashboardOverviewDTO;
import com.agripulse.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDTO> getOverview() {
        return ResponseEntity.ok(dashboardService.getOverview());
    }

    @PostMapping("/run-diagnostic")
    public ResponseEntity<Map<String, String>> runDiagnostic() {
        String msg = dashboardService.runDiagnostic();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", msg));
    }
}
