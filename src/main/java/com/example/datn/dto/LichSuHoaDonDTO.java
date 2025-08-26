package com.example.datn.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LichSuHoaDonDTO{
    private Integer id;

    private Integer idHoaDon;

    private String maLichSu;

    private String noiDungThayDoi;

    private String nguoiThucHien;

    private String ghiChu;

    private Integer trangThai;
    private LocalDateTime thoiGianThayDoi;

}
