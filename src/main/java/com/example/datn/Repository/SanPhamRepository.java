package com.example.datn.Repository;

import com.example.datn.Entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer>, JpaSpecificationExecutor<SanPham> {
    List<SanPham> findByMaSanPhamOrTenSanPham(String maSanPham, String tenSanPham);

    // Thêm các hàm hỗ trợ phân trang và lọc theo yêu cầu FE
    Page<SanPham> findByTrangThai(Integer trangThai, Pageable pageable);

    Page<SanPham> findByTenSanPhamContainingIgnoreCase(String tenSanPham, Pageable pageable);

    Page<SanPham> findByTenSanPhamContainingIgnoreCaseAndTrangThai(String tenSanPham, Integer trangThai, Pageable pageable);

    @Query("SELECT s.tenSanPham FROM SanPham s")
    List<String> findAllTenSanPham();

}