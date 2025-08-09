package com.example.datn.dto;

import com.example.datn.entity.ChiTietSanPham;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonChiTietSanPhamDTO {
    Integer id; // ID của bản ghi HoaDonChiTiet
    String maSanPhamChiTiet;
    Integer soLuong;
    Integer gia;
    Integer thanhTien;
    @JsonIgnore
    String ghiChu;
    @JsonIgnore
    Boolean trangThai;
    String tenSanPham;
    String tenMauSac;
    String tenKichThuoc;
    List<String> hinhAnhctsp;
}
