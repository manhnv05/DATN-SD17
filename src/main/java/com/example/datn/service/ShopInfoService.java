package com.example.datn.service;

import com.example.datn.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class ShopInfoService {

    @Value("${shopinfo.path:./text/shopinfo.txt}")
    private String shopInfoPath;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public String getShopInfo() {
        StringBuilder sb = new StringBuilder();

        // 1. Đọc thông tin shop từ file text
        try {
            String infoText = Files.readString(Paths.get(shopInfoPath), StandardCharsets.UTF_8);
            if (infoText != null && !infoText.trim().isEmpty()) {
                sb.append(infoText.trim()).append("\n");
            }
        } catch (Exception e) {
            // Nếu lỗi đọc file, bỏ qua phần này, sẽ thêm thông tin tổng hợp dưới
        }

        // 2. Lấy các thông tin đặc trưng từ sản phẩm (nếu có dữ liệu)
        try {
            List<String> brands = sanPhamRepository.findDistinctThuongHieu();
            if (brands != null && !brands.isEmpty()) {
                sb.append("Thương hiệu đang bán: ").append(String.join(", ", brands)).append("\n");
            }
            List<String> categories = sanPhamRepository.findDistinctDanhMuc();
            if (categories != null && !categories.isEmpty()) {
                sb.append("Danh mục sản phẩm: ").append(String.join(", ", categories)).append("\n");
            }
            List<String> materials = sanPhamRepository.findDistinctChatLieu();
            if (materials != null && !materials.isEmpty()) {
                sb.append("Chất liệu phổ biến: ").append(String.join(", ", materials)).append("\n");
            }
            List<String> collars = sanPhamRepository.findDistinctCoAo();
            if (collars != null && !collars.isEmpty()) {
                sb.append("Các loại cổ áo: ").append(String.join(", ", collars)).append("\n");
            }
            List<String> sleeves = sanPhamRepository.findDistinctTayAo();
            if (sleeves != null && !sleeves.isEmpty()) {
                sb.append("Các loại tay áo: ").append(String.join(", ", sleeves)).append("\n");
            }
            List<String> colors = sanPhamRepository.findDistinctMauSac();
            if (colors != null && !colors.isEmpty()) {
                sb.append("Màu sắc đang có: ").append(String.join(", ", colors)).append("\n");
            }
            List<String> sizes = sanPhamRepository.findDistinctKichThuoc();
            if (sizes != null && !sizes.isEmpty()) {
                sb.append("Các size bán: ").append(String.join(", ", sizes)).append("\n");
            }
        } catch (Exception e) {
            // Nếu lỗi thì bỏ qua phần đặc trưng
        }

        // 3. Nếu không có gì thì trả về thông báo mặc định
        if (sb.length() == 0) {
            return "Thông tin shop đang cập nhật.";
        }

        return sb.toString().trim();
    }
}