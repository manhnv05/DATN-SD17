package com.example.datn.mapper;

import com.example.datn.dto.ChiTietPhieuGiamGiaDTO;
import com.example.datn.dto.DiaChiDTO;
import com.example.datn.dto.KhachHangDTO;
import com.example.datn.dto.PhieuGiamGiaDTO;
import com.example.datn.entity.ChiTietPhieuGiamGia;
import com.example.datn.entity.DiaChi;
import com.example.datn.entity.KhachHang;
import com.example.datn.entity.PhieuGiamGia;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaVO;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-03T02:05:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
public class ChiTietPhieuGiamGiaMapperImpl implements ChiTietPhieuGiamGiaMapper {

    @Override
    public ChiTietPhieuGiamGia toPhieuGiamGiaKhachHang(ChiTietPhieuGiamGiaVO request) {
        if ( request == null ) {
            return null;
        }

        ChiTietPhieuGiamGia chiTietPhieuGiamGia = new ChiTietPhieuGiamGia();

        chiTietPhieuGiamGia.setPhieuGiamGia( chiTietPhieuGiamGiaVOToPhieuGiamGia( request ) );
        chiTietPhieuGiamGia.setKhachHang( chiTietPhieuGiamGiaVOToKhachHang( request ) );
        chiTietPhieuGiamGia.setTrangThai( request.getTrangThai() );

        return chiTietPhieuGiamGia;
    }

    @Override
    public ChiTietPhieuGiamGia toPhieuGiamGiaKhachHangUpdate(ChiTietPhieuGiamGiaUpdateVO request) {
        if ( request == null ) {
            return null;
        }

        ChiTietPhieuGiamGia chiTietPhieuGiamGia = new ChiTietPhieuGiamGia();

        chiTietPhieuGiamGia.setPhieuGiamGia( chiTietPhieuGiamGiaUpdateVOToPhieuGiamGia( request ) );
        chiTietPhieuGiamGia.setKhachHang( chiTietPhieuGiamGiaUpdateVOToKhachHang( request ) );
        if ( request.getId() != null ) {
            chiTietPhieuGiamGia.setId( request.getId() );
        }

        return chiTietPhieuGiamGia;
    }

    @Override
    public void updatePhieuGiamGiaKhachHang(ChiTietPhieuGiamGia phieuGiamGiaKH, ChiTietPhieuGiamGiaUpdateVO request) {
        if ( request == null ) {
            return;
        }

        if ( phieuGiamGiaKH.getPhieuGiamGia() == null ) {
            phieuGiamGiaKH.setPhieuGiamGia( new PhieuGiamGia() );
        }
        chiTietPhieuGiamGiaUpdateVOToPhieuGiamGia1( request, phieuGiamGiaKH.getPhieuGiamGia() );
        if ( phieuGiamGiaKH.getKhachHang() == null ) {
            phieuGiamGiaKH.setKhachHang( KhachHang.builder().build() );
        }
        chiTietPhieuGiamGiaUpdateVOToKhachHang1( request, phieuGiamGiaKH.getKhachHang() );
        if ( request.getId() != null ) {
            phieuGiamGiaKH.setId( request.getId() );
        }
    }

    @Override
    public ChiTietPhieuGiamGiaDTO toResponse(ChiTietPhieuGiamGia phieuGiamGiaKhachHang) {
        if ( phieuGiamGiaKhachHang == null ) {
            return null;
        }

        ChiTietPhieuGiamGiaDTO chiTietPhieuGiamGiaDTO = new ChiTietPhieuGiamGiaDTO();

        chiTietPhieuGiamGiaDTO.setId( phieuGiamGiaKhachHang.getId() );
        chiTietPhieuGiamGiaDTO.setPhieuGiamGia( phieuGiamGiaToPhieuGiamGiaDTO( phieuGiamGiaKhachHang.getPhieuGiamGia() ) );
        chiTietPhieuGiamGiaDTO.setKhachHang( khachHangToKhachHangDTO( phieuGiamGiaKhachHang.getKhachHang() ) );

        return chiTietPhieuGiamGiaDTO;
    }

    protected PhieuGiamGia chiTietPhieuGiamGiaVOToPhieuGiamGia(ChiTietPhieuGiamGiaVO chiTietPhieuGiamGiaVO) {
        if ( chiTietPhieuGiamGiaVO == null ) {
            return null;
        }

        PhieuGiamGia phieuGiamGia = new PhieuGiamGia();

        if ( chiTietPhieuGiamGiaVO.getPhieuGiamGia() != null ) {
            phieuGiamGia.setId( Integer.parseInt( chiTietPhieuGiamGiaVO.getPhieuGiamGia() ) );
        }

        return phieuGiamGia;
    }

    protected KhachHang chiTietPhieuGiamGiaVOToKhachHang(ChiTietPhieuGiamGiaVO chiTietPhieuGiamGiaVO) {
        if ( chiTietPhieuGiamGiaVO == null ) {
            return null;
        }

        KhachHang.KhachHangBuilder khachHang = KhachHang.builder();

        if ( chiTietPhieuGiamGiaVO.getKhachHang() != null ) {
            khachHang.id( Integer.parseInt( chiTietPhieuGiamGiaVO.getKhachHang() ) );
        }

        return khachHang.build();
    }

