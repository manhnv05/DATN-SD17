package com.example.datn.service.impl;

import com.example.datn.dto.*;
import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.entity.HoaDon;
import com.example.datn.entity.HoaDonChiTiet;
import com.example.datn.repository.*;
import com.example.datn.service.ThongKeService;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import com.example.datn.enums.TrangThai;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ThongKeServiceImpl implements ThongKeService {
    @Autowired
    private ThongKeRepository thongKeRepository;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private ThongKeSanPhamRepository thongKeSanPhamRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Override
    public Map<String, ThongKeDTO> getThongKe(LocalDateTime bd, LocalDateTime kt) {
        Map<String, ThongKeDTO> thongKeDTOMap = new HashMap<>();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay(); // 00:00:00
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX); // 23:59:59.999999999

        List<HoaDon> hoaDons = thongKeRepository.getThongKeHomNay(startOfDay, endOfDay);
        List<HoaDon> hoaDonsCuaTuanNay = thongKeRepository.getThongKeTuanNay();
        List<HoaDon> hoaDonsCuaThangNay = thongKeRepository.getThongKeThangNay();
        List<HoaDon> hoaDonsCuaNamNay = thongKeRepository.getThongKeNamNay();
        ThongKeVoSearch thongKeVoSearch = new ThongKeVoSearch();
        thongKeVoSearch.setTuNgay(bd);
        thongKeVoSearch.setDenNgay(kt);
        List<HoaDon> hoaDonsCuaKhoangTG = thongKeRepository.getAllByQuery(thongKeVoSearch);
        thongKeDTOMap.put("homNay", getThongKeByHoaDons(hoaDons));
        thongKeDTOMap.put("tuanNay", getThongKeByHoaDons(hoaDonsCuaTuanNay));
        thongKeDTOMap.put("thangNay", getThongKeByHoaDons(hoaDonsCuaThangNay));
        thongKeDTOMap.put("namNay", getThongKeByHoaDons(hoaDonsCuaNamNay));
        thongKeDTOMap.put("tuyChinh", getThongKeByHoaDons(hoaDonsCuaKhoangTG));
        return thongKeDTOMap;
    }

    @Override
    public Page<ThongKeSPBanChayDTO> getThongKeSpBanChayByQuery(ThongKeVoSearch thongKeVoSearch, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (thongKeVoSearch.getBoLocNgayTuanThangNam() == 0){
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay(); // 00:00:00
            LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
            List<HoaDonChiTiet> hoaDoncts = thongKeSanPhamRepository.getThongKeHomNay(startOfDay, endOfDay);
            return getSanPhamCt(hoaDoncts, pageable);
        }
        else if(thongKeVoSearch.getBoLocNgayTuanThangNam() == 1){
            List<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getThongKeTuanNay();
            return getSanPhamCt(hoaDons, pageable);
        }
        else if(thongKeVoSearch.getBoLocNgayTuanThangNam() == 2){
            List<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getThongKeThangNay();
            return getSanPhamCt(hoaDons, pageable);
        }
        else if(thongKeVoSearch.getBoLocNgayTuanThangNam() == 3){
            List<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getThongKeNamNay();
            return getSanPhamCt(hoaDons, pageable);
        }
        else {
            List<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getAllByQuery(thongKeVoSearch);
            return getSanPhamCt(hoaDons, pageable);
        }
    }

    @Override
    public Page<ChiTietSanPhamSapHetDTO> getAllChiTietSanPhamSapHetHan(int page, int size, Integer slQuery) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChiTietSanPham> chiTietSanPhamPage = chiTietSanPhamRepository.getChiTietSanPhamSapHetHan(pageable, slQuery);
        return chiTietSanPhamPage.map(chiTietSanPham -> {
            ChiTietSanPhamSapHetDTO chiTietSanPhamDTO = new ChiTietSanPhamSapHetDTO();
            chiTietSanPhamDTO.setTenSanPham(chiTietSanPham.getSanPham().getTenSanPham());
            chiTietSanPhamDTO.setSoLuong(chiTietSanPham.getSoLuong());
            chiTietSanPhamDTO.setGiaTien(chiTietSanPham.getGia());
            chiTietSanPhamDTO.setMaspCt(chiTietSanPham.getMaSanPhamChiTiet());
            return chiTietSanPhamDTO;
        });
    }

    @Override
    public ThongKeBieuDoDTO getBieuDo(int check, LocalDateTime bd, LocalDateTime kt) {
        if(check == 1){
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay(); // 00:00:00
            LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX); // 23:59:59.999999999

            List<HoaDon> hoaDon = thongKeRepository.getThongKeHomNay(startOfDay, endOfDay);
            return getBieuDoAll(hoaDon);
        }
        else if(check == 2){
            List<HoaDon> hoaDon = thongKeRepository.getThongKeTuanNay();
            return getBieuDoAll(hoaDon);
        }
        else if(check == 3){
            List<HoaDon> hoaDons = thongKeRepository.getThongKeThangNay();
            return getBieuDoAll(hoaDons);
        }
        else if (check == 4){
            List<HoaDon> hoaDon = thongKeRepository.getThongKeNamNay();
            return getBieuDoAll(hoaDon);
        }
        else {
            ThongKeVoSearch thongKeVoSearch = new ThongKeVoSearch();
            thongKeVoSearch.setTuNgay(bd);
            thongKeVoSearch.setDenNgay(kt);
            List<HoaDon> hoaDon = thongKeRepository.getAllByQuery(thongKeVoSearch);
            return getBieuDoAll(hoaDon);
        }
    }

    @Override
    public ThongKeBieuDoDTO getBieuDoByQuery(ThongKeVoSearch thongKeVoSearch) {
        List<HoaDon> hoaDons = thongKeRepository.getAllByQuery(thongKeVoSearch);
        return getBieuDoAll(hoaDons);
    }

    public ThongKeBieuDoDTO getBieuDoAll(List<HoaDon> hoaDon) {
        int slDaHuy = 0;
        int slChoXacNhan = 0;
        int slChoGiaoHang = 0;
        int slDangVanChuyen = 0;
        int slHoanThanh = 0;

        ThongKeBieuDoDTO thongKeBieuDoDTO = new ThongKeBieuDoDTO();
        for (HoaDon hd : hoaDon) {
            if(hd.getTrangThai() == TrangThai.HOAN_THANH){
                slHoanThanh++;
            }
            else if(hd.getTrangThai() == TrangThai.CHO_XAC_NHAN){
                slChoXacNhan++;
            }
            else if(hd.getTrangThai() == TrangThai.CHO_GIAO_HANG){
                slChoGiaoHang++;
            }
            else if(hd.getTrangThai() == TrangThai.DANG_VAN_CHUYEN){
                slDangVanChuyen++;
            }
            else if(hd.getTrangThai() == TrangThai.HUY){
                slDaHuy++;
            }
        }
        thongKeBieuDoDTO.setHoanThanh(slHoanThanh);
        thongKeBieuDoDTO.setChoXacNhan(slChoXacNhan);
        thongKeBieuDoDTO.setChoGiaoHang(slChoGiaoHang);
        thongKeBieuDoDTO.setDangVanChuyen(slDangVanChuyen);
        thongKeBieuDoDTO.setDaHuy(slDaHuy);
        return thongKeBieuDoDTO;
    }

    public Page<ThongKeSPBanChayDTO> getSanPhamCt(List<HoaDonChiTiet> hoaDonChiTietList,Pageable pageable) {
        Map<Integer, ChiTietSanPham> mapChiTietSanPham = new HashMap<>();

        for (HoaDonChiTiet hdct : hoaDonChiTietList) {
            if (hdct.getHoaDon().getTrangThai() == TrangThai.HOAN_THANH) {
                ChiTietSanPham chiTietSanPham = hdct.getSanPhamChiTiet();
                Integer id = chiTietSanPham.getId();

                if (mapChiTietSanPham.containsKey(id)) {
                    ChiTietSanPham existing = mapChiTietSanPham.get(id);
                    existing.setSoLuong(existing.getSoLuong() + hdct.getSoLuong());
                } else {
                    ChiTietSanPham newCtsp = new ChiTietSanPham();
                    newCtsp.setId(chiTietSanPham.getId());
                    newCtsp.setSanPham(chiTietSanPham.getSanPham());
                    newCtsp.setKichThuoc(chiTietSanPham.getKichThuoc());
                    newCtsp.setGia(chiTietSanPham.getGia());
                    newCtsp.setSoLuong(hdct.getSoLuong());
                    mapChiTietSanPham.put(id, newCtsp);
                }
            }
        }

        List<ChiTietSanPham> mergedList = new ArrayList<>(mapChiTietSanPham.values());
        mergedList.sort((a, b) -> Integer.compare(b.getSoLuong(), a.getSoLuong()));

        // Phân trang thủ công từ mergedList
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), mergedList.size());

