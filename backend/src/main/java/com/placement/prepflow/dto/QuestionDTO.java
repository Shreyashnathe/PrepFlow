package com.placement.prepflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String options; // JSON string
    private String difficulty;
}
