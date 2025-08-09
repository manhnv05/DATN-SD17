package com.example.datn.dto;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private String cartId; // ID của giỏ hàng
    private Integer chiTietSanPhamId; // ID của sản phẩm chi tiết
    private int soLuong; // Số lượng mới
}
