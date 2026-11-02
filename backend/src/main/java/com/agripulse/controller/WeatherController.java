package com.agripulse.controller;

import com.agripulse.entity.WeatherData;
import com.agripulse.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public ResponseEntity<WeatherData> getCurrentWeather() {
        return ResponseEntity.ok(weatherService.getCurrentWeather());
    }
}
