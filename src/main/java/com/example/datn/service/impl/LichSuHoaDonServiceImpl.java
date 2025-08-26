package com.example.datn.service.impl;

import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.dto.LichSuDonHangKhachHangDTO;
import com.example.datn.dto.LichSuHoaDonDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.entity.LichSuHoaDon;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.LichSuHoaDonRepository;
import com.example.datn.service.LichSuHoaDonService;
import com.example.datn.mapper.LichSuHoaDonMapper;
import com.example.datn.vo.lichSuHoaDonVO.LichSuLogVO;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.example.datn.enums.TrangThai;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LichSuHoaDonServiceImpl implements LichSuHoaDonService {

    LichSuHoaDonRepository lichSuHoaDonRepository;
    LichSuHoaDonMapper lichSuHoaDonMapper;
    HoaDonRepository hoaDonRepository;

    @Override
    public void ghiNhanLichSuHoaDon(HoaDon hoaDon, String noiDungThayDoi, String nguoiThucHien, String ghiChu, TrangThai trangThaiMoi) {
        LichSuHoaDon lichSu = LichSuHoaDon.builder()
                .hoaDon(hoaDon)
                .maLichSu("LSHD-" + System.nanoTime())
                .noiDungThayDoi(noiDungThayDoi)
                .nguoiThucHien(nguoiThucHien)
                .ghiChu(ghiChu)
                .trangThai(hoaDon.getTrangThai().ordinal())
                .thoiGianThayDoi(LocalDateTime.now())
                .trangThaiMoiHoaDon(trangThaiMoi.name())
                .build();
        lichSuHoaDonRepository.save(lichSu);
    }

    @Override
    public List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String maHoaDon) {
        List<LichSuHoaDon> lichSuList = lichSuHoaDonRepository.findByHoaDon_MaHoaDonOrderByThoiGianThayDoiAsc(maHoaDon);
        return lichSuList.stream()
                .map(lichSuHoaDonMapper::toHoaDonHistoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LichSuDonHangKhachHangDTO> getLichSuDonHangCuaKhachHang(Integer idKhachHang) {
        List<HoaDon> hoaDonList = hoaDonRepository.findHoaDonByKhachHang_Id(idKhachHang);
        if (hoaDonList.isEmpty()) {
            throw new AppException(ErrorCode.THERE_ARE_NO_ORDERS_YET);
        }
        return hoaDonList.stream()
                .sorted(Comparator.comparing(HoaDon::getNgayTao)
                        .reversed())
                .filter(hd -> hd.getTongHoaDon() > 0)
                .map(hd -> {
                    LichSuDonHangKhachHangDTO dto = new LichSuDonHangKhachHangDTO();
                    dto.setIdHoaDon(hd.getId());
                    dto.setMaHoaDon(hd.getMaHoaDon());
                    dto.setDiaChi(hd.getDiaChi());
                    dto.setNgayTao(hd.getNgayTao());
                    dto.setTongTien(BigDecimal.valueOf(hd.getTongHoaDon()));
                    dto.setSoLuongSanPham(hd.getHoaDonChiTietList().size());
                    dto.setTrangThai(hd.getTrangThai());
                    return dto;

                }).collect(Collectors.toList());

    }

    @Override
    public HoaDonHistoryDTO layLichSuThayDoiTrangThaiGanNhat(Integer idHoaDon) {
        HoaDonHistoryDTO lichSuGanNhat = lichSuHoaDonRepository.findTrangThaiGanNhatCuaHoaDon(idHoaDon);
        return lichSuGanNhat;
    }

    @Override
    public List<LichSuHoaDonDTO> getAllLichSuHoaDon(String maHoaDon) {
        List<LichSuHoaDon> lichSuList = lichSuHoaDonRepository.findByHoaDon_MaHoaDonOrderByThoiGianThayDoiAsc(maHoaDon);
        if (!lichSuList.isEmpty()) {
            return lichSuList.stream()
                    .map(lichSu -> {
                        LichSuHoaDonDTO dto = new LichSuHoaDonDTO();
                        dto.setId(lichSu.getId());
                        dto.setMaLichSu(lichSu.getMaLichSu());
                        dto.setNoiDungThayDoi(lichSu.getNoiDungThayDoi());
                        dto.setNguoiThucHien(lichSu.getNguoiThucHien());
                        dto.setGhiChu(lichSu.getGhiChu());
                        dto.setTrangThai(lichSu.getTrangThai());
                        dto.setThoiGianThayDoi(lichSu.getThoiGianThayDoi());
                        if (lichSu.getHoaDon() != null) {
                            dto.setIdHoaDon(lichSu.getHoaDon().getId());
                        }

                        return dto;
                    })
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Transactional
    @Override
    public void luuLichSuTuApi(LichSuLogVO logRequest) {
        // 1. Tìm hóa đơn từ ID
        HoaDon hoaDon = hoaDonRepository.findById(logRequest.getIdHoaDon())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        ghiNhanLichSuHoaDon(
                hoaDon,
                logRequest.getNoiDungThayDoi(), // Nội dung chi tiết từ frontend
                logRequest.getNguoiThucHien(), // Người thực hiện từ frontend (hoặc từ hệ thống)
                logRequest.getGhiChu(), // Ghi chú thêm nếu có
                hoaDon.getTrangThai() // Trạng thái hiện tại, không thay đổi qua log này
        );
    }
}
