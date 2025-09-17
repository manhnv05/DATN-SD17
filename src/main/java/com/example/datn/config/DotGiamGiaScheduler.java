package com.example.datn.config;

import com.example.datn.entity.DotGiamGia;
import com.example.datn.entity.PhieuGiamGia;
import com.example.datn.repository.DotGiamGiaRepository;
import com.example.datn.repository.PhieuGiamGiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DotGiamGiaScheduler {
    @Autowired
    private DotGiamGiaRepository phieuGiamGiaRepository;

    @Scheduled(cron = "0 * * * * ?")
    public void updateExpiredPromotions() {
        LocalDateTime now = LocalDateTime.now();
        List<DotGiamGia> expiredPromotions = phieuGiamGiaRepository.findByNgayKetThucBeforeAndTrangThaiNot(now, 4);
        List<Integer> excludedTrangThai = Arrays.asList(2, 1, 4);
        List<DotGiamGia> expiredPhieuGiamBD = phieuGiamGiaRepository.findByNgayBatDauAfterAndTrangThaiNotIn(now, excludedTrangThai);
        List<DotGiamGia> activePromotions = phieuGiamGiaRepository.findDotGiamGiaByNow(now);

        for (DotGiamGia p : expiredPhieuGiamBD) {
            p.setTrangThai(2);
        }
        for (DotGiamGia phieuGiamGia : expiredPromotions) {
            phieuGiamGia.setTrangThai(4);
        }
        for (DotGiamGia p : activePromotions) {
            p.setTrangThai(1);
        }
        List<DotGiamGia> allToSave = new ArrayList<>();
        allToSave.addAll(expiredPhieuGiamBD);
        allToSave.addAll(activePromotions);
        allToSave.addAll(expiredPromotions);
        phieuGiamGiaRepository.saveAll(allToSave);
    }
}
