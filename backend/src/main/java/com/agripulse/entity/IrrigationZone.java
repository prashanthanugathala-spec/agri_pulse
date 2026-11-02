package com.agripulse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "irrigation_zones")
public class IrrigationZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "parcel_id")
    private Long parcelId;

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName;

    @Column(name = "valve_state")
    private Boolean valveState = false;

    @Column(length = 50)
    private String mode = "AUTO";

    @Column(name = "moisture_threshold")
    private Double moistureThreshold = 60.0;

    @Column(name = "flow_rate_lpm")
    private Double flowRateLpm = 45.0;

    @Column(name = "water_consumed_today")
    private Double waterConsumedToday = 480.0;

    @Column(name = "next_run_time", length = 100)
    private String nextRunTime;

    @Column(name = "last_run_duration_min")
    private Integer lastRunDurationMin = 35;

    public IrrigationZone() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public Long getParcelId() { return parcelId; }
    public void setParcelId(Long parcelId) { this.parcelId = parcelId; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public Boolean getValveState() { return valveState; }
    public void setValveState(Boolean valveState) { this.valveState = valveState; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public Double getMoistureThreshold() { return moistureThreshold; }
    public void setMoistureThreshold(Double moistureThreshold) { this.moistureThreshold = moistureThreshold; }

    public Double getFlowRateLpm() { return flowRateLpm; }
    public void setFlowRateLpm(Double flowRateLpm) { this.flowRateLpm = flowRateLpm; }

    public Double getWaterConsumedToday() { return waterConsumedToday; }
    public void setWaterConsumedToday(Double waterConsumedToday) { this.waterConsumedToday = waterConsumedToday; }

    public String getNextRunTime() { return nextRunTime; }
    public void setNextRunTime(String nextRunTime) { this.nextRunTime = nextRunTime; }

    public Integer getLastRunDurationMin() { return lastRunDurationMin; }
    public void setLastRunDurationMin(Integer lastRunDurationMin) { this.lastRunDurationMin = lastRunDurationMin; }
}
