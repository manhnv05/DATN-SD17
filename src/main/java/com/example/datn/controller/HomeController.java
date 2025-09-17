package com.example.datn.controller;

import com.example.datn.service.HomeService;
import com.example.datn.vo.clientVO.HomeProductVO;
import com.example.datn.vo.hoaDonVO.HomeProductHinhAnhVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @GetMapping("/best-selling")
    public List<HomeProductHinhAnhVO> getBestSellingProducts(@RequestParam(defaultValue = "8") int limit) {
        return homeService.getBestSellingProducts(limit);
    }
}