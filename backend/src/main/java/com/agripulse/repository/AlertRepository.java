package com.agripulse.repository;

import com.agripulse.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByFarmId(Long farmId);
    List<Alert> findByFarmIdAndResolved(Long farmId, Boolean resolved);
    long countByFarmIdAndResolved(Long farmId, Boolean resolved);
}
