package com.example.datn.Repository;

import com.example.datn.DTO.CountTrangThaiHoaDon;
import com.example.datn.Entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository  extends JpaRepository<HoaDon, Integer>,JpaSpecificationExecutor<HoaDon> {

    @Query("SELECT h.trangThai AS trangThai, COUNT(*) AS soLuong FROM HoaDon h GROUP BY h.trangThai")
    List<CountTrangThaiHoaDon> getCoutnTrangThaiHoaDon();


}
