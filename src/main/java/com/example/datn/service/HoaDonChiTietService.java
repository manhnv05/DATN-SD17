package com.example.datn.service;

import com.example.datn.dto.HoaDonChiTietDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HoaDonChiTietService {
    public List<HoaDonChiTietDTO> getHoaDonChiTiet(String maHoaDon);

}
