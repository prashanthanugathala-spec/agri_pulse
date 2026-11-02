package com.agripulse.service;

import com.agripulse.entity.WeatherData;
import com.agripulse.repository.WeatherDataRepository;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    private final WeatherDataRepository weatherRepository;

    public WeatherService(WeatherDataRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    public WeatherData getCurrentWeather() {
        return weatherRepository.findFirstByOrderByRecordedAtDesc().orElseGet(() -> {
            WeatherData weather = new WeatherData();
            weather.setLocation("Hyderabad, Telangana");
            weather.setTemperature(29.4);
            weather.setConditionName("Clear Sky");
            weather.setHumidity(58);
            weather.setWindSpeed(12.0);
            weather.setUvIndex(7);
            weather.setEvapotranspiration(4.6);
            weather.setRainProbability(10);
            return weather;
        });
    }
}
