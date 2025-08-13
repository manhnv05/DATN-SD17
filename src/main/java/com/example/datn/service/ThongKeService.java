package com.example.datn.service;

import com.example.datn.dto.*;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.Map;

public interface ThongKeService {
    Map<String, ThongKeDTO> getThongKe(LocalDateTime bd, LocalDateTime kt);

    Page<ThongKeSPBanChayDTO> getThongKeSpBanChayByQuery(ThongKeVoSearch thongKeVoSearch, int page, int size);

    Page<ChiTietSanPhamSapHetDTO> getAllChiTietSanPhamSapHetHan(int page, int size, Integer slQuery);

    ThongKeBieuDoDTO getBieuDo(int check,LocalDateTime bd, LocalDateTime kt);

    ThongKeBieuDoDTO getBieuDoByQuery(ThongKeVoSearch thongKeVoSearch);

}
