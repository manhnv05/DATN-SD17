package com.example.datn.service;

import com.example.datn.dto.SanPhamOutletDTO;
import com.example.datn.vo.clientVO.ShopProductVO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SanPhamOutletService {
    Page<SanPhamOutletDTO> getOutletProducts(
            int page,
            int pageSize
    );
    List<ShopProductVO> findRelatedProducts(Integer productId, int limit);

}