package com.example.datn.vo.hoaDonVO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeProductHinhAnhVO {
    private Integer id;
    private String name;
    private String code;
    private List<String> imageUrl;
    private Integer price;
    private Integer salePrice;
    private String discountPercent;
    private Double rating;
    // Thêm 2 trường cho khoảng giá
    private Integer priceMin;
    private Integer priceMax;
}
