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
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@Service
public class GroqService {

    private static final Logger log = LoggerFactory.getLogger(GroqService.class);

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.models:openai/gpt-oss-120b,openai/gpt-oss-20b,qwen/qwen3.8-27b}")
    private String configuredModels;

    @Value("${groq.whisper.model:whisper-large-v3-turbo}")
    private String whisperModel;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GroqService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(12))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    private List<String> getModelList() {
        if (configuredModels == null || configuredModels.isBlank()) {
            return List.of("openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b");
        }
        return Arrays.stream(configuredModels.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    /**
     * Chat completion using Groq with fast fallback across models
     */
    public String generateChatCompletion(String systemInstruction, String userPrompt) {
        List<String> models = getModelList();
        Exception lastException = null;

        for (String model : models) {
            try {
                String endpoint = "https://api.groq.com/openai/v1/chat/completions";

                List<Map<String, String>> messages = new ArrayList<>();
                if (systemInstruction != null && !systemInstruction.isBlank()) {
                    messages.add(Map.of("role", "system", "content", systemInstruction));
                }
                messages.add(Map.of("role", "user", "content", userPrompt));

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("model", model);
                requestBody.put("messages", messages);
                requestBody.put("temperature", 0.6);
                requestBody.put("max_tokens", 500);

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(15))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && !choices.isEmpty()) {
                        String text = choices.get(0).path("message").path("content").asText();
                        if (text != null && !text.isBlank()) {
                            log.info("Groq model {} generated response in {}s", model,
                                    root.path("usage").path("total_time").asDouble());
                            return text.trim();
                        }
                    }
                } else {
                    log.warn("Groq model {} returned status {}: {}", model, response.statusCode(), response.body());
                }
            } catch (Exception e) {
                lastException = e;
                log.warn("Error calling Groq model {}: {}", model, e.getMessage());
            }
        }

        if (lastException != null) {
            log.error("All Groq models failed", lastException);
        }
        return null;
    }

    /**
     * Specialized voice assistant completion: generates concise spoken text + rich display and action intent
     */
    public Map<String, Object> generateVoiceResponse(String systemInstruction, String userSpeech, String currentRoute) {
        String voiceSystemPrompt = systemInstruction + "\n\n" +
                "CRITICAL INSTRUCTIONS FOR VOICE ASSISTANT:\n" +
                "1. Generate a JSON response with keys: 'spokenText', 'displayText', 'action', 'actionPayload', 'actionLabel'.\n" +
                "2. 'spokenText': Must be short, natural, friendly, conversational, and direct for Speech Synthesis (1-3 clear sentences, under 45 words). No markdown or asterisks in spokenText.\n" +
                "3. 'displayText': Richer summary with key facts, values, or bullet points if helpful.\n" +
                "4. 'action': One of: 'NAVIGATE' (if user asks to go to a section, or if relevant to the topic), 'TRIGGER_IRRIGATION', 'VIEW_ALERTS', 'NONE'.\n" +
                "5. 'actionPayload': Target route (e.g. '/soil', '/weather', '/irrigation', '/pest-and-disease', '/crops', '/my-farm', '/analytics', '/sensors', '/alerts') or parameter.\n" +
                "6. 'actionLabel': User-friendly button label (e.g. 'View Soil Matrix', 'Check Rain Forecast', 'Open Irrigation Zones').\n" +
                "Current user location in app: " + (currentRoute != null ? currentRoute : "/dashboard") + ".\n" +
                "Output strictly valid JSON only without backticks.";

        List<String> models = getModelList();
        for (String model : models) {
            try {
                String endpoint = "https://api.groq.com/openai/v1/chat/completions";

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("model", model);
                requestBody.put("messages", List.of(
                        Map.of("role", "system", "content", voiceSystemPrompt),
                        Map.of("role", "user", "content", userSpeech)
                ));
                requestBody.put("temperature", 0.4);
                requestBody.put("max_tokens", 450);
                requestBody.put("response_format", Map.of("type", "json_object"));

                String jsonPayload = objectMapper.writeValueAsString(requestBody);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(endpoint))
                        .header("Authorization", "Bearer " + apiKey)
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(15))
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 200) {
                    JsonNode root = objectMapper.readTree(response.body());
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && !choices.isEmpty()) {
                        String rawContent = choices.get(0).path("message").path("content").asText();
                        try {
                            JsonNode parsedJson = objectMapper.readTree(rawContent);
                            Map<String, Object> result = new HashMap<>();
                            result.put("spokenText", parsedJson.path("spokenText").asText(""));
                            result.put("displayText", parsedJson.path("displayText").asText(""));
                            result.put("action", parsedJson.path("action").asText("NONE"));
                            result.put("actionPayload", parsedJson.path("actionPayload").asText(""));
                            result.put("actionLabel", parsedJson.path("actionLabel").asText(""));
                            return result;
                        } catch (Exception parseEx) {
                            log.warn("Failed to parse JSON voice output from Groq, raw: {}", rawContent);
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Groq voice completion error with model {}: {}", model, e.getMessage());
            }
        }

        // Fallback if JSON format or model failed
        String rawText = generateChatCompletion(voiceSystemPrompt, userSpeech);
        if (rawText != null) {
            Map<String, Object> fallbackMap = new HashMap<>();
            fallbackMap.put("spokenText", rawText);
            fallbackMap.put("displayText", rawText);
            fallbackMap.put("action", "NONE");
            fallbackMap.put("actionPayload", "");
            fallbackMap.put("actionLabel", "");
            return fallbackMap;
        }

        return null;
    }

    /**
     * Transcribe audio bytes with Groq Whisper API
     */
    public String transcribeAudio(byte[] audioBytes, String filename, String mimeType) {
        try {
            String boundary = "----GroqBoundary" + UUID.randomUUID().toString().replace("-", "");
            String endpoint = "https://api.groq.com/openai/v1/audio/transcriptions";

            String headerPart = "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; name=\"model\"\r\n\r\n" +
                    whisperModel + "\r\n" +
                    "--" + boundary + "\r\n" +
                    "Content-Disposition: form-data; name=\"file\"; filename=\"" + (filename != null ? filename : "speech.webm") + "\"\r\n" +
                    "Content-Type: " + (mimeType != null ? mimeType : "audio/webm") + "\r\n\r\n";

            String footerPart = "\r\n--" + boundary + "--\r\n";

            byte[] headerBytes = headerPart.getBytes(StandardCharsets.UTF_8);
            byte[] footerBytes = footerPart.getBytes(StandardCharsets.UTF_8);

            byte[] fullPayload = new byte[headerBytes.length + audioBytes.length + footerBytes.length];
            System.arraycopy(headerBytes, 0, fullPayload, 0, headerBytes.length);
            System.arraycopy(audioBytes, 0, fullPayload, headerBytes.length, audioBytes.length);
            System.arraycopy(footerBytes, 0, fullPayload, headerBytes.length + audioBytes.length, footerBytes.length);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(endpoint))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofByteArray(fullPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                return root.path("text").asText();
            } else {
                log.warn("Groq Whisper transcription failed status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("Error during Groq Whisper audio transcription", e);
        }
        return null;
    }
}
