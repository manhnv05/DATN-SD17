package com.example.datn.service;

import com.example.datn.dto.TraCuuHoaDonDTO;
import org.springframework.stereotype.Service;

@Service
public interface TraCuuHoaDonService {
    public TraCuuHoaDonDTO traCuuHoaDon(String maHoaDon);

}
