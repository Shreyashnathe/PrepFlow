package com.placement.prepflow.repository;

import com.placement.prepflow.entity.RoundAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoundAttemptRepository extends JpaRepository<RoundAttempt, Long> {
    List<RoundAttempt> findByUserAttemptId(Long userAttemptId);
}
