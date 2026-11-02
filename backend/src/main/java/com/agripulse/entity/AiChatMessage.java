package com.agripulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_messages")
public class AiChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String sender; // USER or AGRONOMIST_AI

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "grounding_sources", length = 255)
    private String groundingSources;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AiChatMessage() {}

    public AiChatMessage(String sender, String message, String groundingSources) {
        this.sender = sender;
        this.message = message;
        this.groundingSources = groundingSources;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getGroundingSources() { return groundingSources; }
    public void setGroundingSources(String groundingSources) { this.groundingSources = groundingSources; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
