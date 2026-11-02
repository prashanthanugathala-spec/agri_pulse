package com.agripulse.repository;

import com.agripulse.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByFarmId(Long farmId);
    List<Crop> findByStatus(String status);
}
