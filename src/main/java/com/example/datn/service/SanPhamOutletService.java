package com.example.datn.service;

import com.example.datn.dto.SanPhamOutletDTO;
import org.springframework.data.domain.Page;

public interface SanPhamOutletService {
    Page<SanPhamOutletDTO> getOutletProducts(
            int page,
            int pageSize
    );
}