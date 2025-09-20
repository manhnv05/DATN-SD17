package com.example.datn.repository;

import com.example.datn.entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DotGiamGiaRepository extends JpaRepository<DotGiamGia, Integer>, JpaSpecificationExecutor<DotGiamGia> {

    Optional<DotGiamGia> findFirstByMaDotGiamGiaStartingWithOrderByMaDotGiamGiaDesc(String prefix);

    List<DotGiamGia> findByNgayKetThucBeforeAndTrangThaiNot(LocalDateTime now , int trangThai);
    List<DotGiamGia> findByNgayBatDauAfterAndTrangThaiNotIn(LocalDateTime now, List<Integer> trangThais);

    @Query("""
    SELECT p FROM DotGiamGia p
    WHERE
    (p.ngayKetThuc > p.ngayBatDau AND p.ngayKetThuc > :now AND p.ngayBatDau < :now AND p.trangThai != 4 AND p.trangThai !=3)
    """)
    List<DotGiamGia> findDotGiamGiaByNow(@Param("now") LocalDateTime now);

}