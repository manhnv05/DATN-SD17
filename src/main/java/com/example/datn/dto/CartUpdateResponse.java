package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartUpdateResponse {
    private boolean success; // Thao tác có thành công không?
    private String message;  // Thông báo cho người dùng
    private Integer availableStock; // Số lượng tồn kho thực tế (nếu thất bại)
}
