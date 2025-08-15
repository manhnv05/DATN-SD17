package com.example.datn.vo.clientVO;

import com.example.datn.dto.SanPhamOutletDTO;
import lombok.Data;

import java.util.List;

@Data
public class SanPhamOutletVO {
    private List<SanPhamOutletDTO> content;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
}