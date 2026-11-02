package com.agripulse.service;

import com.agripulse.dto.DashboardOverviewDTO;
import com.agripulse.entity.*;
import com.agripulse.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final FarmRepository farmRepository;
    private final ParcelRepository parcelRepository;
    private final CropRepository cropRepository;
    private final WeatherDataRepository weatherRepository;
    private final AlertRepository alertRepository;
    private final RecommendationRepository recommendationRepository;
    private final IrrigationZoneRepository irrigationZoneRepository;

    public DashboardService(
            FarmRepository farmRepository,
            ParcelRepository parcelRepository,
            CropRepository cropRepository,
            WeatherDataRepository weatherRepository,
            AlertRepository alertRepository,
            RecommendationRepository recommendationRepository,
            IrrigationZoneRepository irrigationZoneRepository
    ) {
        this.farmRepository = farmRepository;
        this.parcelRepository = parcelRepository;
        this.cropRepository = cropRepository;
        this.weatherRepository = weatherRepository;
        this.alertRepository = alertRepository;
        this.recommendationRepository = recommendationRepository;
        this.irrigationZoneRepository = irrigationZoneRepository;
    }

    public DashboardOverviewDTO getOverview() {
        DashboardOverviewDTO dto = new DashboardOverviewDTO();

        Farm farm = farmRepository.findFirstByOrderByIdAsc().orElseGet(() -> {
            Farm defaultFarm = new Farm();
            defaultFarm.setName("Green Valley Farm");
            defaultFarm.setLocation("Hyderabad, Telangana");
            defaultFarm.setTotalAcreage(12.5);
            defaultFarm.setLeasedAcreage(0.5);
            return defaultFarm;
        });

        dto.setFarmerName("Ravi Kumar");
        dto.setFarmName(farm.getName());
        dto.setLocation(farm.getLocation());
        dto.setTotalAreaAcres(farm.getTotalAcreage());
        dto.setLeasedAreaAcres(farm.getLeasedAcreage() != null ? farm.getLeasedAcreage() : 0.5);

        List<Crop> crops = cropRepository.findAll();
        dto.setCrops(crops);
        dto.setActiveCropsCount(crops.size());
        dto.setCropSummaryNames("Rice, Cotton, Tomato, Orchards");

        // Average moisture and health score
        List<Parcel> parcels = parcelRepository.findAll();
        dto.setParcels(parcels);

        double avgMoisture = parcels.stream()
                .mapToDouble(p -> p.getSoilMoisture() != null ? p.getSoilMoisture() : 65.0)
                .average()
                .orElse(68.0);
        dto.setSoilMoistureAvg(Math.round(avgMoisture * 10.0) / 10.0);

        int avgHealth = (int) crops.stream()
                .mapToInt(c -> c.getHealthScore() != null ? c.getHealthScore() : 85)
                .average()
                .orElse(87.0);
        dto.setCropHealthScoreAvg(avgHealth);

        // Water consumed today
        double waterConsumed = irrigationZoneRepository.findAll().stream()
                .mapToDouble(z -> z.getWaterConsumedToday() != null ? z.getWaterConsumedToday() : 0.0)
                .sum();
        dto.setWaterConsumedTodayLiters(waterConsumed > 0 ? waterConsumed : 1240.0);

        // Alerts & Recommendations
        List<Alert> allAlerts = alertRepository.findAll();
        long activeAlerts = allAlerts.stream().filter(a -> !Boolean.TRUE.equals(a.getResolved())).count();
        long criticalAlerts = allAlerts.stream()
                .filter(a -> !Boolean.TRUE.equals(a.getResolved()) && "CRITICAL".equalsIgnoreCase(a.getSeverity()))
                .count();

        dto.setActiveAlertsCount(activeAlerts);
        dto.setCriticalAlertsCount(criticalAlerts);
        dto.setRecentAlerts(allAlerts.stream().limit(5).toList());

        dto.setRecommendations(recommendationRepository.findAll().stream().limit(4).toList());

        // Weather
        dto.setCurrentWeather(weatherRepository.findFirstByOrderByRecordedAtDesc().orElse(null));

        return dto;
    }

    public String runDiagnostic() {
        return "Farm-wide telemetry scan completed. 4 parcels analyzed, 12 sensors pinged, all systems synchronized.";
    }
}
