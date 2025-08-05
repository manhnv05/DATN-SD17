package com.example.datn.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonDTOMess {
    private PhieuGiamGiaDTO phieuGiamGiaDTO;
    private String mess;
}
