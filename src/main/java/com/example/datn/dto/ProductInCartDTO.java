package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductInCartDTO {
    private String uniqueId;
    private Integer idChiTietSanPham;
    private String tenSanPham;
    private int quantity;
    private double gia;
    private Double giaTienSauKhiGiam;
    private String hinhAnh; // URL ảnh
    private String mauSac;
    private String kichThuoc;
    private Boolean isSelected;
    private Integer phanTramGiam;     // Để hiển thị nhãn % OFF
                  // Để hiển thị giá gốc bị gạch đi
     // Để hiển thị giá mới
}
