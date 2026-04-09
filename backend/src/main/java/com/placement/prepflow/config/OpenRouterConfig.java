package com.placement.prepflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class OpenRouterConfig {

    @Bean
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder()
                .requestInterceptor((request, body, execution) -> {
                    request.getHeaders().add("HTTP-Referer", "http://localhost:8080");
                    request.getHeaders().add("X-OpenRouter-Title", "PrepFlow-Simulator");
                    return execution.execute(request, body);
                });
    }
}
