package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parcels")
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Double acreage;

    @Column(name = "crop_name", length = 100)
    private String cropName;

    @Column(name = "soil_moisture")
    private Double soilMoisture = 65.0;

    @Column(name = "soil_ph")
    private Double soilPh = 6.8;

    @Column(name = "crop_stage", length = 50)
    private String cropStage;

    @Column(name = "ndvi_index")
    private Double ndviIndex = 0.75;

    @Column(name = "irrigation_status", length = 50)
    private String irrigationStatus = "SCHEDULED";

    @Column(name = "coordinates_json", columnDefinition = "TEXT")
    private String coordinatesJson;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Parcel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getAcreage() { return acreage; }
    public void setAcreage(Double acreage) { this.acreage = acreage; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public Double getSoilMoisture() { return soilMoisture; }
    public void setSoilMoisture(Double soilMoisture) { this.soilMoisture = soilMoisture; }

    public Double getSoilPh() { return soilPh; }
    public void setSoilPh(Double soilPh) { this.soilPh = soilPh; }

    public String getCropStage() { return cropStage; }
    public void setCropStage(String cropStage) { this.cropStage = cropStage; }

    public Double getNdviIndex() { return ndviIndex; }
    public void setNdviIndex(Double ndviIndex) { this.ndviIndex = ndviIndex; }

    public String getIrrigationStatus() { return irrigationStatus; }
    public void setIrrigationStatus(String irrigationStatus) { this.irrigationStatus = irrigationStatus; }

    public String getCoordinatesJson() { return coordinatesJson; }
    public void setCoordinatesJson(String coordinatesJson) { this.coordinatesJson = coordinatesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
