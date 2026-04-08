package com.placement.prepflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private Double totalScore;
    
    private String status; // IN_PROGRESS, COMPLETED

    private LocalDateTime startedAt;
    
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "userAttempt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoundAttempt> roundAttempts;
}
