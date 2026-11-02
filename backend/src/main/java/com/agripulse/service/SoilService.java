package com.agripulse.service;

import com.agripulse.entity.SoilMetric;
import com.agripulse.entity.SoilTest;
import com.agripulse.repository.SoilMetricRepository;
import com.agripulse.repository.SoilTestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SoilService {

    private final SoilMetricRepository soilMetricRepository;
    private final SoilTestRepository soilTestRepository;

    public SoilService(SoilMetricRepository soilMetricRepository, SoilTestRepository soilTestRepository) {
        this.soilMetricRepository = soilMetricRepository;
        this.soilTestRepository = soilTestRepository;
    }

    public SoilMetric getLatestMetrics() {
        return soilMetricRepository.findFirstByOrderByIdDesc().orElseGet(() -> {
            SoilMetric metric = new SoilMetric();
            metric.setNitrogenLevel(185.0);
            metric.setPhosphorusLevel(34.0);
            metric.setPotassiumLevel(240.0);
            metric.setSoilPh(6.8);
            metric.setOrganicMatter(2.4);
            metric.setElectricalConductivity(0.85);
            metric.setOverallVitalityIndex(88);
            return metric;
        });
    }

    public List<SoilTest> getSoilTests() {
        return soilTestRepository.findAllByOrderByTestedDateDesc();
    }

    public SoilTest logSoilTest(SoilTest test) {
        if (test.getTestedDate() == null) test.setTestedDate(LocalDate.now());
        if (test.getStatus() == null) test.setStatus("OPTIMAL");
        return soilTestRepository.save(test);
    }
}
