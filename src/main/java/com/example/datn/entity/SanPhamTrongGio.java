package com.example.datn.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SanPhamTrongGio {
    @JsonProperty("sanPhamId")
    private Integer sanPhamId; // ID sản phẩm cha để lấy tên, ảnh

    @JsonProperty("chiTietSanPhamId")
    private Integer chiTietSanPhamId;

    @JsonProperty("soLuong")
    private int soLuong;

    @JsonProperty("donGia")
    private BigDecimal donGia;
}
