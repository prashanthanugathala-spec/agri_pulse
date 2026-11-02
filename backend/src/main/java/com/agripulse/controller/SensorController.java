package com.agripulse.controller;

import com.agripulse.entity.SensorDevice;
import com.agripulse.service.SensorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping
    public ResponseEntity<List<SensorDevice>> getAllSensors() {
        return ResponseEntity.ok(sensorService.getAllSensors());
    }

    @PostMapping("/pair")
    public ResponseEntity<SensorDevice> pairSensor(@RequestBody SensorDevice sensor) {
        return ResponseEntity.ok(sensorService.pairSensor(sensor));
    }

    @PostMapping("/{id}/calibrate")
    public ResponseEntity<SensorDevice> calibrateSensor(@PathVariable Long id) {
        return ResponseEntity.ok(sensorService.calibrateSensor(id));
    }
}
