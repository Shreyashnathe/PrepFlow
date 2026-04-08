package com.placement.prepflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(columnDefinition = "JSON")
    private String options; // Storing as JSON string for simplicity [ "A", "B", "C", "D" ]

    @Column(columnDefinition = "TEXT", nullable = false)
    private String expectedAnswer; // Correct option for Aptitude, output or key terms for Coding/HR

    private String difficulty; // Easy, Medium, Hard

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_round_id", nullable = false)
    @JsonIgnore
    private SimulationRound simulationRound;
}
