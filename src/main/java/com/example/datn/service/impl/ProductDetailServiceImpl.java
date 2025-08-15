package com.example.datn.service.impl;

import com.example.datn.dto.MauSacDTO;
import com.example.datn.dto.ProductDetailDTO;
import com.example.datn.dto.VoucherDTO;
import com.example.datn.entity.*;
import com.example.datn.repository.*;
import com.example.datn.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductDetailServiceImpl implements ProductDetailService {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;
    @Autowired
    private HinhAnhRepository hinhAnhRepository;
    @Autowired
    private ChiTietDotGiamGiaRepository chiTietDotGiamGiaRepository;

    @Override
    public ProductDetailDTO getProductDetail(Integer id) {
        // id là id của Sản phẩm (SanPham)
        SanPham sp = sanPhamRepository.findById(id).orElse(null);
        if (sp == null) return null;

        // Lấy toàn bộ list chi tiết sản phẩm (variants)
        List<ChiTietSanPham> ctspList = chiTietSanPhamRepository.findBySanPhamId(sp.getId());
        if (ctspList.isEmpty()) return null;

        // Lấy variant đầu tiên làm mặc định (bạn có thể chọn theo logic khác)
        ChiTietSanPham ctsp = ctspList.get(0);

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setId(sp.getId());
        dto.setTenSanPham(sp.getTenSanPham());
        dto.setMaSanPham(sp.getMaSanPham());
        dto.setMoTa(ctsp.getMoTa());
        dto.setGia(ctsp.getGia());

        // Lấy khuyến mãi outlet nếu có (của variant đầu tiên)
        List<ChiTietDotGiamGia> dggs = chiTietDotGiamGiaRepository.findByChiTietSanPhamId(ctsp.getId());
        Optional<ChiTietDotGiamGia> outlet = dggs.stream()
                .filter(d -> d.getDotGiamGia().getTrangThai() != null && d.getDotGiamGia().getTrangThai() == 1)
                .findFirst();
        if (outlet.isPresent()) {
            dto.setGiaTruocKhiGiam(outlet.get().getGiaTruocKhiGiam());
            dto.setGiaSauKhiGiam(outlet.get().getGiaSauKhiGiam());
            dto.setPhanTramGiamGia(outlet.get().getDotGiamGia().getPhanTramGiamGia());
        }

        // Lấy toàn bộ ảnh của sản phẩm (gộp ảnh các variant, không trùng lặp)
        List<String> imageUrls = ctspList.stream()
                .flatMap(variant -> hinhAnhRepository.findBySpctHinhAnhs_ChiTietSanPham_Id(variant.getId()).stream())
                .map(HinhAnh::getDuongDanAnh)
                .distinct()
                .collect(Collectors.toList());
        dto.setImages(imageUrls);

        // Colors (của tất cả variant)
        List<MauSacDTO> colors = ctspList.stream().map(e -> {
            MauSacDTO c = new MauSacDTO();
            c.setTenMauSac(e.getMauSac() != null ? e.getMauSac().getTenMauSac() : "");
            c.setMaMau(e.getMauSac() != null ? e.getMauSac().getMaMau() : "");
            return c;
        }).distinct().collect(Collectors.toList());
        dto.setColors(colors);

        // Sizes
        List<String> sizes = ctspList.stream()
                .map(e -> e.getKichThuoc() != null ? e.getKichThuoc().getTenKichCo() : "")
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.toList());
        dto.setSizes(sizes);

        // Thông tin khác
        dto.setTenDanhMuc(sp.getDanhMuc() != null ? sp.getDanhMuc().getTenDanhMuc() : "");
        dto.setTenThuongHieu(ctsp.getThuongHieu() != null ? ctsp.getThuongHieu().getTenThuongHieu() : "");
        dto.setRating(4.5 + Math.random() * 0.5); // random cho đẹp
        dto.setSold(50 + (int) (Math.random() * 100));
        dto.setShipping("Miễn phí vận chuyển cho đơn hàng từ 500k");
        // Voucher (demo, bạn có thể sửa lấy thật từ DB)
        VoucherDTO voucher = new VoucherDTO();
        voucher.setCode("SALE5OFF");
        voucher.setPercent(5);
        voucher.setMin("399.000");
        voucher.setExpire("Còn 3 ngày");
        dto.setVoucher(voucher);

        return dto;
    }
}