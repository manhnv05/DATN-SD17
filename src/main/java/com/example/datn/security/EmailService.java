package com.example.datn.security;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpHtml(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Mã xác nhận đặt lại mật khẩu - Fashion Shop");
            helper.setText(buildHtmlContent(code), true); // true: gửi html

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage(), e);
        }
    }

    private String buildHtmlContent(String code) {
        return """
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:460px;margin:0 auto;background:#f8fafc;border-radius:12px;padding:32px 28px">
          <h2 style="color:#1089d3;margin-bottom:16px">Xin chào,</h2>
          <p style="font-size:16px;color:#222;margin:12px 0 18px">
            Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản tại <b>Fashion Shop</b>.<br>
            Đây là mã xác nhận của bạn:
          </p>
          <div style="text-align:center;margin:32px 0 18px">
            <span style="display:inline-block;background:#1089d3;color:#fff;font-size:34px;letter-spacing:6px;padding:14px 38px;border-radius:8px;font-weight:bold;">
              %s
            </span>
          </div>
          <p style="font-size:15px;color:#444;">Mã xác nhận này có hiệu lực trong vài phút.<br>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
          <hr style="margin:28px 0 14px">
          <div style="font-size:13px;color:#888;text-align:center;">Fashion Shop &copy; %s</div>
        </div>
        """.formatted(code, java.time.Year.now());
    }
}