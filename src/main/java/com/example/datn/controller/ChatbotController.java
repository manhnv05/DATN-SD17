package com.example.datn.controller;

import com.example.datn.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/message")
    public Mono<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        return geminiService.askGemini(userMessage)
                .map(reply -> Map.of("reply", reply));
    }
}
