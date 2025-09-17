package com.example.datn.service;

import com.example.datn.vo.clientVO.HomeProductVO;
import com.example.datn.vo.hoaDonVO.HomeProductHinhAnhVO;

import java.util.List;

public interface HomeService {
    List<HomeProductHinhAnhVO> getBestSellingProducts(int limit);
}
