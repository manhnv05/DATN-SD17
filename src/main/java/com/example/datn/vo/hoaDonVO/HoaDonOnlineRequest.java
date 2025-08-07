package com.example.datn.vo.hoaDonVO;

import lombok.*;

import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HoaDonOnlineRequest {
    private String tenKhachHang;
    private String sdt;
    private String diaChi;
    private String ghiChu;
    private Integer phiVanChuyen;
    private String phieuGiamGia;
    private List<SanPhamCapNhatVO> danhSachSanPham;
    private String loaiHoaDon;

    @Data
    public static class SanPhamCapNhatVO {
        private Integer id;             // id sản phẩm chi tiết
        private Integer soLuong;
        private Integer donGia;
        private Integer idDotGiamGia;
    }

}
