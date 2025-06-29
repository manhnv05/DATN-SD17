package com.example.datn.mapper;


import com.example.datn.DTO.KhachHangDTO;
import com.example.datn.Entity.KhachHang;
import com.example.datn.VO.KhachHangUpdateVO;
import com.example.datn.VO.KhachHangVO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface KhachHangMapper {
    KhachHangMapper INSTANCE = Mappers.getMapper(KhachHangMapper.class);

    KhachHang toKhachHang(KhachHangVO request);

    void updateKhachHang(@MappingTarget KhachHang khachHang, KhachHangUpdateVO request);

    KhachHangDTO toResponse(KhachHang khachHang);
}
