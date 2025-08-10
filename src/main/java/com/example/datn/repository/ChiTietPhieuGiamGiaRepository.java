package com.example.datn.repository;

import com.example.datn.entity.ChiTietPhieuGiamGia;
import com.example.datn.entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ChiTietPhieuGiamGiaRepository extends JpaRepository<ChiTietPhieuGiamGia, Integer>, JpaSpecificationExecutor<ChiTietPhieuGiamGia> {
    @Query("""
    SELECT pddkh.phieuGiamGia FROM ChiTietPhieuGiamGia pddkh
    WHERE
        (:khachHang IS NULL OR :khachHang = pddkh.khachHang.id)
        AND (:phieuGiamGia IS NULL OR :phieuGiamGia = pddkh.phieuGiamGia.id)
        AND (pddkh.phieuGiamGia.trangThai = 1)
    """)
    Page<PhieuGiamGia> queryPhieuGiamGiaKhachHang(
            @Param("khachHang") String khachHang,
            @Param("phieuGiamGia") String phieuGiamGia,
            Pageable pageable
    );
    @Query("""
    SELECT pddkh.phieuGiamGia FROM ChiTietPhieuGiamGia pddkh
    WHERE
        (:khachHang IS NULL OR :khachHang = pddkh.khachHang.id)
        AND (pddkh.phieuGiamGia.trangThai = 1)
    """)
    List<PhieuGiamGia> queryPhieuGiamGiaKhachHangOnline(@Param("khachHang") Integer khachHang);

    @Query("""
    SELECT pddkh FROM ChiTietPhieuGiamGia pddkh
    WHERE
        (:khachHang IS NULL OR :khachHang = pddkh.khachHang.id)
        AND (:phieuGiamGia IS NULL OR :phieuGiamGia = pddkh.phieuGiamGia.id)
    """)
    Page<ChiTietPhieuGiamGia> getChiTietPhieuGiamGias(
            @Param("khachHang") String khachHang,
            @Param("phieuGiamGia") String phieuGiamGia,
            Pageable pageable
    );

    Optional<ChiTietPhieuGiamGia> findByPhieuGiamGia_MaPhieuGiamGiaAndKhachHang_Id(String maPhieuGiamGia, Integer idKhachHang);

    @Modifying
    @Transactional
    @Query("""
        delete from ChiTietPhieuGiamGia pddkh where pddkh.khachHang.id = :idKhachHang and pddkh.phieuGiamGia.id = :idPhieuGiamGia
   """)
    void deletePhieuGiamGiaPhieuGiamGia(@Param("idPhieuGiamGia") Integer idPhieuGiamGia , @Param("idKhachHang") Integer idKhachHang);
}