package com.example.datn.dto;

import lombok.Data;

@Data
public class ResetMatKhauDTO {
    private String email;
    private String code;
    private String matKhauMoi;
    private String xacNhanMatKhauMoi;
}
