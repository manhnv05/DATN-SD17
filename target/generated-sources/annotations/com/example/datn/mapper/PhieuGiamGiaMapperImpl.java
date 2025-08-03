package com.example.datn.mapper;

import com.example.datn.dto.PhieuGiamGiaDTO;
import com.example.datn.entity.PhieuGiamGia;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVO;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVOUpdate;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-03T02:05:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
public class PhieuGiamGiaMapperImpl implements PhieuGiamGiaMapper {

    @Override
    public PhieuGiamGia toPhieuGiamGia(PhieuGiamGiaVO request) {
        if ( request == null ) {
            return null;
        }

        PhieuGiamGia phieuGiamGia = new PhieuGiamGia();

        phieuGiamGia.setMaPhieuGiamGia( request.getMaPhieuGiamGia() );
        phieuGiamGia.setDieuKienGiam( request.getDieuKienGiam() );
        phieuGiamGia.setTenPhieu( request.getTenPhieu() );
        phieuGiamGia.setLoaiPhieu( request.getLoaiPhieu() );
        phieuGiamGia.setPhamTramGiamGia( request.getPhamTramGiamGia() );
        phieuGiamGia.setSoTienGiam( request.getSoTienGiam() );
        phieuGiamGia.setGiamToiDa( request.getGiamToiDa() );
        phieuGiamGia.setNgayBatDau( request.getNgayBatDau() );
        phieuGiamGia.setNgayKetThuc( request.getNgayKetThuc() );
        phieuGiamGia.setNgayTao( request.getNgayTao() );
        phieuGiamGia.setNgayCapNhat( request.getNgayCapNhat() );
        phieuGiamGia.setGhiChu( request.getGhiChu() );
        phieuGiamGia.setTrangThai( request.getTrangThai() );
        phieuGiamGia.setSoLuong( request.getSoLuong() );

        return phieuGiamGia;
    }

    @Override
    public void updatePhieuGiamGia(PhieuGiamGia phieuGiamGia, PhieuGiamGiaVOUpdate request) {
        if ( request == null ) {
            return;
        }

        phieuGiamGia.setId( request.getId() );
        phieuGiamGia.setMaPhieuGiamGia( request.getMaPhieuGiamGia() );
        phieuGiamGia.setDieuKienGiam( request.getDieuKienGiam() );
        phieuGiamGia.setTenPhieu( request.getTenPhieu() );
        phieuGiamGia.setLoaiPhieu( request.getLoaiPhieu() );
        phieuGiamGia.setPhamTramGiamGia( request.getPhamTramGiamGia() );
        phieuGiamGia.setSoTienGiam( request.getSoTienGiam() );
        phieuGiamGia.setGiamToiDa( request.getGiamToiDa() );
        phieuGiamGia.setNgayBatDau( request.getNgayBatDau() );
        phieuGiamGia.setNgayKetThuc( request.getNgayKetThuc() );
        phieuGiamGia.setNgayTao( request.getNgayTao() );
        phieuGiamGia.setNgayCapNhat( request.getNgayCapNhat() );
        phieuGiamGia.setGhiChu( request.getGhiChu() );
        phieuGiamGia.setTrangThai( request.getTrangThai() );
        phieuGiamGia.setSoLuong( request.getSoLuong() );
    }

    @Override
    public PhieuGiamGiaDTO toResponse(PhieuGiamGia phieuGiamGia) {
        if ( phieuGiamGia == null ) {
            return null;
        }

        PhieuGiamGiaDTO phieuGiamGiaDTO = new PhieuGiamGiaDTO();

        phieuGiamGiaDTO.setId( phieuGiamGia.getId() );
        phieuGiamGiaDTO.setMaPhieuGiamGia( phieuGiamGia.getMaPhieuGiamGia() );
        phieuGiamGiaDTO.setDieuKienGiam( phieuGiamGia.getDieuKienGiam() );
        phieuGiamGiaDTO.setTenPhieu( phieuGiamGia.getTenPhieu() );
        phieuGiamGiaDTO.setLoaiPhieu( phieuGiamGia.getLoaiPhieu() );
        phieuGiamGiaDTO.setPhamTramGiamGia( phieuGiamGia.getPhamTramGiamGia() );
        phieuGiamGiaDTO.setSoTienGiam( phieuGiamGia.getSoTienGiam() );
        phieuGiamGiaDTO.setGiamToiDa( phieuGiamGia.getGiamToiDa() );
        phieuGiamGiaDTO.setNgayBatDau( phieuGiamGia.getNgayBatDau() );
        phieuGiamGiaDTO.setNgayKetThuc( phieuGiamGia.getNgayKetThuc() );
        phieuGiamGiaDTO.setNgayTao( phieuGiamGia.getNgayTao() );
        phieuGiamGiaDTO.setNgayCapNhat( phieuGiamGia.getNgayCapNhat() );
        phieuGiamGiaDTO.setGhiChu( phieuGiamGia.getGhiChu() );
        phieuGiamGiaDTO.setTrangThai( phieuGiamGia.getTrangThai() );
        phieuGiamGiaDTO.setSoLuong( phieuGiamGia.getSoLuong() );

        return phieuGiamGiaDTO;
    }
}
