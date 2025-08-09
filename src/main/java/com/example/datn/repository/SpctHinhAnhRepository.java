package com.example.datn.repository;

import com.example.datn.entity.SpctHinhAnh;
import com.example.datn.entity.ChiTietSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpctHinhAnhRepository extends JpaRepository<SpctHinhAnh, Integer> {

    // Lấy mapping theo id chi tiết sản phẩm
    List<SpctHinhAnh> findByChiTietSanPham_Id(Integer idSanPhamChiTiet);

    // Xóa tất cả mapping của 1 hình ảnh
    void deleteByHinhAnh_Id(Integer idHinhAnh);

    // Xóa tất cả mapping của 1 chi tiết sản phẩm (phục vụ cho update)
    void deleteByChiTietSanPham_Id(Integer idSanPhamChiTiet);

    // Nếu bạn muốn xóa theo entity:
    void deleteAllByChiTietSanPham(ChiTietSanPham chiTietSanPham);

    // Kiểm tra tồn tại mapping
    boolean existsByChiTietSanPham_IdAndHinhAnh_Id(Integer idSanPhamChiTiet, Integer idHinhAnh);

}