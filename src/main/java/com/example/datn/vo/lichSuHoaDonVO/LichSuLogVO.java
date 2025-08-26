package com.example.datn.vo.lichSuHoaDonVO;

import lombok.Data;

@Data
public class LichSuLogVO {
    private Integer idHoaDon;
    private String noiDungThayDoi;
    private String nguoiThucHien; // Có thể bỏ nếu bạn lấy tự động ở backend
    private String ghiChu;
}
