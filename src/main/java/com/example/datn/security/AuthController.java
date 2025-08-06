package com.example.datn.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
        // Lấy role đầu tiên nếu có nhiều role
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("UNKNOWN");

        logger.info("Đăng nhập thành công cho user: {}, role: {}", username, role);

        Map<String, Object> res = new HashMap<>();
        res.put("role", role);
        res.put("username", username);
        res.put("message", "Login successful");
        return res;
    }
}