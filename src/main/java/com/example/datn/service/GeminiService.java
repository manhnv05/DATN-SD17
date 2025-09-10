package com.example.datn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GeminiService {

    @Value("${gemini.api.key}") // Đặt biến này trong application.properties
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GeminiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent")
                .build();
    }

    public Mono<String> askGemini(String message) {
        String requestBody = String.format(
                "{\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"%s\"}]}]}",
                message.replace("\"", "\\\"")
        );
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("key", apiKey)
                        .build())
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractGeminiReply);
    }

    private String extractGeminiReply(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.at("/candidates/0/content/parts/0/text");
            if (textNode != null && !textNode.isMissingNode()) {
                return textNode.asText();
            }
        } catch (Exception e) {
            return "Lỗi phân tích phản hồi từ Gemini: " + e.getMessage();
        }
        return "Không nhận được phản hồi phù hợp từ Gemini.";
    }
}