package com.example.datn.Service;

import com.example.datn.DTO.SanPhamDTO;
import com.example.datn.Entity.ChatLieu;
import com.example.datn.Entity.DanhMuc;
import com.example.datn.Entity.SanPham;
import com.example.datn.Entity.ThuongHieu;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Repository.ChatLieuRepository;
import com.example.datn.Repository.DanhMucRepository;
import com.example.datn.Repository.SanPhamRepository;
import com.example.datn.Repository.ThuongHieuRepository;
import com.example.datn.Repository.ChiTietSanPhamRepository;
import com.example.datn.VO.SanPhamQueryVO;
import com.example.datn.VO.SanPhamUpdateVO;
import com.example.datn.VO.SanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private ChatLieuRepository chatLieuRepository;
    @Autowired
    private DanhMucRepository danhMucRepository;
    @Autowired
    private ThuongHieuRepository thuongHieuRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    public Integer save(SanPhamVO vO) {
        SanPham bean = new SanPham();
        // Copy các trường cơ bản
        bean.setMaSanPham(vO.getMaSanPham());
        bean.setTenSanPham(vO.getTenSanPham());
        bean.setXuatXu(vO.getXuatXu());
        bean.setTrangThai(vO.getTrangThai());

        // Gán entity ManyToOne từ id
        if (vO.getIdChatLieu() != null) {
            ChatLieu chatLieu = chatLieuRepository.findById(vO.getIdChatLieu()).orElse(null);
            bean.setChatLieu(chatLieu);
        }
        if (vO.getIdDanhMuc() != null) {
            DanhMuc danhMuc = danhMucRepository.findById(vO.getIdDanhMuc()).orElse(null);
            bean.setDanhMuc(danhMuc);
        }
        if (vO.getIdThuongHieu() != null) {
            ThuongHieu thuongHieu = thuongHieuRepository.findById(vO.getIdThuongHieu()).orElse(null);
            bean.setThuongHieu(thuongHieu);
        }

        bean = sanPhamRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        sanPhamRepository.deleteById(id);
    }

    public void update(Integer id, SanPhamUpdateVO vO) {
        SanPham bean = requireOne(id);
        // Copy các trường cơ bản
        bean.setMaSanPham(vO.getMaSanPham());
        bean.setTenSanPham(vO.getTenSanPham());
        bean.setXuatXu(vO.getXuatXu());
        bean.setTrangThai(vO.getTrangThai());

        // Gán entity ManyToOne từ id nếu có
        if (vO.getIdChatLieu() != null) {
            ChatLieu chatLieu = chatLieuRepository.findById(vO.getIdChatLieu()).orElse(null);
            bean.setChatLieu(chatLieu);
        }
        if (vO.getIdDanhMuc() != null) {
            DanhMuc danhMuc = danhMucRepository.findById(vO.getIdDanhMuc()).orElse(null);
            bean.setDanhMuc(danhMuc);
        }
        if (vO.getIdThuongHieu() != null) {
            ThuongHieu thuongHieu = thuongHieuRepository.findById(vO.getIdThuongHieu()).orElse(null);
            bean.setThuongHieu(thuongHieu);
        }

        sanPhamRepository.save(bean);
    }

    public SanPhamDTO getById(Integer id) {
        SanPham original = requireOne(id);
        return toDTO(original);
    }

    public List<SanPhamDTO> searchByMaSanPhamOrTenSanPham(String keyword) {
        List<SanPham> sanPhams = sanPhamRepository
                .findByMaSanPhamOrTenSanPham(keyword, keyword);
        return sanPhams.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Page<SanPhamDTO> query(SanPhamQueryVO vO) {
        // Xử lý phân trang và lọc dữ liệu
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 5;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        // Lọc theo tên và trạng thái (nếu có)
        String tenSanPham = vO.getTenSanPham();
        Integer trangThai = vO.getTrangThai();

        Page<SanPham> sanPhamPage;

        if ((tenSanPham == null || tenSanPham.trim().isEmpty()) && trangThai == null) {
            sanPhamPage = sanPhamRepository.findAll(pageable);
        } else if ((tenSanPham == null || tenSanPham.trim().isEmpty())) {
            sanPhamPage = sanPhamRepository.findByTrangThai(trangThai, pageable);
        } else if (trangThai == null) {
            sanPhamPage = sanPhamRepository.findByTenSanPhamContainingIgnoreCase(tenSanPham, pageable);
        } else {
            sanPhamPage = sanPhamRepository.findByTenSanPhamContainingIgnoreCaseAndTrangThai(tenSanPham, trangThai, pageable);
        }

        return sanPhamPage.map(this::toDTO);
    }

    // Get all product names
    public List<String> getAllTenSanPham() {
        return sanPhamRepository.findAllTenSanPham();
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

        if (original.getChatLieu() != null) {
            bean.setIdChatLieu(original.getChatLieu().getId());
            bean.setTenChatLieu(original.getChatLieu().getTenChatLieu());
        }
        if (original.getThuongHieu() != null) {
            bean.setIdThuongHieu(original.getThuongHieu().getId());
            bean.setTenThuongHieu(original.getThuongHieu().getTenThuongHieu());
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