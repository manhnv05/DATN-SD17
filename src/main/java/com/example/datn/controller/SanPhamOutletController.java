package com.example.datn.controller;

import com.example.datn.dto.SanPhamOutletDTO;
import com.example.datn.service.SanPhamOutletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

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
}