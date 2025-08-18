package com.example.datn.repository;

import com.example.datn.entity.GioHang;
import com.example.datn.enums.LoaiNguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GioHangRepository extends JpaRepository<GioHang, Integer> {
    List<GioHang> findByIdNguoiDungAndLoaiNguoiDung(Long idNguoiDung, LoaiNguoiDung loaiNguoiDung);

    Optional<GioHang> findByIdNguoiDungAndLoaiNguoiDungAndChiTietSanPham_Id(Long idNguoiDung, LoaiNguoiDung loaiNguoiDung, Long chiTietSanPhamId);

    void deleteByIdNguoiDungAndLoaiNguoiDung(Long idNguoiDung, LoaiNguoiDung loaiNguoiDung);

    void deleteByIdNguoiDungAndLoaiNguoiDungAndChiTietSanPham_Id(Long idNguoiDung, LoaiNguoiDung loaiNguoiDung, Long chiTietSanPhamId);
}