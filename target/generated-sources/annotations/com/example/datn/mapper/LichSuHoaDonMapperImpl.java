package com.example.datn.mapper;

import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.entity.LichSuHoaDon;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-08-03T02:05:38+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class LichSuHoaDonMapperImpl implements LichSuHoaDonMapper {

    @Override
    public HoaDonHistoryDTO toHoaDonHistoryResponse(LichSuHoaDon entity) {
        if ( entity == null ) {
            return null;
        }

        HoaDonHistoryDTO hoaDonHistoryDTO = new HoaDonHistoryDTO();

        hoaDonHistoryDTO.setThoiGian( toTimestamp( entity.getThoiGianThayDoi() ) );
        hoaDonHistoryDTO.setNguoiChinhSua( entity.getNguoiThucHien() );
        hoaDonHistoryDTO.setTrangThaiHoaDon( mapTrangThaiDisplayName( entity.getTrangThaiMoiHoaDon() ) );
        hoaDonHistoryDTO.setGhiChu( entity.getGhiChu() );

        return hoaDonHistoryDTO;
    }
}
