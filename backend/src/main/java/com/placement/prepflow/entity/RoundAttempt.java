package com.placement.prepflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "round_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoundAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_attempt_id", nullable = false)
    @JsonIgnore
    private UserAttempt userAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_round_id", nullable = false)
    private SimulationRound simulationRound;

    private Double score;
    
    @Column(columnDefinition = "JSON")
    private String userAnswers; // Store JSON object of questionId -> given_answer

    @Column(columnDefinition = "TEXT")
    private String feedback; // Evaluation feedback

    private LocalDateTime submittedAt;
}
