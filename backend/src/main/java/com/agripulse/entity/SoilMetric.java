package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "soil_metrics")
public class SoilMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "nitrogen_level")
    private Double nitrogenLevel = 185.0;

    @Column(name = "phosphorus_level")
    private Double phosphorusLevel = 34.0;

    @Column(name = "potassium_level")
    private Double potassiumLevel = 240.0;

    @Column(name = "soil_ph")
    private Double soilPh = 6.8;

    @Column(name = "organic_matter")
    private Double organicMatter = 2.4;

    @Column(name = "electrical_conductivity")
    private Double electricalConductivity = 0.85;

    @Column(name = "moisture_depth_15cm")
    private Double moistureDepth15cm = 70.0;

    @Column(name = "moisture_depth_30cm")
    private Double moistureDepth30cm = 65.0;

    @Column(name = "moisture_depth_60cm")
    private Double moistureDepth60cm = 58.0;

    @Column(name = "overall_vitality_index")
    private Integer overallVitalityIndex = 88;

    @Column(name = "tested_at")
    private LocalDateTime testedAt = LocalDateTime.now();

    public SoilMetric() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public Double getNitrogenLevel() { return nitrogenLevel; }
    public void setNitrogenLevel(Double nitrogenLevel) { this.nitrogenLevel = nitrogenLevel; }

    public Double getPhosphorusLevel() { return phosphorusLevel; }
    public void setPhosphorusLevel(Double phosphorusLevel) { this.phosphorusLevel = phosphorusLevel; }

    public Double getPotassiumLevel() { return potassiumLevel; }
    public void setPotassiumLevel(Double potassiumLevel) { this.potassiumLevel = potassiumLevel; }

    public Double getSoilPh() { return soilPh; }
    public void setSoilPh(Double soilPh) { this.soilPh = soilPh; }

    public Double getOrganicMatter() { return organicMatter; }
    public void setOrganicMatter(Double organicMatter) { this.organicMatter = organicMatter; }

    public Double getElectricalConductivity() { return electricalConductivity; }
    public void setElectricalConductivity(Double electricalConductivity) { this.electricalConductivity = electricalConductivity; }

    public Double getMoistureDepth15cm() { return moistureDepth15cm; }
    public void setMoistureDepth15cm(Double moistureDepth15cm) { this.moistureDepth15cm = moistureDepth15cm; }

    public Double getMoistureDepth30cm() { return moistureDepth30cm; }
    public void setMoistureDepth30cm(Double moistureDepth30cm) { this.moistureDepth30cm = moistureDepth30cm; }

    public Double getMoistureDepth60cm() { return moistureDepth60cm; }
    public void setMoistureDepth60cm(Double moistureDepth60cm) { this.moistureDepth60cm = moistureDepth60cm; }

    public Integer getOverallVitalityIndex() { return overallVitalityIndex; }
    public void setOverallVitalityIndex(Integer overallVitalityIndex) { this.overallVitalityIndex = overallVitalityIndex; }

    public LocalDateTime getTestedAt() { return testedAt; }
    public void setTestedAt(LocalDateTime testedAt) { this.testedAt = testedAt; }
}
