package com.example.datn.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductDetailDTO {
    private Integer id;
    private String tenSanPham;
    private String maSanPham;
    private String moTa;
    private Integer gia;
    private Integer giaTruocKhiGiam; // Nếu có khuyến mãi
    private Integer giaSauKhiGiam; // Nếu có khuyến mãi
    private Integer phanTramGiamGia; // Nếu có khuyến mãi
    private String tenDanhMuc;
    private String tenThuongHieu;
    private List<String> images;
    private List<MauSacDTO> colors;
    private List<String> sizes;
    private List<VariantDTO> variants;
    private Double rating;
    private Integer sold;
    private String shipping;
    private VoucherDTO voucher;
}