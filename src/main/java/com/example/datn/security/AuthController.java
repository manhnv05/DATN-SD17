package com.example.datn.security;

import com.example.datn.dto.RegisterKhachHangDTO;
import com.example.datn.entity.KhachHang;
import com.example.datn.repository.KhachHangRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private KhachHangRepository khachHangRepository;

    /**
     * Xử lý API đăng nhập.
     */
    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpServletResponse response
    ) {
        logger.info("Yêu cầu đăng nhập cho user: {}", username);

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
        } catch (BadCredentialsException e) {
            logger.warn("Đăng nhập thất bại cho user: {} - Lý do: Sai thông tin đăng nhập", username);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Sai tên đăng nhập hoặc mật khẩu");
            return error;
        } catch (Exception e) {
            logger.warn("Đăng nhập thất bại cho user: {} - Lý do: {}", username, e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Lỗi xác thực: " + e.getMessage());
            return error;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("KHACHHANG");

        logger.info("Đăng nhập thành công cho user: {}, role: {}", username, role);

        Map<String, Object> res = new HashMap<>();
        res.put("role", role);
        res.put("username", username);
        res.put("message", "Login successful");
        return res;
    }

    /**
     * API đăng ký tài khoản khách hàng.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerKhachHang(@RequestBody RegisterKhachHangDTO request) {
        logger.info("Yêu cầu đăng ký tài khoản cho khách hàng: {}", request.getEmail());

        // Kiểm tra email đã tồn tại chưa
        if (khachHangRepository.findByEmail(request.getEmail()).isPresent()) {
            logger.warn("Email đã tồn tại: {}", request.getEmail());
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        // Kiểm tra dữ liệu đầu vào (có thể bổ sung validate nâng cao hơn)
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()
                || request.getMatKhau() == null || request.getMatKhau().trim().isEmpty()
                || request.getTenKhachHang() == null || request.getTenKhachHang().trim().isEmpty()
                || request.getSdt() == null || request.getSdt().trim().isEmpty()) {
            logger.warn("Thiếu thông tin đăng ký khách hàng: {}", request);
            return ResponseEntity.badRequest().body("Vui lòng nhập đầy đủ thông tin!");
        }

        KhachHang kh = new KhachHang();
        kh.setEmail(request.getEmail());
        kh.setMatKhau(passwordEncoder.encode(request.getMatKhau()));
        kh.setTenKhachHang(request.getTenKhachHang());
        kh.setSdt(request.getSdt());
        // Thiết lập các trường khác nếu cần

        khachHangRepository.save(kh);

        logger.info("Đăng ký thành công cho khách hàng: {}", request.getEmail());
        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }
}