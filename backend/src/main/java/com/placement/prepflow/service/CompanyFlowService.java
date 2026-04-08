package com.placement.prepflow.service;

import com.placement.prepflow.dto.CompanyDTO;
import com.placement.prepflow.dto.RoleDTO;
import com.placement.prepflow.dto.SimulationRoundDTO;
import com.placement.prepflow.dto.QuestionDTO;
import com.placement.prepflow.entity.Company;
import com.placement.prepflow.entity.Role;
import com.placement.prepflow.entity.SimulationRound;
import com.placement.prepflow.entity.Question;
import com.placement.prepflow.exception.ResourceNotFoundException;
import com.placement.prepflow.repository.CompanyRepository;
import com.placement.prepflow.repository.QuestionRepository;
import com.placement.prepflow.repository.RoleRepository;
import com.placement.prepflow.repository.SimulationRoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyFlowService {

    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final SimulationRoundRepository simulationRoundRepository;
    private final QuestionRepository questionRepository;

    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(c -> CompanyDTO.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .logoUrl(c.getLogoUrl())
                        .build())
                .collect(Collectors.toList());
    }

    public List<RoleDTO> getRolesByCompany(Long companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found");
        }
        return roleRepository.findByCompanyId(companyId).stream()
                .map(r -> RoleDTO.builder()
                        .id(r.getId())
                        .name(r.getName())
                        .companyId(companyId)
                        .build())
                .collect(Collectors.toList());
    }

    public List<SimulationRoundDTO> getSimulationFlow(Long roleId) {
        if (!roleRepository.existsById(roleId)) {
            throw new ResourceNotFoundException("Role not found");
        }
        return simulationRoundRepository.findByRoleIdOrderBySequenceOrderAsc(roleId).stream()
                .map(r -> SimulationRoundDTO.builder()
                        .id(r.getId())
                        .roundType(r.getRoundType())
                        .sequenceOrder(r.getSequenceOrder())
                        .description(r.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    public List<QuestionDTO> getQuestionsForRound(Long roundId) {
        if (!simulationRoundRepository.existsById(roundId)) {
            throw new ResourceNotFoundException("Round not found");
        }
        return questionRepository.findBySimulationRoundId(roundId).stream()
                .map(q -> QuestionDTO.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .options(q.getOptions())
                        .difficulty(q.getDifficulty())
                        .build())
                .collect(Collectors.toList());
    }
}
