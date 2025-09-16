package com.example.datn.service;

import com.example.datn.dto.SanPhamDTO;
import com.example.datn.entity.DanhMuc;
import com.example.datn.entity.SanPham;
import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.repository.DanhMucRepository;
import com.example.datn.repository.SanPhamRepository;
import com.example.datn.repository.ChiTietSanPhamRepository;
import com.example.datn.vo.sanPham.SanPhamQueryVO;
import com.example.datn.vo.sanPham.SanPhamUpdateVO;
import com.example.datn.vo.sanPham.SanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private DanhMucRepository danhMucRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    public List<SanPhamDTO> getLatestActive(int limit) {
        List<SanPham> list = sanPhamRepository.findActiveSanPhamOrderByIdDesc();
        return list.stream().limit(limit).map(this::toDTO).collect(Collectors.toList());
    }

    public Integer save(@Valid SanPhamVO vO) {
        SanPham bean = new SanPham();
        bean.setMaSanPham(vO.getMaSanPham());
        bean.setTenSanPham(vO.getTenSanPham());
        bean.setXuatXu(vO.getXuatXu());
        bean.setTrangThai(vO.getTrangThai());
        if (vO.getIdDanhMuc() != null) {
            DanhMuc danhMuc = danhMucRepository.findById(vO.getIdDanhMuc()).orElse(null);
            bean.setDanhMuc(danhMuc);
        }
        bean = sanPhamRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        sanPhamRepository.softDeleteById(id);
    }

    public void update(Integer id, @Valid SanPhamUpdateVO vO) {
        SanPham bean = requireOne(id);
        bean.setMaSanPham(vO.getMaSanPham());
        bean.setTenSanPham(vO.getTenSanPham());
        bean.setXuatXu(vO.getXuatXu());
        bean.setTrangThai(vO.getTrangThai());
        if (vO.getIdDanhMuc() != null) {
            DanhMuc danhMuc = danhMucRepository.findById(vO.getIdDanhMuc()).orElse(null);
            bean.setDanhMuc(danhMuc);
        }
        sanPhamRepository.save(bean);
    }

    public SanPhamDTO getById(Integer id) {
        SanPham original = requireOne(id);
        return toDTO(original);
    }

    public List<SanPhamDTO> searchByMaSanPhamOrTenSanPham(String keyword) {
        if (keyword == null) keyword = "";
        String k = keyword.trim();
        List<SanPham> sanPhams = sanPhamRepository
                .findByMaSanPhamContainingIgnoreCaseOrTenSanPhamContainingIgnoreCase(k, k);
        return sanPhams.stream()
                .filter(sp -> sp.getTrangThai() != null && (sp.getTrangThai() == 0 || sp.getTrangThai() == 1))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<SanPhamDTO> query(SanPhamQueryVO vO) {
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<SanPham> entities = sanPhamRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();
            if (vO.getTenSanPham() != null && !vO.getTenSanPham().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("tenSanPham")), "%" + vO.getTenSanPham().toLowerCase() + "%"));
            }
            if (vO.getMaSanPham() != null && !vO.getMaSanPham().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("maSanPham")), "%" + vO.getMaSanPham().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            } else {
                predicates = cb.and(predicates, root.get("trangThai").in(0, 1));
            }
            return predicates;
        }, pageable);
        return entities.map(this::toDTO);
    }

    public List<String> getAllTenSanPham() {
        List<SanPham> list = sanPhamRepository.findActiveSanPhamOrderByIdDesc();
        Map<String, Integer> nameMap = new LinkedHashMap<>();
        for (SanPham sp : list) {
            if (sp.getTenSanPham() == null) continue;
            String name = sp.getTenSanPham().trim();
            if (!nameMap.containsKey(name) || sp.getId() > nameMap.get(name)) {
                nameMap.put(name, sp.getId());
            }
        }
        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(nameMap.entrySet());
        sorted.sort((a, b) -> b.getValue() - a.getValue());
        List<String> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : sorted) {
            result.add(entry.getKey());
        }
        return result;
    }

    public List<String> getAllMaSanPham() {
        return sanPhamRepository.findAllMaSanPham();
    }

    public List<SanPhamDTO> searchWithFilter(String keyword,
                                             String color,
                                             String size,
                                             String brand,
                                             String category,
                                             String material,
                                             String collar,
                                             String sleeve,
                                             Integer priceMin,
                                             Integer priceMax,
                                             int limit) {
        if (limit <= 0) limit = 5;
        Page<SanPham> page = sanPhamRepository.searchWithFilter(
                keyword == null ? null : keyword.trim().toLowerCase(),
                color,
                size,
                brand,
                category,
                material,
                collar,
                sleeve,
                priceMin,
                priceMax,
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "id"))
        );
        return page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private SanPhamDTO toDTO(SanPham original) {
        SanPhamDTO bean = new SanPhamDTO();
        BeanUtils.copyProperties(original, bean);
        List<ChiTietSanPham> chiTiets = chiTietSanPhamRepository.findBySanPhamId(original.getId());
        if (!chiTiets.isEmpty()) {
            Integer minGia = chiTiets.stream()
                    .map(ChiTietSanPham::getGia)
                    .min(Integer::compareTo)
                    .orElse(null);
            bean.setGiaBan(minGia);
        } else {
            bean.setGiaBan(null);
        }
        if (original.getDanhMuc() != null) {
            bean.setIdDanhMuc(original.getDanhMuc().getId());
            bean.setTenDanhMuc(original.getDanhMuc().getTenDanhMuc());
        }
        return bean;
    }

    private SanPham requireOne(Integer id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}