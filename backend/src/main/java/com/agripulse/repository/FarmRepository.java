package com.agripulse.repository;

import com.agripulse.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {
    Optional<Farm> findFirstByOrderByIdAsc();
    Optional<Farm> findFirstByUserId(Long userId);
    java.util.List<Farm> findByUserId(Long userId);
}
