package com.example.datn.dto;

import lombok.Data;

@Data
public class SanPhamOutletDTO {
    private Integer id; // id của ChiTietSanPham
    private String tenSanPham;
    private String maSanPham;
    private String tenThuongHieu;
    private String tenDanhMuc;
    private String tenMauSac;
    private String maMau;
    private String tenKichThuoc;
    private String tenChatLieu;
    private String imageUrl;
    private Integer giaTruocKhiGiam;
    private Integer giaSauKhiGiam;
    private Integer phanTramGiamGia;
    private String moTa;
}