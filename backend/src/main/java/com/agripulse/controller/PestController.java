package com.agripulse.controller;

import com.agripulse.entity.PestDiagnostic;
import com.agripulse.service.PestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pest")
public class PestController {

    private final PestService pestService;

    public PestController(PestService pestService) {
        this.pestService = pestService;
    }

    @GetMapping("/diagnostics")
    public ResponseEntity<List<PestDiagnostic>> getDiagnostics() {
        return ResponseEntity.ok(pestService.getDiagnostics());
    }

    @PostMapping("/simulate-scan")
    public ResponseEntity<PestDiagnostic> simulateScan(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(pestService.simulateScan(payload));
    }

    @PostMapping("/scan")
    public ResponseEntity<PestDiagnostic> uploadScan(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "cropName", defaultValue = "Tomato") String cropName,
            @RequestParam(value = "zone", defaultValue = "Zone C - Polyhouse") String zone
    ) {
        return ResponseEntity.ok(pestService.scanUploadedLeaf(file, cropName, zone));
    }
}
