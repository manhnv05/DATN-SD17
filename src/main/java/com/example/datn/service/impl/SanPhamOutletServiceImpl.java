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

        // Lấy tất cả ChiTietDotGiamGia có DotGiamGia trạng thái = 1 (đang áp dụng giảm giá)
        Page<ChiTietDotGiamGia> outletPage = chiTietDotGiamGiaRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<ChiTietDotGiamGia, DotGiamGia> dotGiamGiaJoin = root.join("dotGiamGia", JoinType.INNER);
            predicates.add(cb.equal(dotGiamGiaJoin.get("trangThai"), 1));
            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        // Lấy ra danh sách id sản phẩm cha (SanPham) chứa ít nhất 1 ChiTietSanPham đang có giảm giá
        Set<Integer> sanPhamIds = outletPage.getContent().stream()
                .map(ct -> {
                    ChiTietSanPham ctsp = ct.getChiTietSanPham();
                    return ctsp != null && ctsp.getSanPham() != null ? ctsp.getSanPham().getId() : null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Map ra danh sách sản phẩm cha, mỗi sản phẩm chỉ lấy 1 sản phẩm chi tiết outlet đại diện (ưu tiên giảm nhiều nhất)
        List<SanPhamOutletDTO> voList = new ArrayList<>();
        for (Integer spId : sanPhamIds) {
            // Lấy tất cả ChiTietDotGiamGia của sản phẩm cha này với trạng thái giảm giá 1
            List<ChiTietDotGiamGia> outletOfSp = outletPage.getContent().stream()
                    .filter(ct -> {
                        ChiTietSanPham ctsp = ct.getChiTietSanPham();
                        return ctsp != null && ctsp.getSanPham() != null && ctsp.getSanPham().getId().equals(spId);
                    })
                    .collect(Collectors.toList());

            // Lấy chi tiết outlet có phần trăm giảm giá lớn nhất (nếu bằng nhau lấy bất kỳ)
            ChiTietDotGiamGia maxDiscount = outletOfSp.stream()
                    .max(Comparator.comparingInt(ct ->
                            ct.getDotGiamGia() != null && ct.getDotGiamGia().getPhanTramGiamGia() != null
                                    ? ct.getDotGiamGia().getPhanTramGiamGia()
                                    : 0
                    )).orElse(null);

            if (maxDiscount != null) {
                ChiTietSanPham ctsp = maxDiscount.getChiTietSanPham();
                if (ctsp == null) continue;
                SanPham sp = ctsp.getSanPham();
                if (sp == null) continue;

                SanPhamOutletDTO dto = new SanPhamOutletDTO();
                dto.setId(sp.getId());
                dto.setIdChiTietSanPham(ctsp.getId());
                dto.setTenSanPham(sp.getTenSanPham() != null ? sp.getTenSanPham() : "");
                dto.setMaSanPham(sp.getMaSanPham() != null ? sp.getMaSanPham() : "");
                dto.setTenThuongHieu(
                        ctsp.getThuongHieu() != null && ctsp.getThuongHieu().getTenThuongHieu() != null
                                ? ctsp.getThuongHieu().getTenThuongHieu()
                                : ""
                );
                dto.setTenDanhMuc(
                        sp.getDanhMuc() != null && sp.getDanhMuc().getTenDanhMuc() != null
                                ? sp.getDanhMuc().getTenDanhMuc()
                                : ""
                );
                dto.setTenMauSac(
                        ctsp.getMauSac() != null && ctsp.getMauSac().getTenMauSac() != null
                                ? ctsp.getMauSac().getTenMauSac()
                                : ""
                );
                dto.setMaMau(
                        ctsp.getMauSac() != null && ctsp.getMauSac().getMaMau() != null
                                ? ctsp.getMauSac().getMaMau()
                                : ""
                );
                dto.setTenKichThuoc(
                        ctsp.getKichThuoc() != null && ctsp.getKichThuoc().getTenKichCo() != null
                                ? ctsp.getKichThuoc().getTenKichCo()
                                : ""
                );
                dto.setTenChatLieu(
                        ctsp.getChatLieu() != null && ctsp.getChatLieu().getTenChatLieu() != null
                                ? ctsp.getChatLieu().getTenChatLieu()
                                : ""
                );
                // Ảnh đại diện (ưu tiên ảnh mặc định, fallback ảnh đầu tiên)
                String imageUrl = "";
                try {
                    List<HinhAnh> imgList = hinhAnhRepository.findBySpctHinhAnhs_ChiTietSanPham_Id(ctsp.getId());
                    if (!imgList.isEmpty()) {
                        Optional<HinhAnh> defaultImg = imgList.stream()
                                .filter(i -> i.getAnhMacDinh() != null && i.getAnhMacDinh() == 1).findFirst();
                        imageUrl = defaultImg.map(HinhAnh::getDuongDanAnh).orElse(imgList.get(0).getDuongDanAnh());
                    }
                } catch (Exception ex) {
                    imageUrl = "";
                }
                dto.setImageUrl(imageUrl);
                dto.setGiaTruocKhiGiam(maxDiscount.getGiaTruocKhiGiam());
                dto.setGiaSauKhiGiam(maxDiscount.getGiaSauKhiGiam());
                dto.setPhanTramGiamGia(
                        maxDiscount.getDotGiamGia() != null && maxDiscount.getDotGiamGia().getPhanTramGiamGia() != null
                                ? maxDiscount.getDotGiamGia().getPhanTramGiamGia()
                                : 0
                );
                dto.setMoTa(ctsp.getMoTa() != null ? ctsp.getMoTa() : "");
                voList.add(dto);
            }
        }

        // Sort lại (nếu muốn), phân trang lại vì tổng số sp cha có thể ít hơn tổng số ChiTietDotGiamGia
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), voList.size());
        List<SanPhamOutletDTO> pagedList = voList.subList(Math.min(start, voList.size()), Math.min(end, voList.size()));

        return new PageImpl<>(pagedList, pageable, voList.size());
    }
}