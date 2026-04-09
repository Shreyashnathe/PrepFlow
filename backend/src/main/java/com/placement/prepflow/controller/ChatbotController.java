package com.placement.prepflow.controller;

import com.placement.prepflow.service.OpenRouterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Ensuring the frontend floating React widget can ping it directly
public class ChatbotController {

    private final OpenRouterService openRouterService;

    public ChatbotController(OpenRouterService openRouterService) {
        this.openRouterService = openRouterService;
    }

    // A simple POST mapping to allow handling of incredibly dense/huge payload inputs (for pasted code checks).
    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askChatbot(@RequestBody Map<String, String> payload) {
        String prompt = payload.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("response", "Error: Prompt cannot be empty."));
        }

        String response = openRouterService.chat(prompt);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
