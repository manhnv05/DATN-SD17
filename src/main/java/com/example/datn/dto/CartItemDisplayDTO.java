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
    private String tenKichCo;
    private String tenChatLieu;
    private String tenCoAo;
    private String tenTayAo;
    private Integer soLuong;
    private BigDecimal donGia;
    private List<String> hinhAnh;


}
