package com.example.datn.service;

import com.example.datn.vo.clientVO.ShopProductVO;
import com.example.datn.vo.hoaDonVO.ShopProductHinhAnhVO;
import org.springframework.data.domain.Page;

public interface ShopService {
    Page<ShopProductHinhAnhVO> getShopProducts(
            String keyword,
            String color,
            String size,
            String brand,
            String category,
            Integer priceMin,
            Integer priceMax,
            int page,
            int pageSize
    );
    public Double getMaxProductPrice();
}
