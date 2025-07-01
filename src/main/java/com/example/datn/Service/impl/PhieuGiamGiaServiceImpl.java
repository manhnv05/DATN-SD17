package com.example.datn.Service.impl;

import com.example.datn.Config.EmailService;
import com.example.datn.DTO.PhieuGiamGiaDTO;
import com.example.datn.Entity.PhieuGiamGia;
import com.example.datn.Repository.PhieuGiamGiaRepository;
import com.example.datn.Service.PhieuGiamGiaService;
import com.example.datn.VO.PhieuGiamGiaVO;
import com.example.datn.VO.PhieuGiamGiaVOUpdate;
import com.example.datn.VO.PhieuGiamVOSearch;
import com.example.datn.VO.SendMailRequestData;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.PhieuGiamGiaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class PhieuGiamGiaServiceImpl implements PhieuGiamGiaService {

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public Page<PhieuGiamGiaDTO> getAllPhieuGiamGia(int page, int size, PhieuGiamVOSearch search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PhieuGiamGia> phieuGiamGiaPages = phieuGiamGiaRepository.findAllBySearch(search, pageable);
        return phieuGiamGiaPages.map(PhieuGiamGiaMapper.INSTANCE::toResponse);
    }

    @Override
    public PhieuGiamGiaDTO getPhieuGiamGiaById(int id) {
        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PHIEU_GIAM_GIA_NULL));
        return PhieuGiamGiaMapper.INSTANCE.toResponse(phieuGiamGia);
    }

    @Override
    public PhieuGiamGiaDTO createPhieuGiamGia(PhieuGiamGiaVO phieuGiamGiaRequest) {
        PhieuGiamGia phieuGiamGia = PhieuGiamGiaMapper.INSTANCE.toPhieuGiamGia(phieuGiamGiaRequest);
        phieuGiamGiaRepository.save(phieuGiamGia);
        return PhieuGiamGiaMapper.INSTANCE.toResponse(phieuGiamGia);
    }

    @Override
    public PhieuGiamGiaDTO updatePhieuGiamGia(PhieuGiamGiaVOUpdate phieuGiamGiaRequestUpdate) {
        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findById(phieuGiamGiaRequestUpdate.getId()).orElse(null);
        if (phieuGiamGia == null) {
            throw new AppException(ErrorCode.PHIEU_GIAM_GIA_NULL);
        } else {
            PhieuGiamGiaMapper.INSTANCE.updatePhieuGiamGia(phieuGiamGia, phieuGiamGiaRequestUpdate);
            phieuGiamGiaRepository.save(phieuGiamGia);
            return PhieuGiamGiaMapper.INSTANCE.toResponse(phieuGiamGia);
        }
    }

    @Override
    public boolean deletePhieuGiamGia(int id) {
        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findById(id).orElse(null);
        if (phieuGiamGia == null) {
            return false;
        } else {
            phieuGiamGiaRepository.delete(phieuGiamGia);
            return true;
        }
    }

    @Override
    public PhieuGiamGiaDTO updateStatusPhieuGiamGia(int id, int status) {
        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PHIEU_GIAM_GIA_NULL));
        phieuGiamGia.setTrangThai(status);
        phieuGiamGiaRepository.save(phieuGiamGia);
        return PhieuGiamGiaMapper.INSTANCE.toResponse(phieuGiamGia);
    }

    @Override
    public void sendMailToListCustomer(SendMailRequestData sendMailRequestData) {
        Integer idPhieuGiamGia = null;
        if (sendMailRequestData != null && sendMailRequestData.getPhieuGiamGiaVO() != null) {
            idPhieuGiamGia = sendMailRequestData.getPhieuGiamGiaVO().getId();
        }
        if (idPhieuGiamGia == null) {
            throw new AppException(ErrorCode.PHIEU_GIAM_GIA_NULL);
        }

        PhieuGiamGia phieuGiamGia = phieuGiamGiaRepository.findById(idPhieuGiamGia)
                .orElseThrow(() -> new AppException(ErrorCode.PHIEU_GIAM_GIA_NULL));
        String subject = "Bạn nhận được phiếu giảm giá!";
        if (sendMailRequestData.getEmails() != null) {
            for (String email : sendMailRequestData.getEmails()) {
                String body = buildHtmlBody(phieuGiamGia);
                try {
                    emailService.sendEmail(email, subject, body);
                } catch (Exception e) {
                    throw new AppException(ErrorCode.MAIL_ERROR);
                }
            }
        }
    }

    private String buildHtmlBody(PhieuGiamGia phieuGiamGia) {
        String value;
        if (phieuGiamGia.getSoTienGiam() != null && phieuGiamGia.getSoTienGiam().intValue() > 0) {
            value = phieuGiamGia.getSoTienGiam().intValue() + " VNĐ";
        } else if (phieuGiamGia.getPhamTramGiamGia() != null && phieuGiamGia.getPhamTramGiamGia().intValue() > 0) {
            value = phieuGiamGia.getPhamTramGiamGia().intValue() + " %";
        } else {
            value = "Không xác định";
        }

        String maPhieu = phieuGiamGia.getMaPhieuGiamGia() != null ? phieuGiamGia.getMaPhieuGiamGia() : "";
        String ngayBatDau = phieuGiamGia.getNgayBatDau() != null
                ? phieuGiamGia.getNgayBatDau().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "";
        String ngayKetThuc = phieuGiamGia.getNgayKetThuc() != null
                ? phieuGiamGia.getNgayKetThuc().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "";

        return String.format(
                "<html>\n"
                        + "<body>\n"
                        + "<h2 style=\"color:#4CAF50;\">🎁 Phiếu Giảm Giá Đặc Biệt 🎁</h2>\n"
                        + "<p><strong>Mã phiếu:</strong> %s</p>\n"
                        + "<p><strong>Ngày bắt đầu:</strong> %s</p>\n"
                        + "<p><strong>Ngày kết thúc:</strong> %s</p>\n"
                        + "<p><strong>Giá trị giảm:</strong> %s</p>\n"
                        + "<hr/>\n"
                        + "<p>Hãy sử dụng phiếu giảm giá này trước khi hết hạn!</p>\n"
                        + "</body>\n"
                        + "</html>",
                maPhieu,
                ngayBatDau,
                ngayKetThuc,
                value
        );
    }
}