package com.placement.prepflow.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class AttemptReportDTO {
    private Long attemptId;
    private Double totalScore;
    private String readinessLevel; // NOT READY, ALMOST READY, READY
    private Map<String, Double> roundScores; // e.g {"APTITUDE": 80, "CODING": 60}
    private String overallFeedback;
}
