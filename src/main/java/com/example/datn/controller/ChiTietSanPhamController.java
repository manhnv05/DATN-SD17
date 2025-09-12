package com.example.datn.controller;

import com.example.datn.dto.ChiTietSanPhamDTO;
import com.example.datn.service.ChiTietSanPhamService;
import com.example.datn.dto.ChiTietSanPhamDotGIamGIaDTO;
import com.example.datn.vo.chiTietSanPhamVO.ChiTietSanPhamQueryVO;
import com.example.datn.vo.chiTietSanPhamVO.ChiTietSanPhamUpdateVO;
import com.example.datn.vo.chiTietSanPhamVO.ChiTietSanPhamVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping("/chiTietSanPham")
public class ChiTietSanPhamController {

    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;

    @PostMapping
    public String save(@Valid @RequestBody ChiTietSanPhamVO vO) {
        // Không nhận trường mã từ phía client, mã sẽ được tự động tạo trong service
        return chiTietSanPhamService.save(vO).toString();
    }

    @PostMapping("/batch")
    public List<Integer> saveBatch(@Valid @RequestBody List<ChiTietSanPhamVO> voList) {
        // Áp dụng logic cộng dồn hoặc tạo mới cho từng VO trong service
        return voList.stream()
                .map(chiTietSanPhamService::save)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chiTietSanPhamService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(
            @Valid @NotNull @PathVariable("id") Integer id,
            @RequestBody ChiTietSanPhamUpdateVO vO
    ) {
        chiTietSanPhamService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChiTietSanPhamDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chiTietSanPhamService.getById(id);
    }

    @GetMapping
    public Page<ChiTietSanPhamDTO> query(@Valid ChiTietSanPhamQueryVO vO) {
        return chiTietSanPhamService.query(vO);
    }

    @GetMapping("/search")
    public List<ChiTietSanPhamDTO> search(@RequestParam("keyword") String keyword) {
        return chiTietSanPhamService.searchByMa(keyword);
    }

    @GetMapping("/by-san-pham/{idSanPham}")
    public List<ChiTietSanPhamDTO> getBySanPham(@PathVariable("idSanPham") Integer idSanPham) {
        return chiTietSanPhamService.findBySanPhamId(idSanPham);
    }

    @GetMapping("/find-by-ma")
    public ChiTietSanPhamDTO getByMaSanPhamChiTiet(@RequestParam("ma") String maSanPhamChiTiet) {
        return chiTietSanPhamService.findByMaSanPhamChiTiet(maSanPhamChiTiet);
    }

    @GetMapping("/all-ma")
    public List<String> getAllMaChiTietSanPham() {
        return chiTietSanPhamService.getAllMaChiTietSanPham();
    }

    @GetMapping("/allctspgiamgia")
    public List<ChiTietSanPhamDotGIamGIaDTO> test() {
        return chiTietSanPhamService.getChiTietSanPhamCoDGG();
    }

    @GetMapping("/scan-san-pham")
    public ResponseEntity<ChiTietSanPhamDotGIamGIaDTO> getSanPhamTheoMa(@RequestParam("maSanPhamChiTiet") String maSanPhamChiTiet) {
        ChiTietSanPhamDotGIamGIaDTO dto = chiTietSanPhamService.getChiTietSanPhamTheoMa(maSanPhamChiTiet);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/ban-chay")
    public ResponseEntity<Page<ChiTietSanPhamDotGIamGIaDTO>> getBestSellers(Pageable pageable) {
        Page<ChiTietSanPhamDotGIamGIaDTO> resultPage = chiTietSanPhamService.getDanhSachSanPhamBanChay(pageable);
        return ResponseEntity.ok(resultPage);
    }
}