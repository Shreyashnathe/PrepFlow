package com.placement.prepflow.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SubmissionDTO {
    // Maps Question ID to the User's Answer String
    private Map<Long, String> answers;
    private Integer timeTakenInSeconds; // Time taken by user for logic analysis
}
