package com.example.datn.service.impl;



import com.example.datn.dto.HoaDonChiTietDTO;
import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.dto.LichSuHoaDonDTO;
import com.example.datn.dto.TraCuuHoaDonDTO;
import com.example.datn.dto.TraCuuHoaDonDTO.NhanVienTraCuuDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.LichSuHoaDonRepository;
import com.example.datn.service.HoaDonChiTietService;
import com.example.datn.service.LichSuHoaDonService;
import com.example.datn.service.TraCuuHoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TraCuuHoaDonServiceImpl implements TraCuuHoaDonService {
  private final   HoaDonRepository hoaDonRepository;
    private final   LichSuHoaDonService lichSuHoaDonService;
    private final   HoaDonChiTietService hoaDonChiTietService;
    @Override
    public TraCuuHoaDonDTO traCuuHoaDon(String maHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findHoaDonChiTiet(maHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        TraCuuHoaDonDTO traCuuHoaDonDTO = new TraCuuHoaDonDTO();
        traCuuHoaDonDTO.setId(hoaDon.getId());
        traCuuHoaDonDTO.setMaHoaDon(maHoaDon);
        traCuuHoaDonDTO.setTrangThai(String.valueOf(hoaDon.getTrangThai()));
        traCuuHoaDonDTO.setSdt(hoaDon.getSdt());
        traCuuHoaDonDTO.setNgayTao(hoaDon.getNgayTao());
        traCuuHoaDonDTO.setNgayGiaoDuKien(hoaDon.getNgayGiaoDuKien());
        traCuuHoaDonDTO.setTenKhachHang(hoaDon.getTenKhachHang());
        traCuuHoaDonDTO.setDiaChi(hoaDon.getDiaChi());
        traCuuHoaDonDTO.setLoaiHoaDon(hoaDon.getLoaiHoaDon());
        traCuuHoaDonDTO.setGhiChu(hoaDon.getGhiChu());

        Double phiVC = hoaDon.getPhiVanChuyen() == null ? 0.0 : hoaDon.getPhiVanChuyen();
        traCuuHoaDonDTO.setPhiVanChuyen(phiVC);
        traCuuHoaDonDTO.setTongTienBanDau(Double.valueOf(hoaDon.getTongTienBanDau()));
        traCuuHoaDonDTO.setTongTien(Double.valueOf(hoaDon.getTongTien()));
        traCuuHoaDonDTO.setTongHoaDon(Double.valueOf(hoaDon.getTongHoaDon()));

        traCuuHoaDonDTO.setNhanVien(new NhanVienTraCuuDTO(
                hoaDon.getNhanVien().getMaNhanVien(),
                hoaDon.getNhanVien().getHoVaTen()
        ));
        String maPhieuGiamGia = hoaDon.getPhieuGiamGia() != null ? hoaDon.getPhieuGiamGia().getMaPhieuGiamGia() : null;
        Double tienGiamGia = Double.parseDouble(String.valueOf(hoaDon.getTongTienBanDau()- hoaDon.getTongTien()));
        traCuuHoaDonDTO.setPhieuGiamGia(new TraCuuHoaDonDTO.PhieuGiamGiaTraCuuDTO(
                maPhieuGiamGia,
                tienGiamGia
        ));
 List<HoaDonHistoryDTO> lichSuHoaDonDTO = lichSuHoaDonService.layLichSuThayDoiTrangThai(maHoaDon);
        List<TraCuuHoaDonDTO.LichSuHoaDonTraCuuDTO> lichSuHoaDonTraCuuDTOS =
                lichSuHoaDonDTO.stream()
                        .map(item -> new TraCuuHoaDonDTO.LichSuHoaDonTraCuuDTO(
                                item.getTrangThaiHoaDon(),
                                item.getThoiGian().toLocalDateTime()
                        ))
                        .toList();
traCuuHoaDonDTO.setLichSuHoaDon(lichSuHoaDonTraCuuDTOS);
       List<HoaDonChiTietDTO> hoaDonChiTietDTOList= hoaDonChiTietService.getHoaDonChiTiet(maHoaDon);
       List<TraCuuHoaDonDTO.ChiTietSanPhamTraCuuDTO> hoaDonTraCuuDTO= hoaDonChiTietDTOList.stream().map(item -> new TraCuuHoaDonDTO.ChiTietSanPhamTraCuuDTO(
               item.getIdSanPhamChiTiet(),
                item.getMaSanPhamChiTiet(),
                item.getTenSanPham(),
                item.getDuongDanAnh(),
                item.getTenMauSac(),
                item.getTenKichThuoc(),
                item.getSoLuong(),
               Double.valueOf(item.getGia()),
               Double.valueOf(item.getThanhTien())
        )).toList();
        traCuuHoaDonDTO.setDanhSachChiTiet(hoaDonTraCuuDTO);

        return traCuuHoaDonDTO;
    }
}
