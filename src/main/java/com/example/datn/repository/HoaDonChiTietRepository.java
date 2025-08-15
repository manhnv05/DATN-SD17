package com.example.datn.repository;

import com.example.datn.dto.HoaDonChiTietDTO;
import com.example.datn.dto.HoaDonChiTietSanPhamDTO;
import com.example.datn.dto.HoaDonChiTietView;
import com.example.datn.entity.HoaDon;
import com.example.datn.entity.HoaDonChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {
    List<HoaDonChiTiet> findByHoaDon(HoaDon hoaDon);

    List<HoaDonChiTiet> findAllByHoaDon_Id(Integer hoaDonId);

    @Query("""
    SELECT hdct
    FROM HoaDonChiTiet hdct
    WHERE hdct.hoaDon.id = :idHoaDon
""")
    List<HoaDonChiTiet> findChiTietHoaDon(@Param("idHoaDon") Integer idHoaDon);

    @Query("SELECT COALESCE(SUM(hdct.soLuong), 0) " +
            "FROM HoaDonChiTiet hdct " +
            "WHERE hdct.sanPhamChiTiet.id = :sanPhamChiTietId " +
            "AND hdct.hoaDon.tenKhachHang IS NULL") // <<< THAY ĐỔI Ở ĐÂY
    Integer getSoLuongDangCho(@Param("sanPhamChiTietId") Integer sanPhamChiTietId);

    @Query(value = """
  SELECT hdct.id_san_pham_chi_tiet
FROM hoa_don_chi_tiet hdct
JOIN hoa_don hd ON hdct.id_hoa_don = hd.id
GROUP BY hdct.id_san_pham_chi_tiet
ORDER BY SUM(hdct.so_luong) DESC, MAX(hd.ngay_tao) DESC
""",nativeQuery = true)
    Page<Integer> findBestSellingProductIdsAllTime(Pageable pageable);


    // Trả về id sản phẩm cùng tổng số lượng bán, sắp xếp giảm dần. Lấy top N sản phẩm bán chạy nhất.
    @Query("SELECT ctsp.sanPham.id, SUM(hdct.soLuong) " +
            "FROM HoaDonChiTiet hdct " +
            "JOIN hdct.sanPhamChiTiet ctsp " +
            "GROUP BY ctsp.sanPham.id " +
            "ORDER BY SUM(hdct.soLuong) DESC")
    List<Object[]> findBestSellingProductIds();

    @Query("SELECT COALESCE(SUM(hdct.soLuong),0) FROM HoaDonChiTiet hdct " +
            "WHERE hdct.sanPhamChiTiet.sanPham.id = :sanPhamId AND hdct.trangThai = true")
    Integer countSoldBySanPhamId(Integer sanPhamId);
}
