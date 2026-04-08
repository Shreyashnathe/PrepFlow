package com.placement.prepflow.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyDTO {
    private Long id;
    private String name;
    private String logoUrl;
}
