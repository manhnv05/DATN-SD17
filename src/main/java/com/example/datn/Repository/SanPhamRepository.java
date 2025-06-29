package com.example.datn.Repository;

import com.example.datn.Entity.SanPham;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer>, JpaSpecificationExecutor<SanPham> {

    // Tìm theo mã hoặc tên (keyword search)
    List<SanPham> findByMaSanPhamOrTenSanPham(String maSanPham, String tenSanPham);

    // Phân trang theo trạng thái cụ thể (nếu cần)
    Page<SanPham> findByTrangThai(Integer trangThai, Pageable pageable);

    // Phân trang tìm tên có chứa chuỗi (bất kể hoa thường)
    Page<SanPham> findByTenSanPhamContainingIgnoreCase(String tenSanPham, Pageable pageable);

    // Phân trang theo tên + trạng thái (dùng cho lọc nâng cao)
    Page<SanPham> findByTenSanPhamContainingIgnoreCaseAndTrangThai(String tenSanPham, Integer trangThai, Pageable pageable);

    // Lấy tất cả tên sản phẩm
    @Query("SELECT s.tenSanPham FROM SanPham s WHERE s.trangThai IN (0, 1)")
    List<String> findAllTenSanPham();

    // Xóa mềm (soft delete = update trangThai = 3)
    @Modifying
    @Transactional
    @Query("UPDATE SanPham s SET s.trangThai = 3 WHERE s.id = :id")
    void softDeleteById(Integer id);

    // Lấy danh sách sản phẩm đang hoạt động (trạng thái 0, 1) theo thứ tự mới nhất
    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1) ORDER BY s.id DESC")
    List<SanPham> findActiveSanPhamOrderByIdDesc();

    // Phân trang cho sản phẩm trạng thái 0, 1
    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1)")
    Page<SanPham> findAllActive(Pageable pageable);

    // Tìm tên gần đúng + chỉ lấy sản phẩm trạng thái 0, 1
    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1) AND LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SanPham> searchByTenSanPhamActive(@Param("keyword") String keyword, Pageable pageable);
}
