package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "farms")
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(name = "total_acreage", nullable = false)
    private Double totalAcreage;

    @Column(name = "leased_acreage")
    private Double leasedAcreage = 0.0;

    @Column(name = "primary_irrigation", length = 100)
    private String primaryIrrigation;

    @Column(name = "soil_type", length = 100)
    private String soilType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Farm() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getTotalAcreage() { return totalAcreage; }
    public void setTotalAcreage(Double totalAcreage) { this.totalAcreage = totalAcreage; }

    public Double getLeasedAcreage() { return leasedAcreage; }
    public void setLeasedAcreage(Double leasedAcreage) { this.leasedAcreage = leasedAcreage; }

    public String getPrimaryIrrigation() { return primaryIrrigation; }
    public void setPrimaryIrrigation(String primaryIrrigation) { this.primaryIrrigation = primaryIrrigation; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
