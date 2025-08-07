package com.example.datn.security;

import com.example.datn.entity.NhanVien;
import com.example.datn.entity.KhachHang;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.NhanVienRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        logger.info("Đang xác thực tài khoản với username/email: {}", usernameOrEmail);

        // 1. Tìm nhân viên theo email
        Optional<NhanVien> nvOpt = nhanVienRepository.findByEmail(usernameOrEmail);
        if (nvOpt.isPresent()) {
            NhanVien nv = nvOpt.get();
            String vaiTro = (nv.getVaiTro() != null && nv.getVaiTro().getTen() != null)
                    ? toRoleCode(nv.getVaiTro().getTen())
                    : "NHANVIEN";
            logger.info("Đăng nhập thành công với tài khoản nhân viên: {}, vai trò: {}", nv.getEmail(), vaiTro);

            return User.builder()
                    .username(nv.getEmail())
                    .password(nv.getMatKhau())
                    .roles(vaiTro)
                    .build();
        }

        // 2. Nếu không phải nhân viên, tìm khách hàng theo email
        Optional<KhachHang> khOpt = khachHangRepository.findByEmail(usernameOrEmail);
        if (khOpt.isPresent()) {
            KhachHang kh = khOpt.get();
            logger.info("Đăng nhập thành công với tài khoản khách hàng: {}", kh.getEmail());

            return User.builder()
                    .username(kh.getEmail())
                    .password(kh.getMatKhau())
                    .roles("KHACHHANG")
                    .build();
        }

        logger.warn("Không tìm thấy tài khoản với username/email: {}", usernameOrEmail);
        throw new UsernameNotFoundException("Không tìm thấy tài khoản với: " + usernameOrEmail);
    }

    /**
     * Chuyển tên vai trò sang mã code: bỏ dấu, bỏ khoảng trắng, viết hoa.
     * Ví dụ: "Quản trị viên" -> "QUANTRIVIEN"
     */
    private String toRoleCode(String tenVaiTro) {
        if (tenVaiTro == null) return "NHANVIEN";
        String temp = Normalizer.normalize(tenVaiTro, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "") // bỏ dấu
                .replaceAll("\\s+", "") // bỏ khoảng trắng
                .toUpperCase();
        logger.debug("Chuyển vai trò '{}' thành mã role '{}'", tenVaiTro, temp);
        return temp;
    }
}