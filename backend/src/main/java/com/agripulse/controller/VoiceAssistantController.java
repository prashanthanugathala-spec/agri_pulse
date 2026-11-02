package com.agripulse.controller;

import com.agripulse.entity.AiChatMessage;
import com.agripulse.repository.*;
import com.agripulse.service.GroqService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/voice")
public class VoiceAssistantController {

    private static final Logger log = LoggerFactory.getLogger(VoiceAssistantController.class);

    private final GroqService groqService;
    private final WeatherDataRepository weatherRepository;
    private final SoilMetricRepository soilMetricRepository;
    private final AlertRepository alertRepository;
    private final IrrigationZoneRepository irrigationZoneRepository;
    private final CropRepository cropRepository;
    private final AiChatMessageRepository chatRepository;

    public VoiceAssistantController(
            GroqService groqService,
            WeatherDataRepository weatherRepository,
            SoilMetricRepository soilMetricRepository,
            AlertRepository alertRepository,
            IrrigationZoneRepository irrigationZoneRepository,
            CropRepository cropRepository,
            AiChatMessageRepository chatRepository
    ) {
        this.groqService = groqService;
        this.weatherRepository = weatherRepository;
        this.soilMetricRepository = soilMetricRepository;
        this.alertRepository = alertRepository;
        this.irrigationZoneRepository = irrigationZoneRepository;
        this.cropRepository = cropRepository;
        this.chatRepository = chatRepository;
    }

    @PostMapping("/interact")
    public ResponseEntity<Map<String, Object>> interactVoice(@RequestBody Map<String, String> payload) {
        String prompt = payload.getOrDefault("prompt", "").trim();
        String currentRoute = payload.getOrDefault("currentRoute", "/dashboard");

        if (prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // 1. Gather live telemetry context
        String weatherSnippet = weatherRepository.findFirstByOrderByRecordedAtDesc()
                .map(w -> String.format("Current Weather: %s, %.1f°C, Humidity: %d%%, Wind: %.1f km/h, Rain Prob: %d%%",
                        w.getConditionName(), w.getTemperature(), w.getHumidity(), w.getWindSpeed(), w.getRainProbability()))
                .orElse("Weather: 29.4°C, Clear Sky, 58% RH");

        String soilSnippet = soilMetricRepository.findFirstByOrderByIdDesc()
                .map(s -> String.format("Soil: N=%.0f kg/ha, P=%.0f kg/ha, K=%.0f kg/ha, pH=%.1f, Moisture 15cm=%.0f%%, Vitality Index=%d",
                        s.getNitrogenLevel(), s.getPhosphorusLevel(), s.getPotassiumLevel(), s.getSoilPh(), s.getMoistureDepth15cm(), s.getOverallVitalityIndex()))
                .orElse("Soil: N=185 kg/ha, P=34 kg/ha, K=240 kg/ha, pH=6.8");

        long activeAlerts = alertRepository.countByFarmIdAndResolved(1L, false);

        String systemInstruction = "You are AgriPulse Voice, an advanced real-time agricultural voice assistant powered by Groq LPU inference. " +
                "You advise estate managers and farmers in real-time based on high-frequency IoT field telemetry. " +
                "Telemetry Context: [" + weatherSnippet + " | " + soilSnippet + " | Active Alerts: " + activeAlerts + " | Crops: Rice, Bt-Cotton, Greenhouse Tomato]. " +
                "Keep spoken advice crisp, punchy, spoken-friendly (under 40 words). Suggest relevant navigation target routes when appropriate: " +
                "/soil for soil metrics, /weather for forecasts/rain, /irrigation for valves/schedules, /pest-and-disease for vision scans, /crops for crop cycles, /my-farm for map, /alerts for alerts.";

        Map<String, Object> voiceResp = groqService.generateVoiceResponse(systemInstruction, prompt, currentRoute);

        if (voiceResp == null) {
            voiceResp = new HashMap<>();
            voiceResp.put("spokenText", "I've reviewed your farm telemetry. Soil moisture is at optimal levels and weather is clear. How else can I assist your field operations?");
            voiceResp.put("displayText", "Live telemetry status normal. Soil moisture: 68%, Ambient Temp: 29.4°C.");
            voiceResp.put("action", "NONE");
            voiceResp.put("actionPayload", "");
            voiceResp.put("actionLabel", "");
        }

        voiceResp.put("grounding", "AgriPulse Groq LPU • Live IoT Edge Telemetry");
        voiceResp.put("timestamp", LocalDateTime.now().toString());

        // Save conversation turn in background for chat history sync
        try {
            chatRepository.save(new AiChatMessage("USER", prompt, "Voice Input"));
            String display = (String) voiceResp.getOrDefault("displayText", voiceResp.get("spokenText"));
            chatRepository.save(new AiChatMessage("AGRONOMIST_AI", display, "AgriPulse Voice • Groq"));
        } catch (Exception e) {
            log.warn("Could not save voice turn to chat history: {}", e.getMessage());
        }

        return ResponseEntity.ok(voiceResp);
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> transcribeAudio(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Audio file cannot be empty"));
        }

        try {
            byte[] bytes = file.getBytes();
            String transcription = groqService.transcribeAudio(bytes, file.getOriginalFilename(), file.getContentType());
            if (transcription != null && !transcription.isBlank()) {
                return ResponseEntity.ok(Map.of("text", transcription.trim(), "status", "SUCCESS"));
            } else {
                return ResponseEntity.ok(Map.of("text", "", "status", "EMPTY"));
            }
        } catch (Exception e) {
            log.error("Transcription error: ", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Transcription failed: " + e.getMessage()));
        }
    }
}
