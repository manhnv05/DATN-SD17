package com.example.datn.vo.hoaDonVO;

import lombok.*;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HoaDonOnlineRequest {
    private Integer idKhachHang;
    private String tenKhachHang;
    private Integer idNhanVien;
    private String sdt;
    private String diaChi;
    private String ghiChu;
    private Integer phiVanChuyen;
    private Integer phieuGiamGia;
    private List<SanPhamCapNhatVO> danhSachSanPham;
    private String loaiHoaDon;
    private String email;

    @Data
    public static class SanPhamCapNhatVO {
        private Integer id;             // id sản phẩm chi tiết
        private Integer soLuong;
        private Integer donGia;
        private Integer idDotGiamGia;
    }

}
