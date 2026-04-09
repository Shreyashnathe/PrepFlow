package com.placement.prepflow.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttemptHistoryDTO {
    private Long attemptId;
    private String companyName;
    private String roleName;
    private String status;
    private Double totalScore;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
