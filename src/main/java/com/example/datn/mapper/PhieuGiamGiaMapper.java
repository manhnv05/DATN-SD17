package com.example.datn.mapper;

import com.example.datn.DTO.PhieuGiamGiaDTO;
import com.example.datn.Entity.PhieuGiamGia;
import com.example.datn.VO.PhieuGiamGiaVO;
import com.example.datn.VO.PhieuGiamGiaVOUpdate;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PhieuGiamGiaMapper {
    PhieuGiamGiaMapper INSTANCE = Mappers.getMapper(PhieuGiamGiaMapper.class);

    PhieuGiamGia toPhieuGiamGia(PhieuGiamGiaVO request);

    void updatePhieuGiamGia(@MappingTarget PhieuGiamGia phieuGiamGia, PhieuGiamGiaVOUpdate request);

    PhieuGiamGiaDTO toResponse(PhieuGiamGia phieuGiamGia);
}
