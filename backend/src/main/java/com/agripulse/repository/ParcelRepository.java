package com.agripulse.repository;

import com.agripulse.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    List<Parcel> findByFarmId(Long farmId);
    Optional<Parcel> findByCode(String code);
}
