package com.agripulse.service;

import com.agripulse.entity.Farm;
import com.agripulse.entity.Parcel;
import com.agripulse.repository.FarmRepository;
import com.agripulse.repository.ParcelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    private final FarmRepository farmRepository;
    private final ParcelRepository parcelRepository;

    public FarmService(FarmRepository farmRepository, ParcelRepository parcelRepository) {
        this.farmRepository = farmRepository;
        this.parcelRepository = parcelRepository;
    }

    public Farm getFarm() {
        return farmRepository.findFirstByOrderByIdAsc().orElseThrow(() -> new RuntimeException("Farm not found"));
    }

    public List<Parcel> getParcels() {
        return parcelRepository.findAll();
    }

    public Parcel getParcelById(Long id) {
        return parcelRepository.findById(id).orElseThrow(() -> new RuntimeException("Parcel not found with id " + id));
    }

    public Parcel updateParcel(Long id, Parcel updated) {
        Parcel parcel = getParcelById(id);
        if (updated.getName() != null) parcel.setName(updated.getName());
        if (updated.getAcreage() != null) parcel.setAcreage(updated.getAcreage());
        if (updated.getCropName() != null) parcel.setCropName(updated.getCropName());
        if (updated.getSoilMoisture() != null) parcel.setSoilMoisture(updated.getSoilMoisture());
        if (updated.getSoilPh() != null) parcel.setSoilPh(updated.getSoilPh());
        if (updated.getCropStage() != null) parcel.setCropStage(updated.getCropStage());
        if (updated.getIrrigationStatus() != null) parcel.setIrrigationStatus(updated.getIrrigationStatus());
        return parcelRepository.save(parcel);
    }
}
