package com.example.datn.DTO;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class HoaDonHistoryDTO {
    private LocalDateTime thoiGian; // Thời gian thay đổi
    private String nguoiChinhSua;  // Người thực hiện thay đổi
    private String trangThaiHoaDon; // Trạng thái mới của hóa đơn (tên hiển thị từ Enum)
    private String ghiChu;         // Ghi chú liên quan
}
