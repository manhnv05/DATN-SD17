package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CapNhatTrangThaiDTO {
    private Integer idHoaDon;
    private String trangThaiMoi;
    private String tenTrangThaiMoi;
    private String message;
    private String maHoaDon;
    private String ngayTao;
    private Integer idKhachHang;
    private BigDecimal tongTien;
    private Integer soLuongSanPham;
    private String diaChi;
    public CapNhatTrangThaiDTO(Integer idHoaDon, String trangThaiMoi, String tenTrangThaiMoi, String message) {
        this.idHoaDon = idHoaDon;
        this.trangThaiMoi = trangThaiMoi;
        this.tenTrangThaiMoi = tenTrangThaiMoi;
        this.message = message;
    }
}
