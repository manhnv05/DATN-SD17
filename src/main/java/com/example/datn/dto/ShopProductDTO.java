package com.example.datn.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShopProductDTO {
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
