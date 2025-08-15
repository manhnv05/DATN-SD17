package com.example.datn.service;

import com.example.datn.vo.clientVO.HomeProductVO;

import java.util.List;

public interface HomeService {
    List<HomeProductVO> getBestSellingProducts(int limit);
}
