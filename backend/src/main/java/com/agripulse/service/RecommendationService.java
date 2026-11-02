package com.agripulse.service;

import com.agripulse.entity.Recommendation;
import com.agripulse.repository.RecommendationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;

    public RecommendationService(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    public List<Recommendation> getRecommendations() {
        return recommendationRepository.findAll();
    }

    public Recommendation completeRecommendation(Long id) {
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found with id " + id));
        rec.setCompleted(true);
        return recommendationRepository.save(rec);
    }
}
