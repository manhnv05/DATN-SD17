package com.example.datn.mapper;

import com.example.datn.dto.HoaDonChiTietDTO;
import com.example.datn.entity.HoaDonChiTiet;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-03T02:05:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class HoaDonChiTietMapperImpl implements HoaDonChiTietMapper {

    @Override
    public HoaDonChiTietDTO toDTO(HoaDonChiTietDTO hoaDonChiTietDTO) {
        if ( hoaDonChiTietDTO == null ) {
            return null;
        }

        HoaDonChiTietDTO.HoaDonChiTietDTOBuilder hoaDonChiTietDTO1 = HoaDonChiTietDTO.builder();

        hoaDonChiTietDTO1.id( hoaDonChiTietDTO.getId() );
        hoaDonChiTietDTO1.maSanPhamChiTiet( hoaDonChiTietDTO.getMaSanPhamChiTiet() );
        hoaDonChiTietDTO1.soLuong( hoaDonChiTietDTO.getSoLuong() );
        hoaDonChiTietDTO1.gia( hoaDonChiTietDTO.getGia() );
        hoaDonChiTietDTO1.thanhTien( hoaDonChiTietDTO.getThanhTien() );
        hoaDonChiTietDTO1.ghiChu( hoaDonChiTietDTO.getGhiChu() );
        hoaDonChiTietDTO1.trangThai( hoaDonChiTietDTO.getTrangThai() );
        hoaDonChiTietDTO1.tenSanPham( hoaDonChiTietDTO.getTenSanPham() );
        hoaDonChiTietDTO1.tenMauSac( hoaDonChiTietDTO.getTenMauSac() );
        hoaDonChiTietDTO1.tenKichThuoc( hoaDonChiTietDTO.getTenKichThuoc() );
        hoaDonChiTietDTO1.duongDanAnh( hoaDonChiTietDTO.getDuongDanAnh() );

        return hoaDonChiTietDTO1.build();
    }

    @Override
    public List<HoaDonChiTietDTO> toDtoList(List<HoaDonChiTiet> entities) {
        if ( entities == null ) {
            return null;
        }

        List<HoaDonChiTietDTO> list = new ArrayList<HoaDonChiTietDTO>( entities.size() );
        for ( HoaDonChiTiet hoaDonChiTiet : entities ) {
            list.add( hoaDonChiTietToHoaDonChiTietDTO( hoaDonChiTiet ) );
        }

        return list;
    }

    protected HoaDonChiTietDTO hoaDonChiTietToHoaDonChiTietDTO(HoaDonChiTiet hoaDonChiTiet) {
        if ( hoaDonChiTiet == null ) {
            return null;
        }

        HoaDonChiTietDTO.HoaDonChiTietDTOBuilder hoaDonChiTietDTO = HoaDonChiTietDTO.builder();

        hoaDonChiTietDTO.id( hoaDonChiTiet.getId() );
        hoaDonChiTietDTO.soLuong( hoaDonChiTiet.getSoLuong() );
        hoaDonChiTietDTO.gia( hoaDonChiTiet.getGia() );
        hoaDonChiTietDTO.thanhTien( hoaDonChiTiet.getThanhTien() );
        hoaDonChiTietDTO.ghiChu( hoaDonChiTiet.getGhiChu() );
        hoaDonChiTietDTO.trangThai( hoaDonChiTiet.getTrangThai() );

        return hoaDonChiTietDTO.build();
    }
}
