package com.example.datn.service.impl;

import com.example.datn.dto.SanPhamOutletDTO;
import com.example.datn.entity.*;
import com.example.datn.repository.*;
import com.example.datn.service.SanPhamOutletService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SanPhamOutletServiceImpl implements SanPhamOutletService {

    @Autowired
    private ChiTietDotGiamGiaRepository chiTietDotGiamGiaRepository;
    @Autowired
    private HinhAnhRepository hinhAnhRepository;

    @Override
    public Page<SanPhamOutletDTO> getOutletProducts(int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "id"));

        // Lọc outlet: chỉ lấy ChiTietDotGiamGia có DotGiamGia trạng thái = 1 (đang áp dụng)
        Page<ChiTietDotGiamGia> outletPage = chiTietDotGiamGiaRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<ChiTietDotGiamGia, DotGiamGia> dotGiamGiaJoin = root.join("dotGiamGia", JoinType.INNER);
            predicates.add(cb.equal(dotGiamGiaJoin.get("trangThai"), 1));
            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        // Map ra DTO
        List<SanPhamOutletDTO> voList = outletPage.getContent().stream().map(ct -> {
            ChiTietSanPham ctsp = ct.getChiTietSanPham();
            SanPham sp = ctsp.getSanPham();

            SanPhamOutletDTO dto = new SanPhamOutletDTO();
            dto.setId(ctsp.getId());
            dto.setTenSanPham(sp.getTenSanPham());
            dto.setMaSanPham(sp.getMaSanPham());
            dto.setTenThuongHieu(ctsp.getThuongHieu() != null ? ctsp.getThuongHieu().getTenThuongHieu() : "");
            dto.setTenDanhMuc(sp.getDanhMuc() != null ? sp.getDanhMuc().getTenDanhMuc() : "");
            dto.setTenMauSac(ctsp.getMauSac() != null ? ctsp.getMauSac().getTenMauSac() : "");
            dto.setMaMau(ctsp.getMauSac() != null ? ctsp.getMauSac().getMaMau() : "");
            dto.setTenKichThuoc(ctsp.getKichThuoc() != null ? ctsp.getKichThuoc().getTenKichCo() : "");
            dto.setTenChatLieu(ctsp.getChatLieu() != null ? ctsp.getChatLieu().getTenChatLieu() : "");
            // Ảnh đại diện (ưu tiên ảnh mặc định, fallback ảnh đầu tiên)
            String imageUrl = "";
            List<HinhAnh> imgList = hinhAnhRepository.findBySpctHinhAnhs_ChiTietSanPham_Id(ctsp.getId());
            if (!imgList.isEmpty()) {
                Optional<HinhAnh> defaultImg = imgList.stream()
                        .filter(i -> i.getAnhMacDinh() != null && i.getAnhMacDinh() == 1).findFirst();
                imageUrl = defaultImg.map(HinhAnh::getDuongDanAnh).orElse(imgList.get(0).getDuongDanAnh());
            }
            dto.setImageUrl(imageUrl);
            dto.setGiaTruocKhiGiam(ct.getGiaTruocKhiGiam());
            dto.setGiaSauKhiGiam(ct.getGiaSauKhiGiam());
            dto.setPhanTramGiamGia(ct.getDotGiamGia().getPhanTramGiamGia());
            dto.setMoTa(ctsp.getMoTa());
            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(voList, pageable, outletPage.getTotalElements());
    }
}