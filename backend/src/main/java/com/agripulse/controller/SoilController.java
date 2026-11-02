package com.agripulse.controller;

import com.agripulse.entity.SoilMetric;
import com.agripulse.entity.SoilTest;
import com.agripulse.service.SoilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soil")
public class SoilController {

    private final SoilService soilService;

    public SoilController(SoilService soilService) {
        this.soilService = soilService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<SoilMetric> getLatestMetrics() {
        return ResponseEntity.ok(soilService.getLatestMetrics());
    }

    @GetMapping("/tests")
    public ResponseEntity<List<SoilTest>> getSoilTests() {
        return ResponseEntity.ok(soilService.getSoilTests());
    }

    @PostMapping("/tests")
    public ResponseEntity<SoilTest> logSoilTest(@RequestBody SoilTest test) {
        return ResponseEntity.ok(soilService.logSoilTest(test));
    }
}
