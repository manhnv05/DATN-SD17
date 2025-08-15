package com.example.datn.repository;

import com.example.datn.entity.SanPham;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer>, JpaSpecificationExecutor<SanPham> {

    List<SanPham> findByMaSanPhamOrTenSanPham(String maSanPham, String tenSanPham);

    @Query("SELECT s.tenSanPham FROM SanPham s WHERE s.trangThai IN (0, 1)")
    List<String> findAllTenSanPham();

    @Modifying
    @Transactional
    @Query("UPDATE SanPham s SET s.trangThai = 3 WHERE s.id = :id")
    void softDeleteById(Integer id);

    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1) ORDER BY s.id DESC")
    List<SanPham> findActiveSanPhamOrderByIdDesc();

    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1)")
    Page<SanPham> findAllActive(Pageable pageable);

    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1) AND LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SanPham> searchByTenSanPhamActive(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s.maSanPham FROM SanPham s")
    List<String> findAllMaSanPham();

    @Query("SELECT DISTINCT sp FROM SanPham sp " +
            "LEFT JOIN sp.chiTietSanPhams ctsp " +
            "LEFT JOIN ctsp.mauSac ms " +
            "LEFT JOIN ctsp.kichThuoc kt " +
            "LEFT JOIN ctsp.thuongHieu th " +
            "LEFT JOIN sp.danhMuc dm " +
            "WHERE (:keyword IS NULL OR LOWER(sp.tenSanPham) LIKE CONCAT('%', :keyword, '%')) " +
            "AND (:color IS NULL OR ms.maMau = :color) " +
            "AND (:size IS NULL OR kt.ma = :size) " +
            "AND (:brand IS NULL OR th.tenThuongHieu = :brand) " +
            "AND (:category IS NULL OR dm.tenDanhMuc = :category) " +
            "AND (:priceMin IS NULL OR ctsp.gia >= :priceMin) " +
            "AND (:priceMax IS NULL OR ctsp.gia <= :priceMax) " +
            "AND sp.trangThai = 1 " +
            "AND (ctsp IS NULL OR ctsp.trangThai = 1)")
    Page<SanPham> searchWithFilter(
            @Param("keyword") String keyword,
            @Param("color") String color,
            @Param("size") String size,
            @Param("brand") String brand,
            @Param("category") String category,
            @Param("priceMin") Integer priceMin,
            @Param("priceMax") Integer priceMax,
            Pageable pageable
    );
}