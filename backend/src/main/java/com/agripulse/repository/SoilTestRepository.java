package com.agripulse.repository;

import com.agripulse.entity.SoilTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoilTestRepository extends JpaRepository<SoilTest, Long> {
    List<SoilTest> findAllByOrderByTestedDateDesc();
}
