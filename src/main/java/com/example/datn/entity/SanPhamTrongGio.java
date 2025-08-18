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
    @JsonProperty("id")
    private Integer id; // unique id cho item trong giỏ (có thể là UUID.randomUUID().getMostSignificantBits() hoặc tự tăng)

    @JsonProperty("idNguoiDung")
    private Long idNguoiDung;

    @JsonProperty("loaiNguoiDung")
    private String loaiNguoiDung;

    @JsonProperty("sanPhamId")
    private Integer sanPhamId; // ID sản phẩm cha để lấy tên, ảnh

    @JsonProperty("chiTietSanPhamId")
    private Integer chiTietSanPhamId;

    @JsonProperty("soLuong")
    private int soLuong;

    @JsonProperty("donGia")
    private BigDecimal donGia;
}