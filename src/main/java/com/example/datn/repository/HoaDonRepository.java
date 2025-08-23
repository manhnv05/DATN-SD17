package com.example.datn.repository;

import com.example.datn.dto.CountTrangThaiHoaDon;
import com.example.datn.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository  extends JpaRepository<HoaDon, Integer>,JpaSpecificationExecutor<HoaDon> {

    @Query("SELECT h.trangThai AS trangThai, COUNT(*) AS soLuong FROM HoaDon h GROUP BY h.trangThai")
    List<CountTrangThaiHoaDon> getCoutnTrangThaiHoaDon();

    HoaDon findByMaHoaDon(String maHoaDon);

    @Query("SELECT hd FROM HoaDon hd " +
            "LEFT JOIN FETCH hd.khachHang " +
            "LEFT JOIN FETCH hd.nhanVien " +
            "LEFT JOIN FETCH hd.phieuGiamGia " +
            "WHERE hd.maHoaDon = :maHoaDon")
    Optional<HoaDon> findHoaDonChiTiet(@Param("maHoaDon") String maHoaDon);
}
