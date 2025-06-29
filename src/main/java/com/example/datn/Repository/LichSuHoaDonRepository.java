package com.example.datn.Repository;

import com.example.datn.Entity.LichSuHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon, Integer> {
    //    List<LichSuHoaDon> findByHoaDon_OrderByThoiGianThayDoiDesc(Integer hoaDonId);
    // Trong LichSuHoaDonRepository.java
    List<LichSuHoaDon> findByHoaDon_MaHoaDonOrderByThoiGianThayDoiDesc(String maHoaDon);
}

