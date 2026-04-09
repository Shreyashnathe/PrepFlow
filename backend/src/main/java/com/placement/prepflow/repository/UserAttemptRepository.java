package com.placement.prepflow.repository;

import com.placement.prepflow.entity.UserAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAttemptRepository extends JpaRepository<UserAttempt, Long> {
    List<UserAttempt> findByUserId(Long userId);
    
    java.util.Optional<UserAttempt> findFirstByUserIdAndRoleIdAndStatus(Long userId, Long roleId, String status);
}
