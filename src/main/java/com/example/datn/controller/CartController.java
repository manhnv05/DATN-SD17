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

    // ===== REDIS - CHO USER CHƯA ĐĂNG NHẬP =====

    @GetMapping("/{cartId}")
    public ResponseEntity<List<CartItemDisplayDTO>> getCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.getCartForDisplay(cartId));
    }

    @PostMapping("/{cartId}/add")
    public ResponseEntity<CartUpdateResponse> addToCart(@PathVariable String cartId, @RequestBody SanPhamTrongGio itemToAdd) {
        if (itemToAdd == null || itemToAdd.getChiTietSanPhamId() == null || itemToAdd.getSoLuong() <= 0) {
            return ResponseEntity.badRequest().body(new CartUpdateResponse(false, "Dữ liệu sản phẩm không hợp lệ.", null));
        }
        CartUpdateResponse response = cartService.addToCart(cartId, itemToAdd);
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
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // ===== ĐỒNG BỘ GIỎ HÀNG REDIS -> DB KHI ĐĂNG NHẬP =====

    @PostMapping("/sync-to-db")
    public ResponseEntity<Void> syncCartRedisToDb(
            @RequestParam String cartId,
            @RequestParam Long idNguoiDung,
            @RequestParam String loaiNguoiDung
    ) {
        cartService.syncCartFromRedisToDb(cartId, idNguoiDung, loaiNguoiDung);
        return ResponseEntity.ok().build();
    }

    // ===== DB - CHO USER ĐÃ ĐĂNG NHẬP =====

    @GetMapping("/db")
    public ResponseEntity<List<CartItemDisplayDTO>> getCartFromDb(
            @RequestParam Long idNguoiDung,
            @RequestParam String loaiNguoiDung
    ) {
        return ResponseEntity.ok(cartService.getCartFromDbForDisplay(idNguoiDung, loaiNguoiDung));
    }

    @PostMapping("/db/add")
    public ResponseEntity<CartUpdateResponse> addOrUpdateItemDb(
            @RequestParam Long idNguoiDung,
            @RequestParam String loaiNguoiDung,
            @RequestBody SanPhamTrongGio itemToAdd
    ) {
        CartUpdateResponse response = cartService.addOrUpdateItemDb(idNguoiDung, loaiNguoiDung, itemToAdd);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/db/update-quantity")
    public ResponseEntity<CartUpdateResponse> updateQuantityDb(
            @RequestParam Long idNguoiDung,
            @RequestParam String loaiNguoiDung,
            @RequestBody UpdateCartItemRequest request
    ) {
        CartUpdateResponse response = cartService.updateCartItemQuantityDb(
                idNguoiDung,
                loaiNguoiDung,
                request.getChiTietSanPhamId(),
                request.getSoLuong()
        );
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/db/items/{chiTietSanPhamId}")
    public ResponseEntity<Void> removeItemDb(
            @RequestParam Long idNguoiDung,
            @RequestParam String loaiNguoiDung,
            @PathVariable Long chiTietSanPhamId
    ) {
        cartService.removeItemDb(idNguoiDung, loaiNguoiDung, chiTietSanPhamId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/db")
    public ResponseEntity<Void> deleteCartDb(
            @RequestParam Long idNguoiDung,
            @RequestParam String loaiNguoiDung
    ) {
        cartService.deleteCartDb(idNguoiDung, loaiNguoiDung);
        return ResponseEntity.ok().build();
    }
}