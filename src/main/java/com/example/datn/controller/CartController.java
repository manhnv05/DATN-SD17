package com.example.datn.controller;

import com.example.datn.dto.CartItemDisplayDTO;
import com.example.datn.dto.CartUpdateResponse;
import com.example.datn.dto.UpdateCartItemRequest;
import com.example.datn.entity.SanPhamTrongGio;
import com.example.datn.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    private final CartService cartService;

    @GetMapping("/{cartId}")
    public ResponseEntity<List<CartItemDisplayDTO>> getCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.getCartForDisplay(cartId));
    }

    @PostMapping("/{cartId}/add")
    public ResponseEntity<CartUpdateResponse> addToCart(@PathVariable String cartId, @RequestBody SanPhamTrongGio itemToAdd) {
        // --- Validation cơ bản ---
        if (itemToAdd == null || itemToAdd.getChiTietSanPhamId() == null || itemToAdd.getSoLuong() <= 0) {
            return ResponseEntity.badRequest().body(new CartUpdateResponse(false, "Dữ liệu sản phẩm không hợp lệ.", null));
        }

        // --- Gọi service để xử lý nghiệp vụ ---
        // itemToAdd đã có sẵn từ @RequestBody, chỉ cần truyền thẳng vào service
        CartUpdateResponse response = cartService.addToCart(cartId, itemToAdd);

        // --- Xử lý phản hồi từ service ---
        // Nếu không thành công (ví dụ: hết hàng), trả về lỗi 400 Bad Request
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cartId}/items/{chiTietSanPhamId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable String cartId, @PathVariable Integer chiTietSanPhamId) {
        cartService.removeFromCart(cartId, chiTietSanPhamId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable String cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update-quantity")
    public ResponseEntity<CartUpdateResponse> updateQuantity(@RequestBody UpdateCartItemRequest request) {
        if (request.getCartId() == null || request.getChiTietSanPhamId() == null) {
            CartUpdateResponse response = new CartUpdateResponse(false, "Thiếu thông tin cartId hoặc chiTietSanPhamId", null);
            return ResponseEntity.badRequest().body(response);
        }

        CartUpdateResponse response = cartService.updateCartItemQuantity(
                request.getCartId(),
                request.getChiTietSanPhamId(),
                request.getSoLuong()
        );

        // Nếu thao tác không thành công (do vượt quá tồn kho), trả về lỗi 400
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }

        // Nếu thành công, trả về 200 OK
        return ResponseEntity.ok(response);
    }


}
