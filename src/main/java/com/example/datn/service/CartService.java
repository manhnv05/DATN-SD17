package com.example.datn.service;

import com.example.datn.dto.CartItemDisplayDTO;
import com.example.datn.dto.CartUpdateResponse;
import com.example.datn.entity.*;
import com.example.datn.enums.LoaiNguoiDung;
import com.example.datn.repository.ChiTietDotGiamGiaRepository;
import com.example.datn.repository.ChiTietSanPhamRepository;
import com.example.datn.repository.GioHangRepository;
import com.example.datn.repository.SanPhamRepository;
import com.example.datn.util.LoaiNguoiDungUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
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
    private final ChiTietDotGiamGiaRepository chiTietDotGiamGiaRepository;
    private static final String CART_KEY_PREFIX = "cart:";

    @Autowired
    private GioHangRepository gioHangRepository;

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
        ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(itemToAdd.getChiTietSanPhamId())
                .orElse(null);

        if (chiTiet == null) {
            return new CartUpdateResponse(false, "Sản phẩm không tồn tại.", 0);
        }

        int availableStock = chiTiet.getSoLuong();

        if (availableStock <= 0) {
            return new CartUpdateResponse(false, "Sản phẩm đã hết hàng.", 0);
        }

        List<SanPhamTrongGio> cart = getCart(cartId);
        boolean itemExists = false;

        for (SanPhamTrongGio item : cart) {
            if (item.getChiTietSanPhamId().equals(itemToAdd.getChiTietSanPhamId())) {
                itemExists = true;
                int newTotalQuantity = item.getSoLuong() + itemToAdd.getSoLuong();

                if (newTotalQuantity > availableStock) {
                    return new CartUpdateResponse(
                            false,
                            "Không thể thêm! Số lượng thêm vào (" + itemToAdd.getSoLuong() + ") vượt quá tồn kho (" + availableStock + ").",
                            availableStock
                    );
                }

                item.setSoLuong(newTotalQuantity);
                break;
            }
        }
        if (!itemExists) {
            if (itemToAdd.getSoLuong() > availableStock) {
                return new CartUpdateResponse(false, "Số lượng thêm vào vượt quá tồn kho. Chỉ còn " + availableStock + " sản phẩm.", availableStock);
            }
            cart.add(itemToAdd);
        }

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

    public void deleteCart(String cartId) {
        redisTemplate.delete(CART_KEY_PREFIX + cartId);
    }

    public CartUpdateResponse updateCartItemQuantity(String cartId, Integer chiTietSanPhamId, int newQuantity) {
        ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(chiTietSanPhamId)
                .orElse(null);

        if (chiTiet == null) {
            return new CartUpdateResponse(false, "Sản phẩm không tồn tại.", 0);
        }

        int availableStock = chiTiet.getSoLuong();

        if (newQuantity > availableStock) {
            return new CartUpdateResponse(false, "Số lượng vượt quá tồn kho. Chỉ còn " + availableStock + " sản phẩm.", availableStock);
        }

        if (newQuantity <= 0) {
            removeFromCart(cartId, chiTietSanPhamId);
            return new CartUpdateResponse(true, "Đã xóa sản phẩm khỏi giỏ hàng.", availableStock);
        }

        List<SanPhamTrongGio> cart = getCart(cartId);
        boolean itemUpdated = false;
        for (SanPhamTrongGio item : cart) {
            if (item.getChiTietSanPhamId().equals(chiTietSanPhamId)) {
                item.setSoLuong(newQuantity);
                itemUpdated = true;
                break;
            }
        }

        if (!itemUpdated) {
            return new CartUpdateResponse(false, "Sản phẩm không có trong giỏ hàng.", availableStock);
        }

        saveCart(cartId, cart);
        return new CartUpdateResponse(true, "Cập nhật số lượng thành công!", availableStock);
    }

    // ==== FIXED: Set id, idNguoiDung, loaiNguoiDung đầy đủ ====
    public List<CartItemDisplayDTO> getCartForDisplay(String cartId) {
        List<SanPhamTrongGio> cartFromRedis = getCart(cartId);
        if (cartFromRedis.isEmpty()) {
            return new ArrayList<>();
        }
        List<Integer> chiTietIds = cartFromRedis.stream()
                .map(SanPhamTrongGio::getChiTietSanPhamId)
                .distinct()
                .collect(Collectors.toList());
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

        List<ChiTietDotGiamGia> allGiamGias = chiTietDotGiamGiaRepository.findByChiTietSanPhamIdInAndTrangThai(chiTietIds, 1);
        Map<Integer, ChiTietDotGiamGia> giamGiaMap = new HashMap<>();
        for (ChiTietDotGiamGia ctdgg : allGiamGias) {
            giamGiaMap.putIfAbsent(ctdgg.getChiTietSanPham().getId(), ctdgg);
        }

        return cartFromRedis.stream().map(item -> {
            ChiTietSanPham ct = chiTietMap.get(item.getChiTietSanPhamId());
            SanPham sp = (ct != null) ? sanPhamMap.get(ct.getSanPham().getId()) : null;
            CartItemDisplayDTO dto = new CartItemDisplayDTO();
            dto.setId(item.getId()); // <-- Bổ sung dòng này nếu SanPhamTrongGio có getId()
            dto.setIdNguoiDung(item.getIdNguoiDung());
            dto.setLoaiNguoiDung(item.getLoaiNguoiDung());
            dto.setSoLuong(item.getSoLuong());
            dto.setDonGia(item.getDonGia());

            if (ct != null) {
                dto.setTenKichCo(ct.getKichThuoc().getTenKichCo());
                dto.setTenMauSac(ct.getMauSac().getTenMauSac());
                dto.setMaMau(ct.getMauSac().getMaMau());
                dto.setTenCoAo(ct.getCoAo().getTenCoAo());
                dto.setTenTayAo(ct.getTayAo().getTenTayAo());
                dto.setTenChatLieu(ct.getChatLieu().getTenChatLieu());
                dto.setIdChiTietSanPham(item.getChiTietSanPhamId());
                List<String> listAnh = ct.getSpctHinhAnhs().stream()
                        .map(h -> h.getHinhAnh().getDuongDanAnh())
                        .collect(Collectors.toList());
                dto.setHinhAnh(listAnh);

                dto.setGiaGoc(BigDecimal.valueOf(ct.getGia()));

                ChiTietDotGiamGia giamGia = giamGiaMap.get(ct.getId());
                if (giamGia != null && giamGia.getDotGiamGia() != null) {
                    dto.setPhanTramGiamGia(giamGia.getDotGiamGia().getPhanTramGiamGia());
                }
            }
            if (sp != null) {
                dto.setTenSanPham(sp.getTenSanPham());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public void syncCartFromRedisToDb(String cartId, Long idNguoiDung, String loaiNguoiDung) {
        List<SanPhamTrongGio> redisCart = getCart(cartId);
        if (redisCart == null || redisCart.isEmpty()) return;

        LoaiNguoiDung userType = LoaiNguoiDungUtil.fromString(loaiNguoiDung);

        for (SanPhamTrongGio item : redisCart) {
            ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(item.getChiTietSanPhamId()).orElse(null);
            if (chiTiet == null) continue;

            Optional<GioHang> ghOpt = gioHangRepository.findByIdNguoiDungAndLoaiNguoiDungAndChiTietSanPham_Id(
                    idNguoiDung, userType, item.getChiTietSanPhamId().longValue()
            );
            GioHang gh = ghOpt.orElseGet(() -> GioHang.builder()
                    .idNguoiDung(idNguoiDung)
                    .loaiNguoiDung(userType)
                    .chiTietSanPham(chiTiet)
                    .build()
            );
            int newSoLuong = item.getSoLuong();
            if (ghOpt.isPresent()) {
                newSoLuong += gh.getSoLuong() != null ? gh.getSoLuong() : 0;
            }
            newSoLuong = Math.min(newSoLuong, chiTiet.getSoLuong());
            gh.setSoLuong(newSoLuong);

            gioHangRepository.save(gh);
        }
        deleteCart(cartId);
    }

    // ==== FIXED: Set id, idNguoiDung, loaiNguoiDung đầy đủ ====
    public List<CartItemDisplayDTO> getCartFromDbForDisplay(Long idNguoiDung, String loaiNguoiDung) {
        LoaiNguoiDung userType = LoaiNguoiDungUtil.fromString(loaiNguoiDung);
        List<GioHang> gioHangs = gioHangRepository.findByIdNguoiDungAndLoaiNguoiDung(idNguoiDung, userType);
        if (gioHangs.isEmpty()) return new ArrayList<>();

        List<Integer> chiTietIds = gioHangs.stream()
                .map(g -> g.getChiTietSanPham().getId().intValue())
                .distinct()
                .collect(Collectors.toList());
        Map<Integer, ChiTietSanPham> chiTietMap = chiTietSanPhamRepository.findAllById(chiTietIds)
                .stream().collect(Collectors.toMap(ct -> ct.getId().intValue(), Function.identity()));

        List<Integer> sanPhamIds = chiTietMap.values().stream()
                .map(ct -> ct.getSanPham().getId())
                .distinct()
                .collect(Collectors.toList());
        Map<Integer, SanPham> sanPhamMap = sanPhamRepository.findAllById(sanPhamIds)
                .stream().collect(Collectors.toMap(SanPham::getId, Function.identity()));

        // Lọc giảm giá còn hiệu lực: trạng thái = 1, nằm trong khoảng ngày
        LocalDateTime now = LocalDateTime.now();
        List<ChiTietDotGiamGia> allGiamGias = chiTietDotGiamGiaRepository.findByChiTietSanPhamIdInAndTrangThai(chiTietIds, 1);
        Map<Integer, ChiTietDotGiamGia> giamGiaMap = new HashMap<>();
        for (ChiTietDotGiamGia ctdgg : allGiamGias) {
            DotGiamGia dot = ctdgg.getDotGiamGia();
            if (dot != null && dot.getNgayBatDau() != null && dot.getNgayKetThuc() != null
                    && !now.isBefore(dot.getNgayBatDau()) && !now.isAfter(dot.getNgayKetThuc())) {
                ChiTietDotGiamGia old = giamGiaMap.get(ctdgg.getChiTietSanPham().getId().intValue());
                if (old == null || dot.getNgayBatDau().isAfter(old.getDotGiamGia().getNgayBatDau())) {
                    giamGiaMap.put(ctdgg.getChiTietSanPham().getId().intValue(), ctdgg);
                }
            }
        }

        return gioHangs.stream().map(gh -> {
            ChiTietSanPham ct = chiTietMap.get(gh.getChiTietSanPham().getId().intValue());
            SanPham sp = ct != null ? sanPhamMap.get(ct.getSanPham().getId()) : null;
            CartItemDisplayDTO dto = new CartItemDisplayDTO();
            dto.setId(gh.getId());
            dto.setIdNguoiDung(gh.getIdNguoiDung());
            dto.setLoaiNguoiDung(gh.getLoaiNguoiDung() != null ? gh.getLoaiNguoiDung().name() : null);
            dto.setSoLuong(gh.getSoLuong());
            dto.setIdChiTietSanPham(ct != null ? ct.getId() : null);

            if (ct != null) {
                dto.setTenKichCo(ct.getKichThuoc() != null ? ct.getKichThuoc().getTenKichCo() : null);
                dto.setTenMauSac(ct.getMauSac() != null ? ct.getMauSac().getTenMauSac() : null);
                dto.setMaMau(ct.getMauSac() != null ? ct.getMauSac().getMaMau() : null);
                dto.setTenCoAo(ct.getCoAo() != null ? ct.getCoAo().getTenCoAo() : null);
                dto.setTenTayAo(ct.getTayAo() != null ? ct.getTayAo().getTenTayAo() : null);
                dto.setTenChatLieu(ct.getChatLieu() != null ? ct.getChatLieu().getTenChatLieu() : null);
                List<String> listAnh = ct.getSpctHinhAnhs() != null ? ct.getSpctHinhAnhs().stream()
                        .map(h -> h.getHinhAnh().getDuongDanAnh())
                        .collect(Collectors.toList()) : new ArrayList<>();
                dto.setHinhAnh(listAnh);
                BigDecimal giaGoc = BigDecimal.valueOf(ct.getGia());
                dto.setGiaGoc(giaGoc);

                ChiTietDotGiamGia giamGia = giamGiaMap.get(ct.getId().intValue());
                if (giamGia != null && giamGia.getDotGiamGia() != null) {
                    int phanTram = giamGia.getDotGiamGia().getPhanTramGiamGia();
                    dto.setPhanTramGiamGia(phanTram);
                    BigDecimal giaSauGiam;
                    if (giamGia.getGiaSauKhiGiam() != null && giamGia.getGiaSauKhiGiam() > 0) {
                        giaSauGiam = BigDecimal.valueOf(giamGia.getGiaSauKhiGiam());
                    } else {
                        giaSauGiam = giaGoc.multiply(BigDecimal.valueOf(100 - phanTram))
                                .divide(BigDecimal.valueOf(100));
                    }
                    dto.setDonGia(giaSauGiam);
                } else {
                    dto.setPhanTramGiamGia(null);
                    dto.setDonGia(giaGoc);
                }
            }

            if (sp != null) {
                dto.setTenSanPham(sp.getTenSanPham());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public CartUpdateResponse addOrUpdateItemDb(Long idNguoiDung, String loaiNguoiDung, SanPhamTrongGio itemToAdd) {
        LoaiNguoiDung userType = LoaiNguoiDungUtil.fromString(loaiNguoiDung);
        ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(itemToAdd.getChiTietSanPhamId()).orElse(null);
        if (chiTiet == null) {
            return new CartUpdateResponse(false, "Sản phẩm không tồn tại.", 0);
        }
        int availableStock = chiTiet.getSoLuong();
        if (availableStock <= 0) {
            return new CartUpdateResponse(false, "Sản phẩm đã hết hàng.", 0);
        }
        Optional<GioHang> ghOpt = gioHangRepository.findByIdNguoiDungAndLoaiNguoiDungAndChiTietSanPham_Id(
                idNguoiDung, userType, itemToAdd.getChiTietSanPhamId().longValue());
        GioHang gh = ghOpt.orElseGet(() -> GioHang.builder()
                .idNguoiDung(idNguoiDung)
                .loaiNguoiDung(userType)
                .chiTietSanPham(chiTiet)
                .build());
        int newSoLuong = itemToAdd.getSoLuong();
        if (ghOpt.isPresent()) {
            newSoLuong += gh.getSoLuong() != null ? gh.getSoLuong() : 0;
        }
        newSoLuong = Math.min(newSoLuong, availableStock);
        gh.setSoLuong(newSoLuong);
        gioHangRepository.save(gh);
        return new CartUpdateResponse(true, "Thêm/cập nhật sản phẩm thành công!", availableStock);
    }

    public CartUpdateResponse updateCartItemQuantityDb(Long idNguoiDung, String loaiNguoiDung, Integer chiTietSanPhamId, Integer newQuantity) {
        LoaiNguoiDung userType = LoaiNguoiDungUtil.fromString(loaiNguoiDung);
        ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(chiTietSanPhamId).orElse(null);
        if (chiTiet == null) {
            return new CartUpdateResponse(false, "Sản phẩm không tồn tại.", 0);
        }
        int availableStock = chiTiet.getSoLuong();
        if (newQuantity > availableStock) {
            return new CartUpdateResponse(false, "Số lượng vượt quá tồn kho. Chỉ còn " + availableStock + " sản phẩm.", availableStock);
        }
        Optional<GioHang> ghOpt = gioHangRepository.findByIdNguoiDungAndLoaiNguoiDungAndChiTietSanPham_Id(
                idNguoiDung, userType, chiTietSanPhamId.longValue());
        if (ghOpt.isEmpty()) {
            return new CartUpdateResponse(false, "Sản phẩm không có trong giỏ hàng.", availableStock);
        }
        GioHang gh = ghOpt.get();
        if (newQuantity <= 0) {
            gioHangRepository.delete(gh);
            return new CartUpdateResponse(true, "Đã xóa sản phẩm khỏi giỏ hàng.", availableStock);
        }
        gh.setSoLuong(newQuantity);
        gioHangRepository.save(gh);
        return new CartUpdateResponse(true, "Cập nhật số lượng thành công!", availableStock);
    }

    public void removeItemDb(Long idNguoiDung, String loaiNguoiDung, Long chiTietSanPhamId) {
        LoaiNguoiDung userType = LoaiNguoiDungUtil.fromString(loaiNguoiDung);
        Optional<GioHang> ghOpt = gioHangRepository.findByIdNguoiDungAndLoaiNguoiDungAndChiTietSanPham_Id(
                idNguoiDung, userType, chiTietSanPhamId);
        ghOpt.ifPresent(gioHangRepository::delete);
    }

    public void deleteCartDb(Long idNguoiDung, String loaiNguoiDung) {
        LoaiNguoiDung userType = LoaiNguoiDung.valueOf(loaiNguoiDung);
        gioHangRepository.deleteByIdNguoiDungAndLoaiNguoiDung(idNguoiDung, userType);
    }
}