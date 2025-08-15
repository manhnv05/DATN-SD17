package com.example.datn.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDTO {
    private String code;
    private Integer percent;
    private String min;
    private String expire;
}
