package com.agripulse.controller;

import com.agripulse.entity.Crop;
import com.agripulse.service.CropService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @GetMapping
    public ResponseEntity<List<Crop>> getAllCrops(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(cropService.getAllCrops(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Crop> getCropById(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getCropById(id));
    }

    @PostMapping
    public ResponseEntity<Crop> createCrop(@RequestBody Crop crop) {
        return ResponseEntity.ok(cropService.createCrop(crop));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Crop> updateCrop(@PathVariable Long id, @RequestBody Crop crop) {
        return ResponseEntity.ok(cropService.updateCrop(id, crop));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCrop(@PathVariable Long id) {
        cropService.deleteCrop(id);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Crop removed from portfolio"));
    }
}
