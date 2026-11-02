package com.agripulse.repository;

import com.agripulse.entity.SensorDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorDeviceRepository extends JpaRepository<SensorDevice, Long> {
    List<SensorDevice> findByFarmId(Long farmId);
    Optional<SensorDevice> findByDeviceCode(String deviceCode);
}
