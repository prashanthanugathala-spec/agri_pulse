package com.agripulse.controller;

import com.agripulse.entity.Farm;
import com.agripulse.entity.Parcel;
import com.agripulse.service.FarmService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farm")
public class FarmController {

    private final FarmService farmService;

    public FarmController(FarmService farmService) {
        this.farmService = farmService;
    }

    @GetMapping
    public ResponseEntity<Farm> getFarm() {
        return ResponseEntity.ok(farmService.getFarm());
    }

    @GetMapping("/parcels")
    public ResponseEntity<List<Parcel>> getParcels() {
        return ResponseEntity.ok(farmService.getParcels());
    }

    @GetMapping("/parcels/{id}")
    public ResponseEntity<Parcel> getParcelById(@PathVariable Long id) {
        return ResponseEntity.ok(farmService.getParcelById(id));
    }

    @PutMapping("/parcels/{id}")
    public ResponseEntity<Parcel> updateParcel(@PathVariable Long id, @RequestBody Parcel parcel) {
        return ResponseEntity.ok(farmService.updateParcel(id, parcel));
    }
}
