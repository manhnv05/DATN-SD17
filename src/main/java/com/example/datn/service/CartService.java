package com.example.datn.service;

import com.example.datn.dto.CartItemDisplayDTO;
import com.example.datn.dto.CartUpdateResponse;
import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.entity.SanPham;
import com.example.datn.entity.SanPhamTrongGio;
import com.example.datn.repository.ChiTietSanPhamRepository;
import com.example.datn.repository.SanPhamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CartService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    private final SanPhamRepository sanPhamRepository;
    private final ChiTietSanPhamRepository chiTietSanPhamRepository;
    private static final String CART_KEY_PREFIX = "cart:";

    // Lấy giỏ hàng thô từ Redis
    public List<SanPhamTrongGio> getCart(String cartId) {
        String key = CART_KEY_PREFIX + cartId;
        List<Object> rawCart = (List<Object>) redisTemplate.opsForValue().get(key);
        if (rawCart == null) {
            return new ArrayList<>();
        }
        // Cần chuyển đổi lại do Redis lưu dạng Object
        return rawCart.stream()
                .map(obj -> (SanPhamTrongGio) obj)
                .collect(Collectors.toList());
    }

    public CartUpdateResponse addToCart(String cartId, SanPhamTrongGio itemToAdd) {
        // 1. Lấy thông tin sản phẩm và tồn kho từ DB
        ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(itemToAdd.getChiTietSanPhamId())
                .orElse(null);

        if (chiTiet == null) {
            return new CartUpdateResponse(false, "Sản phẩm không tồn tại.", 0);
        }

        int availableStock = chiTiet.getSoLuong();

        // Nếu kho đã hết hàng
        if (availableStock <= 0) {
            return new CartUpdateResponse(false, "Sản phẩm đã hết hàng.", 0);
        }

        List<SanPhamTrongGio> cart = getCart(cartId);
        boolean itemExists = false;

        // 2. Lặp qua giỏ hàng để kiểm tra sản phẩm đã tồn tại chưa
        for (SanPhamTrongGio item : cart) {
            if (item.getChiTietSanPhamId().equals(itemToAdd.getChiTietSanPhamId())) {
                itemExists = true;

                // 3. Tính toán số lượng tổng nếu cộng dồn
                int newTotalQuantity = item.getSoLuong() + itemToAdd.getSoLuong();

                // 4. So sánh với tồn kho
                if (newTotalQuantity > availableStock) {
                    return new CartUpdateResponse(
                            false,
                            "Không thể thêm!  Số lượng thêm vào ("+ itemToAdd.getSoLuong() +") vượt quá tồn kho (" + availableStock + ").",
                            availableStock
                    );
                }

                // Nếu hợp lệ, cập nhật số lượng
                item.setSoLuong(newTotalQuantity);
                break;
            }
        }
        // 5. Nếu sản phẩm chưa có trong giỏ, thêm mới
        if (!itemExists) {
            // Kiểm tra số lượng thêm mới có vượt tồn kho không
            if (itemToAdd.getSoLuong() > availableStock) {
                return new CartUpdateResponse(false, "Số lượng thêm vào vượt quá tồn kho. Chỉ còn " + availableStock + " sản phẩm.", availableStock);
            }
            cart.add(itemToAdd);
        }

        // 6. Lưu lại giỏ hàng và trả về kết quả thành công
        saveCart(cartId, cart);
        return new CartUpdateResponse(true, "Đã thêm sản phẩm vào giỏ hàng!", availableStock);
    }

    public void removeFromCart(String cartId, Integer chiTietSanPhamId) {
        List<SanPhamTrongGio> cart = getCart(cartId);
        cart.removeIf(item -> item.getChiTietSanPhamId().equals(chiTietSanPhamId));
        saveCart(cartId, cart);
    }

    private void saveCart(String cartId, List<SanPhamTrongGio> cart) {
        redisTemplate.opsForValue().set(CART_KEY_PREFIX + cartId, cart, 7, TimeUnit.DAYS);
    }

    // Xóa giỏ hàng (sau khi thanh toán)
    public void deleteCart(String cartId) {
        redisTemplate.delete(CART_KEY_PREFIX + cartId);
    }

    public CartUpdateResponse updateCartItemQuantity(String cartId, Integer chiTietSanPhamId, int newQuantity) {
        // 1. Lấy thông tin chi tiết sản phẩm từ DB để biết tồn kho
        ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(chiTietSanPhamId)
                .orElse(null);

        if (chiTiet == null) {
            return new CartUpdateResponse(false, "Sản phẩm không tồn tại.", 0);
        }

        int availableStock = chiTiet.getSoLuong(); // Số lượng trong kho

        // 2. Kiểm tra số lượng yêu cầu có vượt quá tồn kho không
        if (newQuantity > availableStock) {
            return new CartUpdateResponse(false, "Số lượng vượt quá tồn kho. Chỉ còn " + availableStock + " sản phẩm.", availableStock);
        }

        // 3. Nếu số lượng mới <= 0, thì xóa sản phẩm
        if (newQuantity <= 0) {
            removeFromCart(cartId, chiTietSanPhamId);
            return new CartUpdateResponse(true, "Đã xóa sản phẩm khỏi giỏ hàng.", availableStock);
        }

        // 4. Nếu hợp lệ, tiến hành cập nhật vào Redis
        List<SanPhamTrongGio> cart = getCart(cartId);
        boolean itemUpdated = false;
        for (SanPhamTrongGio item : cart) {
            if (item.getChiTietSanPhamId().equals(chiTietSanPhamId)) {
                item.setSoLuong(newQuantity);
                itemUpdated = true;
                break;
            }
        }

        // Trường hợp item chưa có trong giỏ nhưng người dùng gọi API update (hiếm gặp)
        if (!itemUpdated) {
            // Có thể thêm mới hoặc trả về lỗi tùy vào logic mong muốn
            // Ở đây ta giả sử là chỉ cập nhật item đã có
            return new CartUpdateResponse(false, "Sản phẩm không có trong giỏ hàng.", availableStock);
        }

        saveCart(cartId, cart);
        return new CartUpdateResponse(true, "Cập nhật số lượng thành công!", availableStock);
    }

    public List<CartItemDisplayDTO> getCartForDisplay(String cartId) {
        List<SanPhamTrongGio> cartFromRedis = getCart(cartId);
        if (cartFromRedis.isEmpty()) {
            return new ArrayList<>();
        }
        List<Integer> chiTietIds = cartFromRedis.stream()
                .map(SanPhamTrongGio::getChiTietSanPhamId)
                .distinct()
                .collect(Collectors.toList());
// 3. Query DB lấy thông tin chi tiết sản phẩm
        Map<Integer, ChiTietSanPham> chiTietMap = chiTietSanPhamRepository.findAllById(chiTietIds)
                .stream()
                .collect(Collectors.toMap(ChiTietSanPham::getId, Function.identity()));

        List<Integer> sanPhamIds = chiTietMap.values().stream()
                .map(ct -> ct.getSanPham().getId())
                .distinct()
                .collect(Collectors.toList());

        Map<Integer, SanPham> sanPhamMap = sanPhamRepository.findAllById(sanPhamIds)
                .stream()
                .collect(Collectors.toMap(SanPham::getId, Function.identity()));
      return   cartFromRedis.stream().map(item -> {
            // Lấy chi tiết sản phẩm (size, màu, giá...) từ Map
            ChiTietSanPham ct = chiTietMap.get(item.getChiTietSanPhamId());
            // Lấy sản phẩm cha từ Map (tên sản phẩm, hình ảnh...)
            SanPham sp = (ct != null) ? sanPhamMap.get(ct.getSanPham().getId()) : null;
            // Tạo DTO để trả về frontend
            CartItemDisplayDTO dto = new CartItemDisplayDTO();
            dto.setSoLuong(item.getSoLuong());
            dto.setDonGia(item.getDonGia());
            // Nếu tìm thấy chi tiết sản phẩm, set size và màu
            if (ct != null) {
                dto.setTenKichCo(ct.getKichThuoc().getTenKichCo());
                dto.setTenMauSac(ct.getMauSac().getTenMauSac());
                dto.setTenCoAo(ct.getCoAo().getTenCoAo());
                dto.setTenTayAo(ct.getTayAo().getTenTayAo());
                dto.setTenChatLieu(ct.getChatLieu().getTenChatLieu());
                dto.setIdChiTietSanPham(item.getChiTietSanPhamId());
//                dto.setHinhAnh(ct.get()); // Có thể thay bằng lấy ảnh từ bảng hình ảnh riêng
            }
            // Nếu tìm thấy sản phẩm cha, set thông tin cơ bản
            if (sp != null) {
                dto.setTenSanPham(sp.getTenSanPham());
            }
            return dto;
        }).collect(Collectors.toList());
    }
}



