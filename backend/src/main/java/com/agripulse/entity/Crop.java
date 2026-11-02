package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "parcel_id")
    private Long parcelId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String variety;

    @Column(nullable = false, length = 50)
    private String season;

    @Column(nullable = false, length = 50)
    private String stage;

    @Column(name = "planting_date")
    private LocalDate plantingDate;

    @Column(name = "expected_harvest_date")
    private LocalDate expectedHarvestDate;

    @Column(name = "health_score")
    private Integer healthScore = 85;

    @Column(name = "yield_forecast", length = 100)
    private String yieldForecast;

    @Column(name = "water_requirement", length = 100)
    private String waterRequirement;

    @Column(length = 50)
    private String status = "OPTIMAL";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Crop() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public Long getParcelId() { return parcelId; }
    public void setParcelId(Long parcelId) { this.parcelId = parcelId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public LocalDate getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDate plantingDate) { this.plantingDate = plantingDate; }

    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public String getYieldForecast() { return yieldForecast; }
    public void setYieldForecast(String yieldForecast) { this.yieldForecast = yieldForecast; }

    public String getWaterRequirement() { return waterRequirement; }
    public void setWaterRequirement(String waterRequirement) { this.waterRequirement = waterRequirement; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
