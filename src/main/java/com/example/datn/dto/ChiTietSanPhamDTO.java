package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
public class ChiTietSanPhamDTO implements Serializable {
    private Integer id;

    private Integer idSanPham;
    private String tenSanPham;

    private Integer idChatLieu;
    private String tenChatLieu;

    private Integer idThuongHieu;
    private String tenThuongHieu;

    private Integer idMauSac;
    private String tenMauSac;

    private Integer idKichThuoc;
    private String tenKichThuoc;

    private Integer idCoAo;
    private String tenCoAo;

    private Integer idTayAo;
    private String tenTayAo;

    private String maSanPhamChiTiet;
    private Integer gia;
    private Integer soLuong;
    private Integer trongLuong;
    private String moTa;
    private Integer trangThai;

    // Danh sách hình ảnh (có thể trả về chi tiết hoặc chỉ id)
    private List<HinhAnhDTO> hinhAnhs;
    // Nếu chỉ cần id hình ảnh thì dùng dòng dưới và bỏ dòng trên:
    // private List<Integer> idHinhAnhList;
}