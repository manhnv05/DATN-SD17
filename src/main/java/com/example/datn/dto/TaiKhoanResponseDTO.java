package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaiKhoanResponseDTO {
    private Integer id; // ID của nhân viên hoặc khách hàng
    private String maDinhDanh; // Sẽ là mã nhân viên hoặc mã khách hàng
    private String hoVaTen;
    private String email;
    private String hinhAnh;
    private String loaiTaiKhoan; // "ADMIN", "NHANVIEN", hoặc "KHACHHANG"
}
