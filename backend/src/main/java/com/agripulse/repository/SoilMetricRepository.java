package com.agripulse.repository;

import com.agripulse.entity.SoilMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SoilMetricRepository extends JpaRepository<SoilMetric, Long> {
    Optional<SoilMetric> findFirstByOrderByIdDesc();
}
