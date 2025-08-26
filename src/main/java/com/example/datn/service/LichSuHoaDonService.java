package com.example.datn.service;

import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.dto.LichSuDonHangKhachHangDTO;
import com.example.datn.dto.LichSuHoaDonDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.enums.TrangThai;
import com.example.datn.vo.lichSuHoaDonVO.LichSuLogVO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface LichSuHoaDonService {
    void ghiNhanLichSuHoaDon(HoaDon hoaDon, String noiDungThayDoi, String nguoiThucHien, String ghiChu, TrangThai trangThaiMoi);

    List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String maHoaDon);

    List<LichSuDonHangKhachHangDTO> getLichSuDonHangCuaKhachHang(Integer idKhachHang);

    HoaDonHistoryDTO layLichSuThayDoiTrangThaiGanNhat(Integer idHoaDon);

    List<LichSuHoaDonDTO> getAllLichSuHoaDon(String maHoaDon);

    void luuLichSuTuApi(LichSuLogVO logRequest);
}
