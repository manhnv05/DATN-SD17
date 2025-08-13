package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.*;
import com.example.datn.service.ThongKeService;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/thong_ke")
public class ThongKeController {
    @Autowired
    private ThongKeService thongKeService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<Map<String, ThongKeDTO>>> getThongKe(
            @RequestParam(required = false, defaultValue = "2025-01-01T00:00:00")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime ngayBD,

            @RequestParam(required = false, defaultValue = "2025-12-31T23:59:59")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime ngayKt
    ) {
       return ResponseHelper.success("", thongKeService.getThongKe(ngayBD, ngayKt));
    }

    @GetMapping("/sanPhamSapHet")
    public ResponseEntity<ApiResponse<Page<ChiTietSanPhamSapHetDTO>>> getSanPhamSapHet(
            @RequestParam Integer slQuery,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseHelper.success("", thongKeService.getAllChiTietSanPhamSapHetHan(page, size, slQuery));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<Page<ThongKeSPBanChayDTO>>> getThongKespBanChay(
            @RequestBody ThongKeVoSearch thongKeVoSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseHelper.success("", thongKeService.getThongKeSpBanChayByQuery(thongKeVoSearch, page, size));
    }

    @GetMapping("/bieudo/{id}")
    public ResponseEntity<ApiResponse<ThongKeBieuDoDTO>> getBieudo(
            @PathVariable int id,
            @RequestParam(required = false, defaultValue = "2025-01-01T00:00:00")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime ngayBD,

            @RequestParam(required = false, defaultValue = "2025-12-31T23:59:59")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime ngayKt
            ) {

        return ResponseHelper.success("", thongKeService.getBieuDo(id, ngayBD, ngayKt));
    }
    @PostMapping("/bieudo")
    public ResponseEntity<ApiResponse<ThongKeBieuDoDTO>> getBieuDoQuery(@RequestBody ThongKeVoSearch thongKeVoSearch) {
        return ResponseHelper.success("", thongKeService.getBieuDoByQuery(thongKeVoSearch));
    }
}
