package com.example.datn.controller;

import com.example.datn.dto.SanPhamOutletDTO;
import com.example.datn.service.SanPhamOutletService;
import com.example.datn.vo.clientVO.ShopProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outlet")
@RequiredArgsConstructor
public class SanPhamOutletController {

    private final SanPhamOutletService outletService;

    @GetMapping("/products")
    public Page<SanPhamOutletDTO> getOutletProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        return outletService.getOutletProducts(page, pageSize);
    }
    @GetMapping("/products/{id}/related")
    public ResponseEntity<List<ShopProductVO>> getRelatedProducts(
            @PathVariable("id") Integer productId,
            @RequestParam(defaultValue = "5") int limit) {

        List<ShopProductVO> relatedProducts = outletService.findRelatedProducts(productId, limit);
        return ResponseEntity.ok(relatedProducts);
    }

}