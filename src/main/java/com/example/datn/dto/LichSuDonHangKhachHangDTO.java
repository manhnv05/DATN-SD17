package com.example.datn.dto;

import com.example.datn.enums.TrangThai;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
 @NoArgsConstructor
 @AllArgsConstructor
public class LichSuDonHangKhachHangDTO {
    private Integer idHoaDon;
    private String maHoaDon;
    private TrangThai trangThai;
    private LocalDateTime ngayTao; // Hoặc dùng LocalDate nếu bạn muốn xử lý kiểu ngày tháng
    private BigDecimal tongTien; // Dùng BigDecimal cho tiền tệ để đảm bảo độ chính xác
    private Integer soLuongSanPham;
    private String diaChi;

}
