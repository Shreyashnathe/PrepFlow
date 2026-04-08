package com.placement.prepflow.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placement.prepflow.dto.AttemptReportDTO;
import com.placement.prepflow.dto.SubmissionDTO;
import com.placement.prepflow.entity.*;
import com.placement.prepflow.exception.ResourceNotFoundException;
import com.placement.prepflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final UserAttemptRepository userAttemptRepository;
    private final RoundAttemptRepository roundAttemptRepository;
    private final SimulationRoundRepository simulationRoundRepository;
    private final QuestionRepository questionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public Long startSimulation(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        UserAttempt attempt = UserAttempt.builder()
                .user(user)
                .role(role)
                .status("IN_PROGRESS")
                .startedAt(LocalDateTime.now())
                .totalScore(0.0)
                .build();
        
        return userAttemptRepository.save(attempt).getId();
    }

    public void evaluateRoundSubmission(Long userAttemptId, Long roundId, SubmissionDTO submissionDTO) throws JsonProcessingException {
        UserAttempt attempt = userAttemptRepository.findById(userAttemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        
        SimulationRound round = simulationRoundRepository.findById(roundId)
                .orElseThrow(() -> new ResourceNotFoundException("Round not found"));

        List<Question> questions = questionRepository.findBySimulationRoundId(roundId);
        
        double score = 0.0;
        double maxScore = questions.size() * 10.0; // Assume 10 points per question
        StringBuilder feedback = new StringBuilder("Round Analysis:\n");

        for (Question q : questions) {
            String userAnswer = submissionDTO.getAnswers().get(q.getId());
            if (userAnswer != null) {
                if (round.getRoundType() == RoundType.APTITUDE || round.getRoundType() == RoundType.TECHNICAL_INTERVIEW) {
                    if (userAnswer.trim().equalsIgnoreCase(q.getExpectedAnswer().trim())) {
                        score += 10.0;
                    } else {
                        feedback.append("Question ").append(q.getId()).append(" incorrect. Expected: ").append(q.getExpectedAnswer()).append(". ");
                    }
                } else if (round.getRoundType() == RoundType.CODING) {
                    // Very basic mock coding evaluation
                    if (userAnswer.contains(q.getExpectedAnswer())) {
                        score += 10.0;
                    } else {
                        feedback.append("Coding test failed for Q").append(q.getId()).append(". Missing key output: ").append(q.getExpectedAnswer()).append(". ");
                    }
                } else {
                    // HR interview mock grade
                    score += 8.0; // Giving default points for submitting HR
                    feedback.append("HR answer submitted. Evaluated positively. ");
                }
            }
        }
        
        if (submissionDTO.getTimeTakenInSeconds() != null) {
            feedback.append("\nTime Taken: ").append(submissionDTO.getTimeTakenInSeconds()).append("s");
        }

        double percentage = maxScore > 0 ? (score / maxScore) * 100.0 : 0;

        RoundAttempt roundAttempt = RoundAttempt.builder()
                .userAttempt(attempt)
                .simulationRound(round)
                .score(percentage)
                .timeTakenInSeconds(submissionDTO.getTimeTakenInSeconds())
                .feedback(feedback.toString())
                .userAnswers(objectMapper.writeValueAsString(submissionDTO.getAnswers()))
                .submittedAt(LocalDateTime.now())
                .build();

        roundAttemptRepository.save(roundAttempt);

        // Update total score in UserAttempt roughly
        List<RoundAttempt> allRounds = roundAttemptRepository.findByUserAttemptId(userAttemptId);
        double totalAvg = allRounds.stream().mapToDouble(RoundAttempt::getScore).average().orElse(0.0);
        attempt.setTotalScore(totalAvg);
        userAttemptRepository.save(attempt);
    }

    public AttemptReportDTO getAttemptReport(Long attemptId) {
        UserAttempt attempt = userAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        List<RoundAttempt> rounds = roundAttemptRepository.findByUserAttemptId(attemptId);
        
        Map<String, Double> roundScores = new HashMap<>();
        for (RoundAttempt ra : rounds) {
            roundScores.put(ra.getSimulationRound().getRoundType().name(), ra.getScore());
        }

        String readinessDesc = "NOT READY";
        if (attempt.getTotalScore() >= 80) readinessDesc = "READY";
        else if (attempt.getTotalScore() >= 50) readinessDesc = "ALMOST READY";

        String finalFeedback = attempt.getTotalScore() >= 80 ? 
            "Excellent performance! You demonstrate strong competency. Focus on mock interviews next." : 
            "Needs improvement. We recommend revising weak concepts and practicing more problems before the actual test.";

        return AttemptReportDTO.builder()
                .attemptId(attemptId)
                .totalScore(attempt.getTotalScore())
                .readinessLevel(readinessDesc)
                .roundScores(roundScores)
                .overallFeedback(finalFeedback)
                .build();
    }
}
