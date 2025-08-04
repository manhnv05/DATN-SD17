package com.example.datn.repository;

import com.example.datn.entity.HoaDon;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

public interface ThongKeRepository extends JpaRepository<HoaDon, Integer> {
    @Query("SELECT hd FROM HoaDon hd WHERE hd.ngayTao >= :startOfDay AND hd.ngayTao <= :endOfDay")
    List<HoaDon> getThongKeHomNay(@Param("startOfDay") LocalDateTime startOfDay,
                                  @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT hd FROM HoaDon hd WHERE FUNCTION('WEEK', hd.ngayTao) = FUNCTION('WEEK', CURRENT_DATE) AND FUNCTION('YEAR', hd.ngayTao) = FUNCTION('YEAR', CURRENT_DATE)")
    List<HoaDon> getThongKeTuanNay();

    @Query("SELECT hd FROM HoaDon hd WHERE MONTH(hd.ngayTao) = MONTH(CURRENT_DATE) AND YEAR(hd.ngayTao) = YEAR(CURRENT_DATE)")
    List<HoaDon> getThongKeThangNay();

    @Query("SELECT hd FROM HoaDon hd WHERE YEAR(hd.ngayTao) = YEAR(CURRENT_DATE)")
    List<HoaDon> getThongKeNamNay();

    @Query("""
    SELECT hd FROM HoaDon hd
    WHERE (:#{#search.tuNgay} IS NULL OR hd.ngayTao >= :#{#search.tuNgay})
      AND (:#{#search.denNgay} IS NULL OR hd.ngayTao <= :#{#search.denNgay})
    """)
    List<HoaDon> getAllByQuery(@RequestParam("search") ThongKeVoSearch search);
}