// Sửa lỗi phân trang
        if (start >= mergedList.size() || start > end) {
            return new PageImpl<>(new ArrayList<>(), pageable, mergedList.size());
        }

        List<ThongKeSPBanChayDTO> pagedList = mergedList.subList(start, end).stream()
                .map(ctsp -> {
                    ThongKeSPBanChayDTO dto = new ThongKeSPBanChayDTO();
                    dto.setTenSp(ctsp.getSanPham().getTenSanPham());
                    dto.setGiaTien(ctsp.getGia());
                    dto.setKichCo(ctsp.getKichThuoc().getTenKichCo());
                    dto.setSoLuong(ctsp.getSoLuong());
                    return dto;
                })
                .toList();

        return new PageImpl<>(pagedList, pageable, mergedList.size());
    }


    public ThongKeDTO getThongKeByHoaDons(List<HoaDon> hoaDons) {
        BigDecimal totalRevenue = BigDecimal.ZERO;
        int totalProducts = 0;
        int completedOrders = 0;
        int cancelledOrders = 0;
        for (HoaDon hd : hoaDons) {
            if (hd.getTrangThai() == TrangThai.HOAN_THANH) {
                totalRevenue = totalRevenue.add(hd.getTongTien() != null ? BigDecimal.valueOf(hd.getTongTien()) : BigDecimal.ZERO);
                List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietRepository.findAllByHoaDon_Id(hd.getId());
                for (HoaDonChiTiet item : hoaDonChiTietList) {
                    totalProducts += item.getSoLuong();
                }
                completedOrders++;
            }
            else if (hd.getTrangThai() == TrangThai.HUY) {
                cancelledOrders++;
            }
        }
        return new ThongKeDTO(totalRevenue, totalProducts, cancelledOrders, completedOrders);
    }
}
