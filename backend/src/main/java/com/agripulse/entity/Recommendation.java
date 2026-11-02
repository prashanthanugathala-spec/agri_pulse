package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, length = 50)
    private String priority; // HIGH, MEDIUM, LOW

    @Column(name = "impact_category", nullable = false, length = 50)
    private String impactCategory; // WATER_SAVING, YIELD, FERTILIZER, SOIL_VITALITY

    @Column(name = "action_cta", length = 100)
    private String actionCta;

    private Boolean completed = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Recommendation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getImpactCategory() { return impactCategory; }
    public void setImpactCategory(String impactCategory) { this.impactCategory = impactCategory; }

    public String getActionCta() { return actionCta; }
    public void setActionCta(String actionCta) { this.actionCta = actionCta; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
