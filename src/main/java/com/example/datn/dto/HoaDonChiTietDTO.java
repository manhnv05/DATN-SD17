package com.example.datn.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonChiTietDTO {
      Integer id; // ID của bản ghi HoaDonChiTiet
      Integer idSanPhamChiTiet;
      String maSanPhamChiTiet;
      Integer soLuong;
      Integer gia;
      Integer thanhTien;
      Integer idKhachHang;
      @JsonIgnore
      String ghiChu;
      @JsonIgnore
      Boolean trangThai;
      String tenSanPham;
      String tenMauSac;
      String tenKichThuoc;
      String duongDanAnh;
      public HoaDonChiTietDTO(Integer id, Integer idSanPhamChiTiet, String maSanPhamChiTiet,
                              Integer soLuong, Integer gia, Integer thanhTien,
                              String tenSanPham, String tenMauSac, String tenKichThuoc, String duongDanAnh) {
            this.id = id;
            this.idSanPhamChiTiet = idSanPhamChiTiet;
            this.maSanPhamChiTiet = maSanPhamChiTiet;
            this.soLuong = soLuong;
            this.gia = gia;
            this.thanhTien = thanhTien;
            this.tenSanPham = tenSanPham;
            this.tenMauSac = tenMauSac;
            this.tenKichThuoc = tenKichThuoc;
            this.duongDanAnh = duongDanAnh;
      }

}
