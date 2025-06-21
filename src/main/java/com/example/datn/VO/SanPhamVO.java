package com.example.datn.VO;

import lombok.Data;
import java.io.Serializable;

@Data
public class SanPhamVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer idChatLieu;
    private Integer idThuongHieu;
    private String xuatXu;
    private Integer idDanhMuc;
    private String maSanPham;
    private String tenSanPham;
    private Integer trangThai;
}