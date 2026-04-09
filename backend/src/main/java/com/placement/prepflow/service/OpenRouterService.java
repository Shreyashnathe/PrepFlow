package com.placement.prepflow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class OpenRouterService {

    private final RestClient restClient;
    private final String model;
    private final long maxCompletionTokens;

    public OpenRouterService(
            RestClient.Builder restClientBuilder,
            @Value("${openrouter.api-key}") String apiKey,
            @Value("${openrouter.base-url:https://openrouter.ai/api/v1}") String baseUrl,
            @Value("${openrouter.model:openai/gpt-4o-mini}") String model,
            @Value("${openrouter.max-completion-tokens:1024}") long maxCompletionTokens
    ) {
        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
        this.model = model;
        this.maxCompletionTokens = maxCompletionTokens;
    }

    public String chat(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "model", this.model,
                "max_tokens", this.maxCompletionTokens,
                "messages", List.of(
                    Map.of(
                        "role", "system",
                        "content", "You are a highly skilled placement preparation and coding AI assistant integrated inside PrepFlow. Keep your answers technical, concise, and heavily formatted using markdown, especially for code blocks. Never hallucinate facts."
                    ),
                    Map.of(
                        "role", "user",
                        "content", prompt
                    )
                )
            );

            Map response = restClient.post()
                    .uri("/chat/completions")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            return "No response received from the AI model.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Internal Error: Unable to reach the Chatbot Service. Make sure connection is stable!";
        }
    }
}
