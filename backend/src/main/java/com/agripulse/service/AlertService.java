package com.agripulse.service;

import com.agripulse.entity.Alert;
import com.agripulse.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> getAlerts(String status) {
        if ("ACTIVE".equalsIgnoreCase(status)) {
            return alertRepository.findByFarmIdAndResolved(1L, false);
        } else if ("RESOLVED".equalsIgnoreCase(status)) {
            return alertRepository.findByFarmIdAndResolved(1L, true);
        }
        return alertRepository.findAll();
    }

    public Alert resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id " + id));
        alert.setResolved(true);
        return alertRepository.save(alert);
    }

    public Alert snoozeAlert(Long id, Integer hours) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id " + id));
        alert.setDescription(alert.getDescription() + " (Snoozed for " + (hours != null ? hours : 4) + " hours)");
        return alertRepository.save(alert);
    }

    public void dismissAlert(Long id) {
        alertRepository.deleteById(id);
    }
}
