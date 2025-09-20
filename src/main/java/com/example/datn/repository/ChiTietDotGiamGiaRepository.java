package com.example.datn.repository;

import com.example.datn.entity.ChiTietDotGiamGia;
import com.example.datn.entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ChiTietDotGiamGiaRepository extends JpaRepository<ChiTietDotGiamGia, Integer>, JpaSpecificationExecutor<ChiTietDotGiamGia> {

    // Lấy danh sách chi tiết theo id đợt giảm giá
    List<ChiTietDotGiamGia> findByDotGiamGiaId(Integer idDotGiamGia);

    // Tìm 1 bản ghi chi tiết theo id đợt giảm giá và id sản phẩm chi tiết
    Optional<ChiTietDotGiamGia> findByDotGiamGiaIdAndChiTietSanPhamId(Integer idDotGiamGia, Integer idSanPhamChiTiet);

    // Xóa toàn bộ chi tiết thuộc về đợt giảm giá
    void deleteByDotGiamGiaId(Integer idDotGiamGia);

    @Query("""
    SELECT p.dotGiamGia FROM ChiTietDotGiamGia p
    WHERE
        p.chiTietSanPham.id = :idctsp
        AND p.dotGiamGia.trangThai = 1
""")
    List<DotGiamGia> getDotGiamGiaByIdChiTietSanPham(@Param("idctsp") int idChiTietSanPham);

    List<ChiTietDotGiamGia> findByChiTietSanPhamId(Integer chiTietSanPhamId);


    @Query("SELECT ctdgg FROM ChiTietDotGiamGia ctdgg " +
            "JOIN FETCH ctdgg.dotGiamGia dgg " +
            "JOIN FETCH ctdgg.chiTietSanPham " +
            "WHERE ctdgg.chiTietSanPham.id IN :productIds " +
            "AND dgg.trangThai = 1 "
          )
    List<ChiTietDotGiamGia> findAllActiveDiscountsForProducts(List<Integer> productIds);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChiTietDotGiamGia c " +
            "WHERE c.chiTietSanPham.id = :idCtsp " +
            "AND c.dotGiamGia.id = :idDGG")
    void deleteChiTietDotGiamGiaBy(@Param("idCtsp") Integer chiTietSanPhamId,
                                   @Param("idDGG") Integer dotGiamGiaId);

    List<ChiTietDotGiamGia> findChiTietDotGiamGiasByDotGiamGiaId(Integer idDotGiamGia);

    //List<ChiTietDotGiamGia> findFirstByChiTietSanPhamIdAndTrangThai(List<Integer> chiTietSanPhamIds, Integer trangThai);

    List<ChiTietDotGiamGia> findByChiTietSanPhamIdInAndTrangThai(Collection<Integer> chiTietSanPhamIds, Integer trangThai);
}