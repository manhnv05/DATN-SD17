package com.example.datn.mapper;

import com.example.datn.dto.HoaDonDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.vo.hoaDonVO.HoaDonRequestUpdateVO;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-03T02:05:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
public class HoaDonUpdateMapperImpl implements HoaDonUpdateMapper {

    @Override
    public HoaDonDTO toResponseDTO(HoaDon hoaDon) {
        if ( hoaDon == null ) {
            return null;
        }

        HoaDonDTO hoaDonDTO = new HoaDonDTO();

        hoaDonDTO.setId( hoaDon.getId() );
        hoaDonDTO.setNgayTao( hoaDon.getNgayTao() );
        hoaDonDTO.setNgayGiaoDuKien( hoaDon.getNgayGiaoDuKien() );
        hoaDonDTO.setTrangThai( hoaDon.getTrangThai() );
        hoaDonDTO.setGhiChu( hoaDon.getGhiChu() );
        hoaDonDTO.setMaHoaDon( hoaDon.getMaHoaDon() );
        hoaDonDTO.setTenKhachHang( hoaDon.getTenKhachHang() );
        hoaDonDTO.setSdt( hoaDon.getSdt() );
        hoaDonDTO.setDiaChi( hoaDon.getDiaChi() );
        hoaDonDTO.setLoaiHoaDon( hoaDon.getLoaiHoaDon() );
        if ( hoaDon.getTongTienBanDau() != null ) {
            hoaDonDTO.setTongTienBanDau( hoaDon.getTongTienBanDau().doubleValue() );
        }
        if ( hoaDon.getTongTien() != null ) {
            hoaDonDTO.setTongTien( hoaDon.getTongTien().doubleValue() );
        }
        if ( hoaDon.getPhiVanChuyen() != null ) {
            hoaDonDTO.setPhiVanChuyen( hoaDon.getPhiVanChuyen().doubleValue() );
        }
        if ( hoaDon.getTongHoaDon() != null ) {
            hoaDonDTO.setTongHoaDon( hoaDon.getTongHoaDon().doubleValue() );
        }

        return hoaDonDTO;
    }

    @Override
    public void updateHoaDon(HoaDon hoaDon, HoaDonRequestUpdateVO hoaDonRequestUpdateVO) {
        if ( hoaDonRequestUpdateVO == null ) {
            return;
        }

        hoaDon.setDiaChi( hoaDonRequestUpdateVO.getDiaChi() );
        hoaDon.setGhiChu( hoaDonRequestUpdateVO.getGhiChu() );
        hoaDon.setSdt( hoaDonRequestUpdateVO.getSdt() );
        hoaDon.setPhiVanChuyen( hoaDonRequestUpdateVO.getPhiVanChuyen() );
        hoaDon.setTenKhachHang( hoaDonRequestUpdateVO.getTenKhachHang() );
    }
}
