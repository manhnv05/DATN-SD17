package com.example.datn.service.impl;

import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.dto.LichSuDonHangKhachHangDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.entity.LichSuHoaDon;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.LichSuHoaDonRepository;
import com.example.datn.service.LichSuHoaDonService;
import com.example.datn.mapper.LichSuHoaDonMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.example.datn.enums.TrangThai;
import org.springframework.stereotype.Service;

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
        List<LichSuHoaDon> lichSuList = lichSuHoaDonRepository.findByHoaDon_MaHoaDonOrderByThoiGianThayDoiDesc(maHoaDon);
        return lichSuList.stream()
                .map(lichSuHoaDonMapper::toHoaDonHistoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LichSuDonHangKhachHangDTO> getLichSuDonHangCuaKhachHang(Integer idKhachHang) {
        List<HoaDon> hoaDonList= hoaDonRepository.findHoaDonByKhachHang_Id(idKhachHang);
        if (hoaDonList.isEmpty()) {
            throw new AppException(ErrorCode.THERE_ARE_NO_ORDERS_YET);
        }
        return  hoaDonList.stream()
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
         return  dto;

        }).collect(Collectors.toList());

    }

    @Override
    public HoaDonHistoryDTO layLichSuThayDoiTrangThaiGanNhat(Integer idHoaDon) {
        HoaDonHistoryDTO lichSuGanNhat = lichSuHoaDonRepository.findTrangThaiGanNhatCuaHoaDon(idHoaDon);
        return lichSuGanNhat;
    }
}
