package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public  class TraCuuHoaDonDTO {
    private Integer id;
    private String maHoaDon;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayGiaoDuKien;
    private String tenKhachHang; // Tên người nhận
    private String sdt;          // SĐT người nhận
    private String diaChi;
    private String loaiHoaDon;
    private String trangThai;    // VD: DANG_VAN_CHUYEN
    private String ghiChu;
    private Double phiVanChuyen;
    private Double tongTienBanDau;
    private Double tongTien;
    private Double tongHoaDon;
    private NhanVienTraCuuDTO nhanVien;
    private PhieuGiamGiaTraCuuDTO phieuGiamGia;
    private List<ChiTietSanPhamTraCuuDTO> danhSachChiTiet;
    private List<LichSuHoaDonTraCuuDTO> lichSuHoaDon;




    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class PhieuGiamGiaTraCuuDTO {
        private String maPhieu;
        private Double soTienGiam;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NhanVienTraCuuDTO {
        private String maNhanVien;
        private String tenNhanVien;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class LichSuHoaDonTraCuuDTO {
        private String trangThaiHoaDon;
        private LocalDateTime thoiGian;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static   class ChiTietSanPhamTraCuuDTO {
        private Integer idSanPhamChiTiet;
        private String maSanPhamChiTiet;
        private String tenSanPham;
        private String duongDanAnh;
        private String tenMauSac;
        private String tenKichThuoc;
        private Integer soLuong;
        private Double gia;
        private Double thanhTien;

        public ChiTietSanPhamTraCuuDTO(Integer idSanPhamChiTiet, String maSanPhamChiTiet, String tenSanPham, String duongDanAnh, String tenMauSac, String tenKichThuoc, Integer soLuong, Integer gia, Integer thanhTien) {
        }
    }




}

