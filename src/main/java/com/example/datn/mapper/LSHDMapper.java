package com.example.datn.mapper;

import com.example.datn.dto.LichSuHoaDonDTO;
import com.example.datn.entity.LichSuHoaDon;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface LSHDMapper {
    LSHDMapper INSTANCE = Mappers.getMapper(LSHDMapper.class);

    LichSuHoaDonDTO toResponse(LichSuHoaDon lichSuHoaDon);
}
