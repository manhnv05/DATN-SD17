package com.example.datn.dto;

import lombok.Data;
import java.util.List;

@Data
public class VariantDTO {
    private Integer id;
    private String mauSac;
    private String maMau;
    private String kichThuoc;
    private Integer gia;
    private Integer giaTruocKhiGiam;    // Giá trước giảm (nếu có khuyến mãi)
    private Integer giaSauKhiGiam;       // Giá sau khi giảm (nếu có khuyến mãi)
    private Integer phanTramGiamGia;     // Phần trăm giảm giá (nếu có khuyến mãi)
    private List<String> images;
}