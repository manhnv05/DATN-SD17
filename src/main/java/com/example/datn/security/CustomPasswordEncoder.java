package com.example.datn.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomPasswordEncoder implements PasswordEncoder {
    private static final Logger logger = LoggerFactory.getLogger(CustomPasswordEncoder.class);

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @Override
    public String encode(CharSequence rawPassword) {
        String encoded = bCryptPasswordEncoder.encode(rawPassword);
        logger.debug("Encoded password for [{}]: [{}]", rawPassword, encoded);
        return encoded;
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (encodedPassword == null) return false;
        // Hỗ trợ mọi định dạng BCrypt
        if (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$") || encodedPassword.startsWith("$2y$")) {
            boolean match = bCryptPasswordEncoder.matches(rawPassword, encodedPassword);
            logger.debug("Matching BCrypt password for [{}]: [{}]", rawPassword, match);
            return match;
        }
        // WARNING: Không nên dùng đoạn này ở production! Chỉ dùng khi migrate mật khẩu cũ.
        boolean plainMatch = rawPassword != null && rawPassword.toString().equals(encodedPassword);
        if (plainMatch) {
            logger.warn("Plain text password match for [{}]", rawPassword);
        }
        return plainMatch;
    }
}