package com.example.datn.repository;

import com.example.datn.entity.HoaDonChiTiet;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

public interface ThongKeSanPhamRepository extends JpaRepository<HoaDonChiTiet, Integer> {
    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE hdct.hoaDon.ngayTao >= :startOfDay AND hdct.hoaDon.ngayTao <= :endOfDay
    """)
    List<HoaDonChiTiet> getThongKeHomNay(@Param("startOfDay") LocalDateTime startOfDay,
                                         @Param("endOfDay") LocalDateTime endOfDay);

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE FUNCTION('WEEK', hdct.hoaDon.ngayTao) = FUNCTION('WEEK', CURRENT_DATE)
    AND FUNCTION('YEAR', hdct.hoaDon.ngayTao) = FUNCTION('YEAR', CURRENT_DATE)
    AND hdct.hoaDon.trangThai = 5
    """)
    List<HoaDonChiTiet> getThongKeTuanNay();

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE MONTH(hdct.hoaDon.ngayTao) = MONTH(CURRENT_DATE)
    AND YEAR(hdct.hoaDon.ngayTao) = YEAR(CURRENT_DATE)
    AND hdct.hoaDon.trangThai = 5
    """)
    List<HoaDonChiTiet> getThongKeThangNay();

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE YEAR(hdct.hoaDon.ngayTao) = YEAR(CURRENT_DATE)
    AND hdct.hoaDon.trangThai = 5
    """)
    List<HoaDonChiTiet> getThongKeNamNay();

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE (:#{#search.tuNgay} IS NULL OR hdct.hoaDon.ngayTao >= :#{#search.tuNgay})
      AND (:#{#search.denNgay} IS NULL OR hdct.hoaDon.ngayTao <= :#{#search.denNgay})
      AND hdct.hoaDon.trangThai = 5
    """)
    List<HoaDonChiTiet> getAllByQuery(@RequestParam("search") ThongKeVoSearch search);
}
