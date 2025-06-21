package com.example.datn.Service;

import com.example.datn.DTO.ChiTietSanPhamDTO;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Repository.*;
import com.example.datn.VO.ChiTietSanPhamQueryVO;
import com.example.datn.VO.ChiTietSanPhamUpdateVO;
import com.example.datn.VO.ChiTietSanPhamVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ChiTietSanPhamService {

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    // Inject các repository liên kết
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private MauSacRepository mauSacRepository;
    @Autowired
    private KichThuocRepository kichThuocRepository;
    @Autowired
    private CoAoRepository coAoRepository;
    @Autowired
    private TayAoRepository tayAoRepository;

    public Integer save(ChiTietSanPhamVO vO) {
        ChiTietSanPham bean = new ChiTietSanPham();
        // Gán các thuộc tính đơn giản
        BeanUtils.copyProperties(vO, bean);

        // Gán các entity liên kết
        if (vO.getIdSanPham() != null)
            bean.setSanPham(sanPhamRepository.findById(vO.getIdSanPham()).orElse(null));
        if (vO.getIdMauSac() != null)
            bean.setMauSac(mauSacRepository.findById(vO.getIdMauSac()).orElse(null));
        if (vO.getIdKichThuoc() != null)
            bean.setKichThuoc(kichThuocRepository.findById(vO.getIdKichThuoc()).orElse(null));
        if (vO.getIdCoAo() != null)
            bean.setCoAo(coAoRepository.findById(vO.getIdCoAo()).orElse(null));
        if (vO.getIdTayAo() != null)
            bean.setTayAo(tayAoRepository.findById(vO.getIdTayAo()).orElse(null));

        bean = chiTietSanPhamRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chiTietSanPhamRepository.deleteById(id);
    }

    public void update(Integer id, ChiTietSanPhamUpdateVO vO) {
        ChiTietSanPham bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);

        // Gán các entity liên kết
        if (vO.getIdSanPham() != null)
            bean.setSanPham(sanPhamRepository.findById(vO.getIdSanPham()).orElse(null));
        if (vO.getIdMauSac() != null)
            bean.setMauSac(mauSacRepository.findById(vO.getIdMauSac()).orElse(null));
        if (vO.getIdKichThuoc() != null)
            bean.setKichThuoc(kichThuocRepository.findById(vO.getIdKichThuoc()).orElse(null));
        if (vO.getIdCoAo() != null)
            bean.setCoAo(coAoRepository.findById(vO.getIdCoAo()).orElse(null));
        if (vO.getIdTayAo() != null)
            bean.setTayAo(tayAoRepository.findById(vO.getIdTayAo()).orElse(null));

        chiTietSanPhamRepository.save(bean);
    }

    public ChiTietSanPhamDTO getById(Integer id) {
        ChiTietSanPham original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChiTietSanPhamDTO> query(ChiTietSanPhamQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    // Thêm hàm tìm kiếm theo mã hoặc mô tả sản phẩm chi tiết
    public List<ChiTietSanPhamDTO> searchByMaOrMoTa(String keyword) {
        List<ChiTietSanPham> list = chiTietSanPhamRepository
                .findByMaSanPhamChiTietContainingIgnoreCaseOrMoTaContainingIgnoreCase(keyword, keyword);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Thêm hàm lấy danh sách chi tiết theo id sản phẩm cha
    public List<ChiTietSanPhamDTO> findBySanPhamId(Integer idSanPham) {
        List<ChiTietSanPham> list = chiTietSanPhamRepository.findBySanPhamId(idSanPham);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ChiTietSanPhamDTO toDTO(ChiTietSanPham original) {
        ChiTietSanPhamDTO bean = new ChiTietSanPhamDTO();
        BeanUtils.copyProperties(original, bean);

        // Gán các trường id và tên liên kết nếu cần
        if (original.getSanPham() != null) {
            bean.setIdSanPham(original.getSanPham().getId());
            bean.setTenSanPham(original.getSanPham().getTenSanPham());
        }
        if (original.getMauSac() != null) {
            bean.setIdMauSac(original.getMauSac().getId());
            bean.setTenMauSac(original.getMauSac().getTenMauSac());
        }
        if (original.getKichThuoc() != null) {
            bean.setIdKichThuoc(original.getKichThuoc().getId());
            bean.setTenKichThuoc(original.getKichThuoc().getTenKichCo());
        }
        if (original.getCoAo() != null) {
            bean.setIdCoAo(original.getCoAo().getId());
            bean.setTenCoAo(original.getCoAo().getTenCoAo());
        }
        if (original.getTayAo() != null) {
            bean.setIdTayAo(original.getTayAo().getId());
            bean.setTenTayAo(original.getTayAo().getTenTayAo());
        }
        return bean;
    }

    private ChiTietSanPham requireOne(Integer id) {
        return chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}