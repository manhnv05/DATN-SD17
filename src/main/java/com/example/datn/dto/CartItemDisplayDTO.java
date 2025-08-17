package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDisplayDTO {
    private Integer idChiTietSanPham;
    private String tenSanPham;
    private String tenMauSac;
    private String maMau;         // Bổ sung: mã màu HEX để FE hiển thị đúng màu sắc
    private String tenKichCo;
    private String tenChatLieu;
    private String tenCoAo;
    private String tenTayAo;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal giaGoc;    // Bổ sung: giá gốc để FE có thể hiển thị giá gạch chân nếu có khuyến mãi
    private Integer phanTramGiamGia; // Bổ sung: phần trăm giảm giá nếu có
    private List<String> hinhAnh;
}