package com.example.datn.vo.khachHangVO;

import com.example.datn.vo.diaChiVO.DiaChiVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // <-- Thêm dòng này
@AllArgsConstructor
public class KhachHangWithDiaChiVO {
    private KhachHangVO khachHang;
    private DiaChiVO diaChi;
}
