package com.placement.prepflow.repository;

import com.placement.prepflow.entity.SimulationRound;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationRoundRepository extends JpaRepository<SimulationRound, Long> {
    List<SimulationRound> findByRoleIdOrderBySequenceOrderAsc(Long roleId);
}
