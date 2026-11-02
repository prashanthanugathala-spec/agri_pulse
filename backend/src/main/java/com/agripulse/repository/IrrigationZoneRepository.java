package com.agripulse.repository;

import com.agripulse.entity.IrrigationZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IrrigationZoneRepository extends JpaRepository<IrrigationZone, Long> {
    List<IrrigationZone> findByFarmId(Long farmId);
}
