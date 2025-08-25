package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.*;
import com.example.datn.entity.HoaDon;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.service.TraCuuHoaDonService;
import com.example.datn.vo.hoaDonVO.*;
import com.example.datn.vo.khachHangVO.CapNhatKhachRequestVO;
import com.example.datn.vo.lichSuHoaDonVO.LichSuVO;
import com.example.datn.vo.phieuGiamGiaVO.CapNhatPGG;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.example.datn.enums.TrangThai;
import com.example.datn.service.HoaDonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import com.example.datn.dto.HoaDonPdfResult;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/hoa-don")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HoaDonController {
    HoaDonService hoaDonService;
    TraCuuHoaDonService traCuuHoaDonService;
    private SimpMessagingTemplate messagingTemplate;
    private HoaDonRepository hoaDonRepository;
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable String id) {

        HoaDonPdfResult hoaDonPdfResult = hoaDonService.hoadonToPDF(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=hoa_don_" + hoaDonPdfResult.getMaHoaDon() + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(hoaDonPdfResult.getPdfStream().readAllBytes());
    }
    @PostMapping("/tao-hoa-don-cho")
    public ResponseEntity<ApiResponse<HoaDonChoDTO>> taoHoaDonCho(@RequestBody HoaDonChoRequestVO request) {
        HoaDonChoDTO hoaDonChoResponse = hoaDonService.taoHoaDonCho(request);

        ApiResponse<HoaDonChoDTO> response = ApiResponse.<HoaDonChoDTO>builder()
                .code(1000)
                .message("Hóa đơn chờ đã được tạo thành công")
                .data(hoaDonChoResponse)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/cap-nhat-danh-sach-san-pham/{idHoaDon}")
    public ResponseEntity<List<HoaDonChiTietDTO>> updateDanhSachSanPhamChiTiet(
            @PathVariable Integer idHoaDon,
            @RequestBody List<CapNhatSanPhamChiTietDonHangVO> danhSachCapNhatSanPham) {

        List<HoaDonChiTietDTO> updatedList = hoaDonService.updateDanhSachSanPhamChiTiet(idHoaDon, danhSachCapNhatSanPham);
        return ResponseEntity.ok(updatedList);
    }
    @GetMapping("/{id}")
    public HoaDonDTO getHoaDonDetails(@PathVariable Integer id) {
        return hoaDonService.getHoaDonById(id);
    }

    @GetMapping("/lich-su/{maHoaDon}")
    public List<HoaDonHistoryDTO> getHoaDonHistory(@PathVariable("maHoaDon") String maHoaDon) {
        return hoaDonService.layLichSuThayDoiTrangThai(maHoaDon);
    }

    @PutMapping("/trang-thai/{id}")
    public CapNhatTrangThaiDTO updateHoaDonStatus(@PathVariable Integer id, @RequestBody @Validated HoaDonUpdateStatusVO request) {

        String nguoiThucHienPlaceholder = "Nhân viên A";
        return hoaDonService.capNhatTrangThaiHoaDon(id, request.getTrangThaiMoi(), request.getGhiChu(), nguoiThucHienPlaceholder);
    }

    @GetMapping
    public ApiResponse<Page<HoaDonDTO>> getAllHoaDon(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) TrangThai trangThai,
            @RequestParam(required = false) String loaiHoaDon,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTaoStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayTaoEnd,
            @RequestParam(required = false) String searchTerm) {

        Pageable pageable = PageRequest.of(page, size);
        Page<HoaDonDTO> hoaDonPage = hoaDonService.getFilteredHoaDon(
                trangThai, loaiHoaDon, ngayTaoStart, ngayTaoEnd,
                searchTerm,
                pageable
        );

        return ApiResponse.<Page<HoaDonDTO>>builder()
                .code(HttpStatus.OK.value())
                .message("Lấy danh sách hóa đơn thành công")
                .data(hoaDonPage)
                .build();
    }

    @GetMapping("/status-counts")
    public ResponseEntity<ApiResponse<Map<TrangThai, Long>>> getStatusCounts() {
        Map<TrangThai, Long> counts = hoaDonService.getStatusCounts();
        ApiResponse<Map<TrangThai, Long>> response = ApiResponse.<Map<TrangThai, Long>>builder()
                .code(1000)
                .message("Hóa đơn đã được tạo thành công")
                .data(counts)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/chuyen-trang-thai-tiep-theo/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiDTO> chuyenTrangThaiTiepTheo(
            @PathVariable("id") Integer idHoaDon,
            @RequestBody LichSuVO request) {

        CapNhatTrangThaiDTO response = hoaDonService.chuyenTrangThaiTiepTheo(
                idHoaDon,
                request.getGhiChu(),
                request.getNguoiThucHien()
        );
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (hoaDon != null && hoaDon.getKhachHang() != null) {
            // 3. Bổ sung các trường còn thiếu vào DTO
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String ngayTaoFormatted = hoaDon.getNgayTao() != null ? hoaDon.getNgayTao().format(formatter) : "N/A";

            response.setIdKhachHang(hoaDon.getKhachHang().getId());
            response.setMaHoaDon(hoaDon.getMaHoaDon());
            response.setNgayTao(ngayTaoFormatted);
            response.setTongTien(BigDecimal.valueOf(hoaDon.getTongTien()));
            response.setSoLuongSanPham(hoaDon.getHoaDonChiTietList().size());
            response.setDiaChi(hoaDon.getDiaChi());

            // 4. Gửi DTO đã được làm giàu qua WebSocket
            System.out.println("[Backend] Đang gửi tin nhắn đến kênh: /topic/orders/" + response.getIdKhachHang());
            messagingTemplate.convertAndSend("/topic/orders/" + response.getIdKhachHang(), response);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/chuyen-trang-thai-quay-lai/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiDTO> chuyenTrangThaiQuayLai(
            @RequestBody LichSuVO request,
            @PathVariable ("id") Integer id) {
        CapNhatTrangThaiDTO response = hoaDonService.quayLaiTrangThaiTruoc(
                id,
                request.getGhiChu(),
                request.getNguoiThucHien());
        return ResponseEntity.ok(response);
    };

    @GetMapping("/get-thong-tin-hoa-don/{id}")
    public ResponseEntity<ApiResponse<TongTienHoaDonDto>> getThongTinGiamGiaByHoaDonId(@PathVariable("id") Integer id) {
        TongTienHoaDonDto tongTienHoaDonDto = hoaDonService.getThongTinGiamGiaByHoaDonId(id);
        ApiResponse<TongTienHoaDonDto> apiResponse = ApiResponse.<TongTienHoaDonDto>builder()
                .code(1000)
                .message("Lấy thông tin hóa đơn thành công")
                .data(tongTienHoaDonDto)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
    @PutMapping("/chuyen-trang-thai-huy/{id}") // Changed to PUT mapping
    public ResponseEntity<CapNhatTrangThaiDTO> chuyenTrangThaiHuy(
            @PathVariable("id") Integer idHoaDon,
            @RequestBody LichSuVO request) {

        CapNhatTrangThaiDTO response = hoaDonService.huyHoaDon(
                idHoaDon,
                request.getGhiChu(),
                request.getNguoiThucHien()
        );
        return ResponseEntity.ok(response);
    }

    @PutMapping("/cap-nhat-thong-tin/{id}")
    public ResponseEntity<ApiResponse<Void>> updateHoaDonInfo(
            @PathVariable Integer id,
            @RequestBody @Valid HoaDonUpdateVO request) {
        String successMessage = hoaDonService.capNhatThongTinHoaDon(id, request);


        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .code(1000)
                .message(successMessage)
                .build();
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
    @GetMapping("/{idHoaDon}/san-pham")
    public ResponseEntity<ApiResponse<List<HoaDonChiTietSanPhamDTO>>> getHoaDonChiTietResponse(@PathVariable Integer idHoaDon) {
        List<HoaDonChiTietSanPhamDTO> hoaDonChiTietResponseList = hoaDonService.findChiTietHoaDon(idHoaDon);
        return ResponseHelper.success("", hoaDonChiTietResponseList);
    }
    @PutMapping("/update_hoadon")
    public ResponseEntity<ApiResponse<HoaDonDTO>> updateHoadon(@RequestBody HoaDonRequestUpdateVO hoaDonRequestUpdateVO) {
        return ResponseHelper.success("", hoaDonService.updateHoaDon(hoaDonRequestUpdateVO));
    }
    @PutMapping("/update-hoa-don-da-luu")
    public ResponseEntity<ApiResponse<HoaDonDTO>> updateHoadonDetail(@RequestBody HoaDonRequestUpdateVO hoaDonRequestUpdateVO) {
        return ResponseHelper.success("", hoaDonService.updateHoaDonDetail(hoaDonRequestUpdateVO));
    }

    @PostMapping("/luu-hoa-don-online-chua-dang-nhap")
    public ResponseEntity<ApiResponse<HoaDonDTO>> saveHoaDonOnlineChuaDangNhap(@RequestBody HoaDonOnlineRequest hoaDonOnlineRequest) {
        HoaDonDTO hoaDonDTO = hoaDonService.saveHoaDonOnlineChuaDangNhap(hoaDonOnlineRequest);
        ApiResponse<HoaDonDTO> apiResponse = ApiResponse.<HoaDonDTO>builder()
                .code(1000)
                .message("Lưu hóa đơn thành công")
                .data(hoaDonDTO)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/luu-hoa-don-online")
    public ResponseEntity<ApiResponse<HoaDonDTO>> saveHoaDonOnline(@RequestBody HoaDonOnlineRequest hoaDonOnlineRequest) {
        HoaDonDTO hoaDonDTO = hoaDonService.saveHoaDonOnline(hoaDonOnlineRequest);
        ApiResponse<HoaDonDTO> apiResponse = ApiResponse.<HoaDonDTO>builder()
                .code(1000)
                .message("Lưu hóa đơn thành công")
                .data(hoaDonDTO)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/tang-so-luong-san-pham/{idSanPhamChiTiet}")
    public ResponseEntity<ApiResponse<String>> tangSoLuongSanPhamChiTiet(
            @PathVariable Integer idSanPhamChiTiet,
            @RequestParam Integer soLuong) {
        String result = hoaDonService.tangSoLuongSanPhamChiTiet(idSanPhamChiTiet, soLuong);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .code(1000)
                .message("Tăng số lượng sản phẩm chi tiết thành công")
                .data(result)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
    @PutMapping("/giam-so-luong-san-pham/{idSanPhamChiTiet}")
    public ResponseEntity<ApiResponse<String>> giamSoLuongSanPhamChiTiet(
            @PathVariable Integer idSanPhamChiTiet,
            @RequestParam Integer soLuong) {
        String result = hoaDonService.giamSoLuongSanPhamChiTiet(idSanPhamChiTiet, soLuong);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .code(1000)
                .message("Giam số lượng sản phẩm chi tiết thành công")
                .data(result)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/cap-nhat-khach-hang")
    public ResponseEntity<ApiResponse<String>> capNhatKhachHangVaoHoaDon(@RequestBody CapNhatKhachRequestVO capNhatKhachRequest) {
        String result = hoaDonService.capNhatKhachHangVaoHoaDon(capNhatKhachRequest);
        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .code(1000)
                .message("Cập nhật khách hàng vào hóa đơn thành công")
                .data(result)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
    @PutMapping("/cap-nhat-phieu-giam")
    public ResponseEntity<ApiResponse<PhieuGiamGiaDTO>> capNhatPhieuGiamGia(@RequestBody CapNhatPGG capNhatPGG){
        HoaDonDTOMess result = hoaDonService.capnhatPGGVaoHoaDon(capNhatPGG);
        return ResponseHelper.success(result.getMess(), result.getPhieuGiamGiaDTO());
    }

    @GetMapping("/luu-hoa-don-online-chua-dang-nhap")
    public void guimail(@RequestParam Integer idHoaDon, @RequestParam String email){
        hoaDonService.sendMailHoaDonToKhachHang(idHoaDon, email);
    }
    @GetMapping("/get-all-so-luong-ton-kho")
    public ResponseEntity<ApiResponse<List<SanPhamTonKhoDTO>>> getAllSoLuongTonKho() {
        List<SanPhamTonKhoDTO> soLuongTonKhoList = hoaDonService.GetAllSanPhamTonKho();
        ApiResponse<List<SanPhamTonKhoDTO>> response = ApiResponse.<List<SanPhamTonKhoDTO>>builder()
                .code(1000)
                .message("Lấy danh sách số lượng tồn kho thành công")
                .data(soLuongTonKhoList)
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/tra-cuu-hoa-don/{maHoaDon}")
    public TraCuuHoaDonDTO traCuuHoaDon(@PathVariable String maHoaDon) {
        return traCuuHoaDonService.traCuuHoaDon(maHoaDon);
    }
}
