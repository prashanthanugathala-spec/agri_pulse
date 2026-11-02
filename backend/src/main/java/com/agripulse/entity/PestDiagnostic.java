package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pest_diagnostics")
public class PestDiagnostic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "crop_name", nullable = false, length = 100)
    private String cropName;

    @Column(name = "issue_name", nullable = false, length = 150)
    private String issueName;

    @Column(nullable = false, length = 50)
    private String severity;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "affected_zone", length = 100)
    private String affectedZone;

    @Column(name = "treatment_recommendation", columnDefinition = "TEXT")
    private String treatmentRecommendation;

    @Column(name = "ai_analysis_summary", columnDefinition = "TEXT")
    private String aiAnalysisSummary;

    @Column(name = "diagnosed_at")
    private LocalDateTime diagnosedAt = LocalDateTime.now();

    public PestDiagnostic() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public String getIssueName() { return issueName; }
    public void setIssueName(String issueName) { this.issueName = issueName; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAffectedZone() { return affectedZone; }
    public void setAffectedZone(String affectedZone) { this.affectedZone = affectedZone; }

    public String getTreatmentRecommendation() { return treatmentRecommendation; }
    public void setTreatmentRecommendation(String treatmentRecommendation) { this.treatmentRecommendation = treatmentRecommendation; }

    public String getAiAnalysisSummary() { return aiAnalysisSummary; }
    public void setAiAnalysisSummary(String aiAnalysisSummary) { this.aiAnalysisSummary = aiAnalysisSummary; }

    public LocalDateTime getDiagnosedAt() { return diagnosedAt; }
    public void setDiagnosedAt(LocalDateTime diagnosedAt) { this.diagnosedAt = diagnosedAt; }
}
