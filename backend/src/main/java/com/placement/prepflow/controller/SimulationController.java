package com.placement.prepflow.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.placement.prepflow.dto.AttemptReportDTO;
import com.placement.prepflow.dto.QuestionDTO;
import com.placement.prepflow.dto.SimulationRoundDTO;
import com.placement.prepflow.dto.SubmissionDTO;
import com.placement.prepflow.service.CompanyFlowService;
import com.placement.prepflow.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SimulationController {

    private final CompanyFlowService companyFlowService;
    private final EvaluationService evaluationService;

    @GetMapping("/roles/{roleId}/flow")
    public ResponseEntity<List<SimulationRoundDTO>> getSimulationFlow(@PathVariable Long roleId) {
        return ResponseEntity.ok(companyFlowService.getSimulationFlow(roleId));
    }

    @GetMapping("/rounds/{roundId}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestionsForRound(@PathVariable Long roundId) {
        return ResponseEntity.ok(companyFlowService.getQuestionsForRound(roundId));
    }

    @PostMapping("/attempts/start")
    public ResponseEntity<Long> startSimulation(@RequestParam Long userId, @RequestParam Long roleId) {
        return ResponseEntity.ok(evaluationService.startSimulation(userId, roleId));
    }

    @PostMapping("/attempts/{attemptId}/rounds/{roundId}/submit")
    public ResponseEntity<String> submitRoundAnswers(@PathVariable Long attemptId,
                                                     @PathVariable Long roundId,
                                                     @RequestBody SubmissionDTO submissionDTO) throws JsonProcessingException {
        evaluationService.evaluateRoundSubmission(attemptId, roundId, submissionDTO);
        return ResponseEntity.ok("Round submitted successfully");
    }

    @GetMapping("/attempts/{attemptId}/report")
    public ResponseEntity<AttemptReportDTO> getAttemptReport(@PathVariable Long attemptId) {
        return ResponseEntity.ok(evaluationService.getAttemptReport(attemptId));
    }
}
