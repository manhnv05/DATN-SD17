package com.example.datn.controller;

import com.example.datn.dto.ProductDetailDTO;
import com.example.datn.service.ProductDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ProductDetailController {

    private final ProductDetailService productDetailService;

    @GetMapping("/detail/{id}")
    public ProductDetailDTO getDetail(@PathVariable Integer id) {
        return productDetailService.getProductDetail(id);
    }
}
