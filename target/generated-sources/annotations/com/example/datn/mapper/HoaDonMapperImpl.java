package com.example.datn.mapper;

import com.example.datn.dto.HoaDonDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.vo.hoaDonVO.HoaDonCreateVO;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-03T02:05:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class HoaDonMapperImpl implements HoaDonMapper {

    @Override
    public HoaDon toHoaDon(HoaDonCreateVO request) {
        if ( request == null ) {
            return null;
        }

        HoaDon.HoaDonBuilder hoaDon = HoaDon.builder();

        hoaDon.diaChi( request.getDiaChi() );
        hoaDon.ghiChu( request.getGhiChu() );
        hoaDon.sdt( request.getSdt() );
        hoaDon.loaiHoaDon( request.getLoaiHoaDon() );

        return hoaDon.build();
    }

    @Override
    public HoaDonDTO toHoaDonResponse(HoaDon hoaDon) {
        if ( hoaDon == null ) {
            return null;
        }

        HoaDonDTO hoaDonDTO = new HoaDonDTO();

        hoaDonDTO.setId( hoaDon.getId() );
        hoaDonDTO.setNgayTao( hoaDon.getNgayTao() );
        hoaDonDTO.setNgayGiaoDuKien( hoaDon.getNgayGiaoDuKien() );
        hoaDonDTO.setLoaiHoaDon( hoaDon.getLoaiHoaDon() );
        hoaDonDTO.setSdt( hoaDon.getSdt() );
        hoaDonDTO.setDiaChi( hoaDon.getDiaChi() );
        hoaDonDTO.setGhiChu( hoaDon.getGhiChu() );
        hoaDonDTO.setTrangThai( hoaDon.getTrangThai() );
        if ( hoaDon.getTongTien() != null ) {
            hoaDonDTO.setTongTien( hoaDon.getTongTien().doubleValue() );
        }
        if ( hoaDon.getTongTienBanDau() != null ) {
            hoaDonDTO.setTongTienBanDau( hoaDon.getTongTienBanDau().doubleValue() );
        }
        if ( hoaDon.getPhiVanChuyen() != null ) {
            hoaDonDTO.setPhiVanChuyen( hoaDon.getPhiVanChuyen().doubleValue() );
        }
        if ( hoaDon.getTongHoaDon() != null ) {
            hoaDonDTO.setTongHoaDon( hoaDon.getTongHoaDon().doubleValue() );
        }
        hoaDonDTO.setMaHoaDon( hoaDon.getMaHoaDon() );

        hoaDonDTO.setTenKhachHang( hoaDon.getKhachHang() != null ? hoaDon.getKhachHang().getTenKhachHang() : "Khách lẻ" );
        hoaDonDTO.setTenNhanVien( hoaDon.getNhanVien() != null ? hoaDon.getNhanVien().getHoVaTen() : null );
        hoaDonDTO.setMaNhanVien( hoaDon.getNhanVien() != null ? hoaDon.getNhanVien().getMaNhanVien() : null );

        return hoaDonDTO;
    }
}
