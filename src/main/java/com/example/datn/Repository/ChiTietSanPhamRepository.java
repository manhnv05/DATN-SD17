package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham, Integer>, JpaSpecificationExecutor<ChiTietSanPham> {

    // Tìm kiếm theo mã sản phẩm chi tiết hoặc mô tả (không phân biệt hoa thường)
    List<ChiTietSanPham> findByMaSanPhamChiTietContainingIgnoreCaseOrMoTaContainingIgnoreCase(String maSanPhamChiTiet, String moTa);

    // Tìm tất cả chi tiết sản phẩm theo id sản phẩm cha
    List<ChiTietSanPham> findBySanPhamId(Integer idSanPham);
}