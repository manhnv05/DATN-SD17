package com.example.datn.repository;

import com.example.datn.entity.HinhAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhRepository extends JpaRepository<HinhAnh, Integer>, JpaSpecificationExecutor<HinhAnh> {

    // Lấy tất cả hình ảnh theo id chi tiết sản phẩm thông qua bảng trung gian
    // Nếu bạn cần thì dùng findBySpctHinhAnhs_ChiTietSanPham_Id
    List<HinhAnh> findBySpctHinhAnhs_ChiTietSanPham_Id(Integer idSanPhamChiTiet);

//    @Query("SELECT h FROM HinhAnh h WHERE h.spctHinhAnhs IS EMPTY")
//    List<HinhAnh> findHinhAnhChuaGanSanPham();

    // Nếu không có mapping entity, dùng native query:
     @Query(value = "SELECT * FROM hinh_anh ha WHERE NOT EXISTS (SELECT 1 FROM spct_hinhanh sh WHERE sh.id_hinh_anh = ha.id)", nativeQuery = true)
     List<HinhAnh> findHinhAnhChuaGanSanPham();

}