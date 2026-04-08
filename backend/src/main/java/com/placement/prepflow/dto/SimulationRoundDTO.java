package com.placement.prepflow.dto;

import com.placement.prepflow.entity.RoundType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimulationRoundDTO {
    private Long id;
    private RoundType roundType;
    private Integer sequenceOrder;
    private String description;
}
