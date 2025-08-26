package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.ApiResponse;
import com.example.datn.dto.HoaDonDTO;
import com.example.datn.dto.LichSuDonHangKhachHangDTO;
import com.example.datn.dto.LichSuHoaDonDTO;
import com.example.datn.service.LichSuHoaDonService;
import com.example.datn.vo.lichSuHoaDonVO.LichSuLogVO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lich-su-hoa-don")
@RequiredArgsConstructor
public class LichSuHoaDonController {
    private final LichSuHoaDonService lichSuHoaDonService;
    @GetMapping("/lay-lich-su/khach-hang/{idKhachHang}")
    public ResponseEntity<ApiResponse<List<LichSuDonHangKhachHangDTO>>>  layLichSuHoaDon(@PathVariable Integer idKhachHang) {

        List<LichSuDonHangKhachHangDTO> lichSuDonHang = lichSuHoaDonService.getLichSuDonHangCuaKhachHang(idKhachHang);
        return ResponseHelper.success("", lichSuDonHang);
    }
    @GetMapping ("/lay-chi-tiet-hoa-don-thong-tin/{maHoaDon}")
    public ResponseEntity<ApiResponse<List<LichSuHoaDonDTO>>>  layLichSuHoaDonByMaHoaDon(@PathVariable String maHoaDon) {

        List<LichSuHoaDonDTO> lichSuDonHang = lichSuHoaDonService.getAllLichSuHoaDon(maHoaDon);
        return ResponseHelper.success("", lichSuDonHang);
    }
    @PostMapping("/log")
    public ResponseEntity<?> createLogEntry(@RequestBody LichSuLogVO logRequest) {
        // Gọi hàm dịch vụ mới đã tạo ở Bước 1
        lichSuHoaDonService.luuLichSuTuApi(logRequest);
        return ResponseEntity.ok("Ghi log thành công");
    }
}
