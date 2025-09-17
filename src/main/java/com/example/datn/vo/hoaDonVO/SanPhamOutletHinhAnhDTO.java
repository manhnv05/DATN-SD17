package com.example.datn.vo.hoaDonVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SanPhamOutletHinhAnhDTO {
    private Integer id;
    private Integer idChiTietSanPham;
    private String tenSanPham;
    private String maSanPham;
    private String tenThuongHieu;
    private String tenDanhMuc;
    private String tenMauSac;
    private String maMau;
    private String tenKichThuoc;
    private String tenChatLieu;
    private List<String> imageUrl;
    private Integer giaTruocKhiGiam;
    private Integer giaSauKhiGiam;
    private Integer phanTramGiamGia;
    private String moTa;
}
