package com.example.datn.mapper;

import com.example.datn.DTO.HoaDonHistoryDTO;
import com.example.datn.Entity.LichSuHoaDon;
import com.example.datn.enums.TrangThai;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LichSuHoaDonMapper {
    @Mapping(target = "thoiGian", source = "thoiGianThayDoi") // Ánh xạ trường thời gian
    @Mapping(target = "nguoiChinhSua", source = "nguoiThucHien") // Ánh xạ người thực hiện
    @Mapping(target = "trangThaiHoaDon", source = "trangThaiMoiHoaDon", qualifiedByName = "mapTrangThaiDisplayName") // Ánh xạ trạng thái mới với tên hiển thị
    @Mapping(target = "ghiChu", source = "ghiChu") // Ánh xạ ghi chú
    HoaDonHistoryDTO toHoaDonHistoryResponse(LichSuHoaDon entity);

    @Named("mapTrangThaiDisplayName") // Đánh dấu phương thức này có thể được gọi bằng qualifiedByName
    default String mapTrangThaiDisplayName(String trangThaiName) {
        if (trangThaiName == null) {
            return null;
        }
        try {
            // Chuyển đổi tên Enum (String) thành đối tượng Enum, sau đó lấy tên hiển thị
            return TrangThai.valueOf(trangThaiName).getDisplayName();
        } catch (IllegalArgumentException e) {
            // Xử lý trường hợp tên trạng thái không hợp lệ (ví dụ: lỗi dữ liệu trong DB)
            System.err.println("Invalid TrangThai name found in DB for history: " + trangThaiName);
            return trangThaiName; // Trả về tên gốc nếu không tìm thấy Enum
        }
    }
}
