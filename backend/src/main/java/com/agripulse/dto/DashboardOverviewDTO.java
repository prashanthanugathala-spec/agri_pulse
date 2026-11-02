package com.agripulse.dto;

import com.agripulse.entity.Alert;
import com.agripulse.entity.Crop;
import com.agripulse.entity.Parcel;
import com.agripulse.entity.Recommendation;
import com.agripulse.entity.WeatherData;

import java.util.List;

public class DashboardOverviewDTO {

    private String farmerName;
    private String farmName;
    private String location;
    private Double totalAreaAcres;
    private Double leasedAreaAcres;
    private Integer activeCropsCount;
    private String cropSummaryNames;
    private Double soilMoistureAvg;
    private Integer cropHealthScoreAvg;
    private Double waterConsumedTodayLiters;
    private Long activeAlertsCount;
    private Long criticalAlertsCount;

    private WeatherData currentWeather;
    private List<Parcel> parcels;
    private List<Crop> crops;
    private List<Alert> recentAlerts;
    private List<Recommendation> recommendations;

    public DashboardOverviewDTO() {}

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getTotalAreaAcres() { return totalAreaAcres; }
    public void setTotalAreaAcres(Double totalAreaAcres) { this.totalAreaAcres = totalAreaAcres; }

    public Double getLeasedAreaAcres() { return leasedAreaAcres; }
    public void setLeasedAreaAcres(Double leasedAreaAcres) { this.leasedAreaAcres = leasedAreaAcres; }

    public Integer getActiveCropsCount() { return activeCropsCount; }
    public void setActiveCropsCount(Integer activeCropsCount) { this.activeCropsCount = activeCropsCount; }

    public String getCropSummaryNames() { return cropSummaryNames; }
    public void setCropSummaryNames(String cropSummaryNames) { this.cropSummaryNames = cropSummaryNames; }

    public Double getSoilMoistureAvg() { return soilMoistureAvg; }
    public void setSoilMoistureAvg(Double soilMoistureAvg) { this.soilMoistureAvg = soilMoistureAvg; }

    public Integer getCropHealthScoreAvg() { return cropHealthScoreAvg; }
    public void setCropHealthScoreAvg(Integer cropHealthScoreAvg) { this.cropHealthScoreAvg = cropHealthScoreAvg; }

    public Double getWaterConsumedTodayLiters() { return waterConsumedTodayLiters; }
    public void setWaterConsumedTodayLiters(Double waterConsumedTodayLiters) { this.waterConsumedTodayLiters = waterConsumedTodayLiters; }

    public Long getActiveAlertsCount() { return activeAlertsCount; }
    public void setActiveAlertsCount(Long activeAlertsCount) { this.activeAlertsCount = activeAlertsCount; }

    public Long getCriticalAlertsCount() { return criticalAlertsCount; }
    public void setCriticalAlertsCount(Long criticalAlertsCount) { this.criticalAlertsCount = criticalAlertsCount; }

    public WeatherData getCurrentWeather() { return currentWeather; }
    public void setCurrentWeather(WeatherData currentWeather) { this.currentWeather = currentWeather; }

    public List<Parcel> getParcels() { return parcels; }
    public void setParcels(List<Parcel> parcels) { this.parcels = parcels; }

    public List<Crop> getCrops() { return crops; }
    public void setCrops(List<Crop> crops) { this.crops = crops; }

    public List<Alert> getRecentAlerts() { return recentAlerts; }
    public void setRecentAlerts(List<Alert> recentAlerts) { this.recentAlerts = recentAlerts; }

    public List<Recommendation> getRecommendations() { return recommendations; }
    public void setRecommendations(List<Recommendation> recommendations) { this.recommendations = recommendations; }
}
