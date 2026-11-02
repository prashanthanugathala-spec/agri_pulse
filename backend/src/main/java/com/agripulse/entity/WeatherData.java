package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false)
    private Double temperature;

    @Column(name = "condition_name", nullable = false, length = 50)
    private String conditionName;

    @Column(nullable = false)
    private Integer humidity;

    @Column(name = "wind_speed", nullable = false)
    private Double windSpeed;

    @Column(name = "uv_index")
    private Integer uvIndex = 7;

    private Double evapotranspiration = 4.6;

    @Column(name = "rain_probability")
    private Integer rainProbability = 10;

    @Column(name = "forecast_json", columnDefinition = "TEXT")
    private String forecastJson;

    @Column(name = "advisories_json", columnDefinition = "TEXT")
    private String advisoriesJson;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public WeatherData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getConditionName() { return conditionName; }
    public void setConditionName(String conditionName) { this.conditionName = conditionName; }

    public Integer getHumidity() { return humidity; }
    public void setHumidity(Integer humidity) { this.humidity = humidity; }

    public Double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(Double windSpeed) { this.windSpeed = windSpeed; }

    public Integer getUvIndex() { return uvIndex; }
    public void setUvIndex(Integer uvIndex) { this.uvIndex = uvIndex; }

    public Double getEvapotranspiration() { return evapotranspiration; }
    public void setEvapotranspiration(Double evapotranspiration) { this.evapotranspiration = evapotranspiration; }

    public Integer getRainProbability() { return rainProbability; }
    public void setRainProbability(Integer rainProbability) { this.rainProbability = rainProbability; }

    public String getForecastJson() { return forecastJson; }
    public void setForecastJson(String forecastJson) { this.forecastJson = forecastJson; }

    public String getAdvisoriesJson() { return advisoriesJson; }
    public void setAdvisoriesJson(String advisoriesJson) { this.advisoriesJson = advisoriesJson; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
