package com.agripulse.repository;

import com.agripulse.entity.PestDiagnostic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PestDiagnosticRepository extends JpaRepository<PestDiagnostic, Long> {
    List<PestDiagnostic> findAllByOrderByDiagnosedAtDesc();
}
