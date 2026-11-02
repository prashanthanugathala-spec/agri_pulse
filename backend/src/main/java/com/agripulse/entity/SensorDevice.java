package com.agripulse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sensor_devices")
public class SensorDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "device_code", nullable = false, unique = true, length = 50)
    private String deviceCode;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(name = "parcel_code", length = 50)
    private String parcelCode;

    @Column(name = "battery_percentage")
    private Integer batteryPercentage = 95;

    @Column(name = "signal_rssi", length = 50)
    private String signalRssi = "-68 dBm (Strong)";

    @Column(length = 50)
    private String status = "ONLINE";

    @Column(name = "last_ping", length = 100)
    private String lastPing;

    @Column(name = "reading_display", length = 100)
    private String readingDisplay;

    public SensorDevice() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getDeviceCode() { return deviceCode; }
    public void setDeviceCode(String deviceCode) { this.deviceCode = deviceCode; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getParcelCode() { return parcelCode; }
    public void setParcelCode(String parcelCode) { this.parcelCode = parcelCode; }

    public Integer getBatteryPercentage() { return batteryPercentage; }
    public void setBatteryPercentage(Integer batteryPercentage) { this.batteryPercentage = batteryPercentage; }

    public String getSignalRssi() { return signalRssi; }
    public void setSignalRssi(String signalRssi) { this.signalRssi = signalRssi; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLastPing() { return lastPing; }
    public void setLastPing(String lastPing) { this.lastPing = lastPing; }

    public String getReadingDisplay() { return readingDisplay; }
    public void setReadingDisplay(String readingDisplay) { this.readingDisplay = readingDisplay; }
}
