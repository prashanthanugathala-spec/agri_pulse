package com.agripulse.service;

import com.agripulse.entity.IrrigationZone;
import com.agripulse.repository.IrrigationZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IrrigationService {

    private final IrrigationZoneRepository irrigationZoneRepository;

    public IrrigationService(IrrigationZoneRepository irrigationZoneRepository) {
        this.irrigationZoneRepository = irrigationZoneRepository;
    }

    public List<IrrigationZone> getZones() {
        return irrigationZoneRepository.findAll();
    }

    public IrrigationZone toggleValve(Long zoneId, Boolean active) {
        IrrigationZone zone = irrigationZoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Irrigation zone not found with id " + zoneId));
        zone.setValveState(active);
        if (Boolean.TRUE.equals(active)) {
            zone.setNextRunTime("Running live (" + zone.getFlowRateLpm() + " L/min)");
        } else {
            zone.setNextRunTime("Manual Standby");
        }
        return irrigationZoneRepository.save(zone);
    }

    public void emergencyStop() {
        List<IrrigationZone> zones = irrigationZoneRepository.findAll();
        for (IrrigationZone zone : zones) {
            zone.setValveState(false);
            zone.setNextRunTime("Emergency Halt Active");
        }
        irrigationZoneRepository.saveAll(zones);
    }
}
