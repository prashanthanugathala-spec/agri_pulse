package com.agripulse.repository;

import com.agripulse.entity.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    Optional<WeatherData> findFirstByOrderByRecordedAtDesc();
}
