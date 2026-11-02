package com.agripulse.service;

import com.agripulse.entity.Crop;
import com.agripulse.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public List<Crop> getAllCrops(String status) {
        if (status != null && !status.isBlank()) {
            return cropRepository.findByStatus(status);
        }
        return cropRepository.findAll();
    }

    public Crop getCropById(Long id) {
        return cropRepository.findById(id).orElseThrow(() -> new RuntimeException("Crop not found with id " + id));
    }

    public Crop createCrop(Crop crop) {
        if (crop.getHealthScore() == null) crop.setHealthScore(90);
        if (crop.getStatus() == null) crop.setStatus("OPTIMAL");
        return cropRepository.save(crop);
    }

    public Crop updateCrop(Long id, Crop updated) {
        Crop crop = getCropById(id);
        if (updated.getName() != null) crop.setName(updated.getName());
        if (updated.getVariety() != null) crop.setVariety(updated.getVariety());
        if (updated.getSeason() != null) crop.setSeason(updated.getSeason());
        if (updated.getStage() != null) crop.setStage(updated.getStage());
        if (updated.getPlantingDate() != null) crop.setPlantingDate(updated.getPlantingDate());
        if (updated.getExpectedHarvestDate() != null) crop.setExpectedHarvestDate(updated.getExpectedHarvestDate());
        if (updated.getHealthScore() != null) crop.setHealthScore(updated.getHealthScore());
        if (updated.getYieldForecast() != null) crop.setYieldForecast(updated.getYieldForecast());
        if (updated.getWaterRequirement() != null) crop.setWaterRequirement(updated.getWaterRequirement());
        if (updated.getStatus() != null) crop.setStatus(updated.getStatus());
        return cropRepository.save(crop);
    }

    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }
}
