package com.agripulse.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.models:gemini-3.5-flash,gemini-flash-latest,gemini-3.8-flash,gemini-3-flash-preview}")
    private String configuredModels;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    private List<String> getModelList() {
        if (configuredModels == null || configuredModels.isBlank()) {
            return List.of("gemini-3.5-flash", "gemini-flash-latest", "gemini-3.8-flash");
        }
        return Arrays.stream(configuredModels.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    /**
     * Text completion with automatic model fallback
     */
    public String generateContent(String systemInstruction, String userPrompt) {
        List<String> models = getModelList();
        Exception lastException = null;

        for (String model : models) {
            try {
                String cleanModel = model.startsWith("models/") ? model.substring(7) : model;
                String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + cleanModel + ":generateContent?key=" + apiKey;

                Map<String, Object> requestBody = new HashMap<>();
                if (systemInstruction != null && !systemInstruction.isBlank()) {
                    requestBody.put("systemInstruction", Map.of(
                            "parts", List.of(Map.of("text", systemInstruction))
                    ));
                }

                requestBody.put("contents", List.of(
                        Map.of("parts", List.of(Map.of("text", userPrompt)))
                ));

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(25))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && !candidates.isEmpty()) {
                        JsonNode parts = candidates.get(0).path("content").path("parts");
                        if (parts.isArray() && !parts.isEmpty()) {
                            return parts.get(0).path("text").asText();
                        }
                    }
                } else {
                    log.warn("Gemini model {} returned status {}: {}", cleanModel, response.statusCode(), response.body());
                }
            } catch (Exception e) {
                lastException = e;
                log.warn("Error calling Gemini model {}: {}", model, e.getMessage());
            }
        }

        if (lastException != null) {
            log.error("All Gemini models exhausted. Returning fallback response.", lastException);
        }
        return null;
    }

    /**
     * Multimodal image analysis with Gemini
     */
    public String analyzeImage(byte[] imageBytes, String mimeType, String prompt) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        List<String> models = getModelList();
        Exception lastException = null;

        for (String model : models) {
            try {
                String cleanModel = model.startsWith("models/") ? model.substring(7) : model;
                String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + cleanModel + ":generateContent?key=" + apiKey;

                Map<String, Object> imagePart = Map.of(
                        "inlineData", Map.of(
                                "mimeType", (mimeType != null && !mimeType.isBlank()) ? mimeType : "image/jpeg",
                                "data", base64Image
                        )
                );

                Map<String, Object> textPart = Map.of("text", prompt);

                Map<String, Object> requestBody = Map.of(
                        "contents", List.of(
                                Map.of("parts", List.of(textPart, imagePart))
                        )
                );

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(30))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && !candidates.isEmpty()) {
                        JsonNode parts = candidates.get(0).path("content").path("parts");
                        if (parts.isArray() && !parts.isEmpty()) {
                            return parts.get(0).path("text").asText();
                        }
                    }
                } else {
                    log.warn("Gemini vision model {} returned status {}: {}", cleanModel, response.statusCode(), response.body());
                }
            } catch (Exception e) {
                lastException = e;
                log.warn("Error calling Gemini vision on model {}: {}", model, e.getMessage());
            }
        }

        if (lastException != null) {
            log.error("All Gemini vision models exhausted.", lastException);
        }
        return null;
    }
}
