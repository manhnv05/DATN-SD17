package com.example.datn.service;

import com.example.datn.dto.SanPhamOutletDTO;
import com.example.datn.vo.clientVO.ShopProductVO;
import com.example.datn.vo.hoaDonVO.SanPhamOutletHinhAnhDTO;
import com.example.datn.vo.hoaDonVO.ShopProductHinhAnhVO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SanPhamOutletService {
    Page<SanPhamOutletHinhAnhDTO> getOutletProducts(
            int page,
            int pageSize
    );
    List<ShopProductHinhAnhVO> findRelatedProducts(Integer productId, int limit);

}