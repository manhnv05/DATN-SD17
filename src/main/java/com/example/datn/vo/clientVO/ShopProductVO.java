package com.example.datn.vo.clientVO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShopProductVO {
    private Integer id;
    private String name;
    private String code;
    private String imageUrl;
    private Integer price;
    private Integer salePrice;
    private String discountPercent;
    private Double rating;
    private Integer priceMin;
    private Integer priceMax;
    private String colorName;
    private String colorCode;
    private String sizeName;
    private String brandName;
    private String categoryName;
}
