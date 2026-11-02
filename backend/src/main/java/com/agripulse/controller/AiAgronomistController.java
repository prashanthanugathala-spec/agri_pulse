package com.agripulse.controller;

import com.agripulse.entity.AiChatMessage;
import com.agripulse.service.AiAgronomistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAgronomistController {

    private final AiAgronomistService aiService;

    public AiAgronomistController(AiAgronomistService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<AiChatMessage>> getHistory() {
        return ResponseEntity.ok(aiService.getHistory());
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatMessage> sendMessage(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "Hello Agronomist");
        return ResponseEntity.ok(aiService.handleUserPrompt(prompt));
    }

    @DeleteMapping("/messages")
    public ResponseEntity<Map<String, String>> clearMessages() {
        aiService.clearHistory();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "Chat history reset."));
    }
}
