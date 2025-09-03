package com.example.datn.controller;

import com.example.datn.service.ShopService;
import com.example.datn.vo.clientVO.ShopProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping("/products")
    public Page<ShopProductVO> getShopProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer priceMin,
            @RequestParam(required = false) Integer priceMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int pageSize
    ) {
        return shopService.getShopProducts(keyword, color, size, brand, category, priceMin, priceMax, page, pageSize);
    }
    @GetMapping("/max-price")
    public ResponseEntity<Double> getMaxPrice() {
        return ResponseEntity.ok(shopService.getMaxProductPrice());
    }
}
