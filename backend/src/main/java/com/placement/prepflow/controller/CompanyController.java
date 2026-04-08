package com.placement.prepflow.controller;

import com.placement.prepflow.dto.CompanyDTO;
import com.placement.prepflow.dto.RoleDTO;
import com.placement.prepflow.service.CompanyFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@CrossOrigin(origins = "*") // Setup for React UI
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyFlowService companyFlowService;

    @GetMapping
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        return ResponseEntity.ok(companyFlowService.getAllCompanies());
    }

    @GetMapping("/{companyId}/roles")
    public ResponseEntity<List<RoleDTO>> getRolesByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyFlowService.getRolesByCompany(companyId));
    }
}
