package com.example.datn.controller;

import com.example.datn.config.VNPayConfig;
import com.example.datn.dto.HoaDonDTO;
import com.example.datn.service.ChiTietThanhToanService;
import com.example.datn.service.HoaDonService;
import com.example.datn.service.VNPayService;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/vnpay")
public class VnpayController {
    @Autowired
    private VNPayService vnPayService;

    @Autowired
    private HoaDonService hoaDonService;
    @Autowired
    private ChiTietThanhToanService chiTietThanhToanService;
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("")
    public String home(){
        return "index";
    }

    // Nhận JSON từ FE để tạo link thanh toán
    @PostMapping("/submitOrder")
    public String submitOrder(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        int orderTotal = Integer.parseInt(body.get("amount").toString());
        String orderInfo = body.get("orderInfo").toString(); // Chú ý: nên là JSON string
        String bankcode = body.get("bankcode").toString();
        String ordertype = body.get("ordertype").toString();
        String promocode = body.get("promocode").toString();
        String locale = body.get("locale").toString();

        String urlReturn = body.containsKey("urlReturn") ? body.get("urlReturn").toString() : VNPayConfig.vnp_Returnurl;
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, bankcode, ordertype, promocode, locale, urlReturn);

        System.out.println("[submitOrder] orderTotal=" + orderTotal + ", orderInfo=" + orderInfo + ", bankcode=" + bankcode +
                ", ordertype=" + ordertype + ", promocode=" + promocode + ", locale=" + locale + ", baseUrl=" + urlReturn);

        // FE sẽ redirect sang link` này
        return "redirect:" + vnpayUrl;
    }

    // Callback sau khi thanh toán thành công từ VNPAY
    @GetMapping("/vnpay-payment")
    public String vnpayCallback(HttpServletRequest request, Model model) {
        int paymentStatus = vnPayService.orderReturn(request);

        String orderInfo     = request.getParameter("vnp_OrderInfo");
        String bankcode      = request.getParameter("vnp_BankCode");
        String promocode     = request.getParameter("vnp_PromoCode");
        String paymentTime   = request.getParameter("vnp_PayDate");
        String amountRaw     = request.getParameter("vnp_Amount");
        String locale        = request.getParameter("vnp_Locale");
        String transactionNo = request.getParameter("vnp_TransactionNo");
        String txnRef        = request.getParameter("vnp_TxnRef"); // fallback

        System.out.println("[vnpayCallback] orderInfo(raw)=" + orderInfo + ", paymentStatus=" + paymentStatus +
                ", bankcode=" + bankcode + ", promocode=" + promocode + ", paymentTime=" + paymentTime +
                ", amountRaw=" + amountRaw + ", locale=" + locale + ", transactionNo=" + transactionNo + ", txnRef=" + txnRef);

        // Chuẩn hóa số tiền (VNPAY trả về nhân 100)
        int amount = 0;
        try {
            if (amountRaw != null) {
                long parsed = Long.parseLong(amountRaw) / 100L;
                amount = (parsed > Integer.MAX_VALUE) ? Integer.MAX_VALUE : (int) parsed;
            }
            System.out.println("[vnpayCallback] amount after normalization: " + amount);
        } catch (NumberFormatException e) {
            System.err.println("[vnpayCallback] Lỗi parse amountRaw: " + amountRaw);
        }

        // Fallback mã giao dịch nếu thiếu transactionNo
        String transactionId = (transactionNo != null && !transactionNo.isBlank()) ? transactionNo : txnRef;

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("bankcode", bankcode);
        model.addAttribute("promocode", promocode);
        model.addAttribute("totalPrice", amount);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionNo", transactionId);
        model.addAttribute("locale", locale);

        // Chỉ xử lý lưu DB khi thanh toán hợp lệ
        if (paymentStatus != 1) {
            System.err.println("[vnpayCallback] paymentStatus != 1, trả về orderfail");
            return "orderfail";
        }

        try {
            // FE đã gửi id hóa đơn trong vnp_OrderInfo
            String decodedOrderInfo = URLDecoder.decode(orderInfo, StandardCharsets.UTF_8.name());
            System.out.println("[vnpayCallback] decodedOrderInfo=" + decodedOrderInfo);

            int hoaDonId = Integer.parseInt(decodedOrderInfo);
            System.out.println("[vnpayCallback] hoaDonId=" + hoaDonId);

            HoaDonDTO hoaDonDTO = hoaDonService.getHoaDonById(hoaDonId);
            System.out.println("[vnpayCallback] hoaDonDTO=" + hoaDonDTO);

            if (hoaDonDTO == null) {
                System.err.println("[vnpayCallback] Không tìm thấy hóa đơn với id=" + hoaDonId);
                return "orderfail";
            }

            // Idempotent: tránh lưu trùng theo (id hóa đơn, mã giao dịch)
            boolean existed = chiTietThanhToanService
                    .getChiTietThanhToanByHoaDonId(hoaDonId)
                    .stream()
                    .anyMatch(ct -> transactionId != null && transactionId.equals(ct.getMaGiaoDich()));
            System.out.println("[vnpayCallback] existed=" + existed + ", transactionId=" + transactionId);

            if (!existed) {
                ChiTietThanhToanVO vo = new ChiTietThanhToanVO();
                vo.setIdHoaDon(hoaDonDTO.getId());
                vo.setIdHinhThucThanhToan(2); // 2 = VNPAY
                vo.setMaGiaoDich(transactionId);
                vo.setSoTienThanhToan(amount);
                vo.setTrangThaiThanhToan(1); // 1 = đã thanh toán thành công
                vo.setGhiChu("Thanh toán qua VNPAY");

                System.out.println("[vnpayCallback] Lưu chi tiết thanh toán: " + vo);
                chiTietThanhToanService.save(vo);
            }

            System.out.println("[vnpayCallback] Thanh toán thành công, trả về ordersuccess");
            return "ordersuccess";
        } catch (Exception ex) {
            ex.printStackTrace();
            System.err.println("[vnpayCallback] Exception: " + ex.getMessage());
            return "orderfail";
        }
    }
}