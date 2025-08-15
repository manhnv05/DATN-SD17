package com.example.datn.vo.clientVO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeProductVO {
    private Integer id;
    private String name;
    private String code;
    private String imageUrl;
    private Integer price;
    private Integer salePrice;
    private String discountPercent;
    private Double rating;
    // Thêm 2 trường cho khoảng giá
    private Integer priceMin;
    private Integer priceMax;
}