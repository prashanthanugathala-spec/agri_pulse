package com.agripulse.controller;

import com.agripulse.entity.Recommendation;
import com.agripulse.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<Recommendation>> getRecommendations() {
        return ResponseEntity.ok(recommendationService.getRecommendations());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Recommendation> completeRecommendation(@PathVariable Long id) {
        return ResponseEntity.ok(recommendationService.completeRecommendation(id));
    }
}