    protected PhieuGiamGia chiTietPhieuGiamGiaUpdateVOToPhieuGiamGia(ChiTietPhieuGiamGiaUpdateVO chiTietPhieuGiamGiaUpdateVO) {
        if ( chiTietPhieuGiamGiaUpdateVO == null ) {
            return null;
        }

        PhieuGiamGia phieuGiamGia = new PhieuGiamGia();

        if ( chiTietPhieuGiamGiaUpdateVO.getPhieuGiamGia() != null ) {
            phieuGiamGia.setId( Integer.parseInt( chiTietPhieuGiamGiaUpdateVO.getPhieuGiamGia() ) );
        }

        return phieuGiamGia;
    }

    protected KhachHang chiTietPhieuGiamGiaUpdateVOToKhachHang(ChiTietPhieuGiamGiaUpdateVO chiTietPhieuGiamGiaUpdateVO) {
        if ( chiTietPhieuGiamGiaUpdateVO == null ) {
            return null;
        }

        KhachHang.KhachHangBuilder khachHang = KhachHang.builder();

        if ( chiTietPhieuGiamGiaUpdateVO.getKhachHang() != null ) {
            khachHang.id( Integer.parseInt( chiTietPhieuGiamGiaUpdateVO.getKhachHang() ) );
        }

        return khachHang.build();
    }

    protected void chiTietPhieuGiamGiaUpdateVOToPhieuGiamGia1(ChiTietPhieuGiamGiaUpdateVO chiTietPhieuGiamGiaUpdateVO, PhieuGiamGia mappingTarget) {
        if ( chiTietPhieuGiamGiaUpdateVO == null ) {
            return;
        }

        if ( chiTietPhieuGiamGiaUpdateVO.getPhieuGiamGia() != null ) {
            mappingTarget.setId( Integer.parseInt( chiTietPhieuGiamGiaUpdateVO.getPhieuGiamGia() ) );
        }
    }

    protected void chiTietPhieuGiamGiaUpdateVOToKhachHang1(ChiTietPhieuGiamGiaUpdateVO chiTietPhieuGiamGiaUpdateVO, KhachHang mappingTarget) {
        if ( chiTietPhieuGiamGiaUpdateVO == null ) {
            return;
        }

        if ( chiTietPhieuGiamGiaUpdateVO.getKhachHang() != null ) {
            mappingTarget.setId( Integer.parseInt( chiTietPhieuGiamGiaUpdateVO.getKhachHang() ) );
        }
        else {
            mappingTarget.setId( null );
        }
    }

    protected PhieuGiamGiaDTO phieuGiamGiaToPhieuGiamGiaDTO(PhieuGiamGia phieuGiamGia) {
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

    protected DiaChiDTO diaChiToDiaChiDTO(DiaChi diaChi) {
        if ( diaChi == null ) {
            return null;
        }

        DiaChiDTO diaChiDTO = new DiaChiDTO();

        diaChiDTO.setId( diaChi.getId() );
        diaChiDTO.setTinhThanhPho( diaChi.getTinhThanhPho() );
        diaChiDTO.setQuanHuyen( diaChi.getQuanHuyen() );
        diaChiDTO.setXaPhuong( diaChi.getXaPhuong() );
        diaChiDTO.setTrangThai( diaChi.getTrangThai() );

        return diaChiDTO;
    }

    protected List<DiaChiDTO> diaChiListToDiaChiDTOList(List<DiaChi> list) {
        if ( list == null ) {
            return null;
        }

        List<DiaChiDTO> list1 = new ArrayList<DiaChiDTO>( list.size() );
        for ( DiaChi diaChi : list ) {
            list1.add( diaChiToDiaChiDTO( diaChi ) );
        }

        return list1;
    }

    protected KhachHangDTO khachHangToKhachHangDTO(KhachHang khachHang) {
        if ( khachHang == null ) {
            return null;
        }

        KhachHangDTO khachHangDTO = new KhachHangDTO();

        khachHangDTO.setId( khachHang.getId() );
        khachHangDTO.setMaKhachHang( khachHang.getMaKhachHang() );
        khachHangDTO.setMatKhau( khachHang.getMatKhau() );
        khachHangDTO.setTenKhachHang( khachHang.getTenKhachHang() );
        khachHangDTO.setEmail( khachHang.getEmail() );
        khachHangDTO.setGioiTinh( khachHang.getGioiTinh() );
        khachHangDTO.setSdt( khachHang.getSdt() );
        khachHangDTO.setNgaySinh( khachHang.getNgaySinh() );
        khachHangDTO.setHinhAnh( khachHang.getHinhAnh() );
        khachHangDTO.setTrangThai( khachHang.getTrangThai() );
        khachHangDTO.setDiaChis( diaChiListToDiaChiDTOList( khachHang.getDiaChis() ) );

        return khachHangDTO;
    }
}
