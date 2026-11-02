package com.agripulse.service;

import com.agripulse.entity.SensorDevice;
import com.agripulse.repository.SensorDeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorService {

    private final SensorDeviceRepository sensorRepository;

    public SensorService(SensorDeviceRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    public List<SensorDevice> getAllSensors() {
        return sensorRepository.findAll();
    }

    public SensorDevice pairSensor(SensorDevice sensor) {
        if (sensor.getBatteryPercentage() == null) sensor.setBatteryPercentage(100);
        if (sensor.getStatus() == null) sensor.setStatus("ONLINE");
        if (sensor.getLastPing() == null) sensor.setLastPing("Just now");
        return sensorRepository.save(sensor);
    }

    public SensorDevice calibrateSensor(Long id) {
        SensorDevice sensor = sensorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sensor not found with id " + id));
        sensor.setStatus("CALIBRATED");
        sensor.setLastPing("Just now (Calibrated)");
        return sensorRepository.save(sensor);
    }
}
