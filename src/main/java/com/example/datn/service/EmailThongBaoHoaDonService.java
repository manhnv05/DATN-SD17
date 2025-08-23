package com.example.datn.service;

import com.example.datn.config.EmailService;
import com.example.datn.entity.HoaDon;
import com.example.datn.entity.HoaDonChiTiet;
import com.example.datn.enums.TrangThai;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.repository.HoaDonRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailThongBaoHoaDonService {
    @Autowired
    private EmailService emailService;
    @Autowired
    private HoaDonRepository hoaDonRepository;

    public void guiThongBaoCapNhatTrangThai(Integer idHoaDon, TrangThai trangThai) {

        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (hoaDon.getKhachHang() != null) {

            String emailKhachHang = hoaDon.getKhachHang().getEmail();
            try {
                sendOrderStatusUpdateEmail(hoaDon, emailKhachHang, trangThai);
            } catch (MessagingException e) {
                // Ghi log lỗi để theo dõi mà không làm dừng chương trình
                System.err.println("Lỗi gửi mail cho hóa đơn #" + idHoaDon + ": " + e.getMessage());
            }
        }
    }

    public void sendOrderStatusUpdateEmail(HoaDon hoaDon, String email, TrangThai trangThai) throws MessagingException {
        String subject;
        String statusMessage;
        String statusColor;
        String headline;

        switch (trangThai) {
            case TAO_DON_HANG:
            case CHO_XAC_NHAN:
                subject = String.format("Cửa hàng đã nhận đơn hàng #%s", hoaDon.getMaHoaDon());
                headline = "Cảm ơn bạn đã đặt hàng!";
                statusMessage = "Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận. Chúng tôi sẽ thông báo ngay khi đơn hàng được xử lý.";
                statusColor = "#3498db"; // Blue
                break;
            case DA_XAC_NHAN:
                subject = String.format("Đơn hàng #%s đã được xác nhận", hoaDon.getMaHoaDon());
                headline = "Đơn hàng đã được xác nhận!";
                statusMessage = "Chúng tôi đã xác nhận đơn hàng của bạn và đang tiến hành chuẩn bị sản phẩm để giao đi.";
                statusColor = "#27ae60"; // Greenish Blue
                break;
            case CHO_GIAO_HANG:
                subject = String.format("Đơn hàng #%s đang được chuẩn bị", hoaDon.getMaHoaDon());
                headline = "Sắp giao hàng!";
                statusMessage = "Tất cả sản phẩm đã sẵn sàng. Đơn hàng của bạn đang được đóng gói cẩn thận và sẽ sớm được bàn giao cho đơn vị vận chuyển.";
                statusColor = "#e67e22"; // Orange
                break;
            case DANG_VAN_CHUYEN:
                subject = String.format("Đơn hàng #%s đang được giao đến bạn", hoaDon.getMaHoaDon());
                headline = "Đang trên đường giao!";
                statusMessage = "Đơn hàng đã rời khỏi kho và đang trên đường giao đến địa chỉ của bạn.";
                statusColor = "#f39c12"; // Yellow Orange
                break;
            case HOAN_THANH:
                subject = String.format("Đơn hàng #%s đã giao thành công", hoaDon.getMaHoaDon());
                headline = "Giao hàng thành công!";
                statusMessage = "Cảm ơn bạn đã mua sắm! Rất mong được phục vụ bạn trong những lần tiếp theo.";
                statusColor = "#2ecc71"; // Green
                break;
            case HUY:
                subject = String.format("Thông báo hủy đơn hàng #%s", hoaDon.getMaHoaDon());
                headline = "Đơn hàng đã được hủy";
                statusMessage = "Đơn hàng của bạn đã được hủy theo yêu cầu. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.";
                statusColor = "#e74c3c"; // Red
                break;
            default:
                throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ: " + trangThai);
        }

        StringBuilder tableRows = new StringBuilder();
        int index = 1;
        for (HoaDonChiTiet ctsp : hoaDon.getHoaDonChiTietList()) {
            tableRows.append(String.format("""
                                <tr>
                                  <td>%d</td>
                                  <td>%s</td>
                                  <td>%s</td>
                                  <td>%s</td>
                                  <td style="text-align: right;">%,.0f₫</td>
                                  <td style="text-align: center;">%d</td>
                                  <td style="text-align: right;">%,.0f₫</td>
                                </tr>
                            """,
                    index++,
                    ctsp.getSanPhamChiTiet().getSanPham().getTenSanPham(),
                    ctsp.getSanPhamChiTiet().getMauSac().getTenMauSac(),
                    ctsp.getSanPhamChiTiet().getKichThuoc().getTenKichCo(),
                    ctsp.getGia().doubleValue(),
                    ctsp.getSoLuong(),
                    ctsp.getThanhTien().doubleValue()
            ));
        }
        Integer tienSauGiamGia = hoaDon.getTongTienBanDau()- hoaDon.getTongTien();
        Integer tienGiam = hoaDon.getTongTienBanDau() - hoaDon.getTongTien();
        String giamGiaFormatted = String.format("%,d₫", tienGiam > 0 ? tienGiam : 0);
        // Tính toán lại Tạm tính = Tổng hóa đơn - Phí vận chuyển + Giảm giá
        double tamTinh =  hoaDon.getTongTienBanDau();
        String ngayGiaoDuKienFormatted = "Chưa có thông tin"; // Giá trị mặc định
        if (hoaDon.getNgayGiaoDuKien() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            ngayGiaoDuKienFormatted = hoaDon.getNgayGiaoDuKien().format(formatter);
        }

        String html = String.format("""
                        <!DOCTYPE html>
                        <html lang="vi">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>%s</title>
                          <style>
                            body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f7f6; color: #333; }
                            .container { max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); overflow: hidden; }
                            .header { background-color: #2a9d8f; color: white; padding: 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .content { padding: 30px; }
                            .status-box { padding: 20px; margin-bottom: 25px; border-radius: 8px; color: #fff; background-color: %s; text-align: center; }
                            .status-box p { margin: 0; font-size: 18px; font-weight: 600; }
                            .info-section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eeeeee; }
                            .info-section h2 { color: #2a9d8f; font-size: 20px; margin-top: 0; margin-bottom: 15px; }
                            .info-section p { margin: 4px 0; line-height: 1.6; }
                            .products-table { width: 100%%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
                            .products-table th { background-color: #f2f2f2; color: #333; font-weight: 600; padding: 12px 8px; text-align: left; border-bottom: 2px solid #ddd; }
                            .products-table td { padding: 12px 8px; border-bottom: 1px solid #eee; }
                            .totals { margin-top: 20px; }
                            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
                            .totals-row.grand-total { font-size: 18px; font-weight: bold; color: #2a9d8f; border-top: 2px solid #eeeeee; margin-top: 10px; padding-top: 10px; }
                            .footer { text-align: center; padding: 25px; font-size: 13px; color: #888; }
                            .footer a { color: #2a9d8f; text-decoration: none; }
                            .button { display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #2a9d8f; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                             <div class="header">
                                <div class="header"><h1>%s</h1></div>
                                  </div>
                            <div class="content">
                              <p>Chào <strong>%s</strong>,</p>
                              <p>Chúng tôi gửi email này để thông báo về trạng thái mới nhất của đơn hàng <strong>#%s</strong> của bạn.</p>
                        
                              <div class="status-box">
                                <p>%s</p>
                                <span>%s</span>
                              </div>
                        
                              <div class="info-section">
                                <h2>Thông tin giao hàng</h2>
                                <p><strong>Người nhận:</strong> %s</p>
                                <p><strong>Địa chỉ:</strong> %s</p>
                                <p><strong>Số điện thoại:</strong> %s</p>
                                <p><strong>Ngày giao dự kiến:</strong> %s</p>
                              </div>
                        
                              <div class="info-section">
                                <h2>Chi tiết đơn hàng</h2>
                                <table class="products-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Màu sắc</th>
                                            <th>Kích thước</th>
                                            <th style="text-align: right;">Đơn giá</th>
                                            <th style="text-align: center;">Số lượng</th>
                                            <th style="text-align: right;">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        %s
                                    </tbody>
                                </table>
                                <div class="totals">
                                  <div class="totals-row"><span>Tạm tính:</span> <span>%,.0f₫</span></div>
                                  <div class="totals-row"><span>Phí vận chuyển:</span> <span>%,.0f₫</span></div>
                                  <div class="totals-row"><span>Giảm giá:</span> <span>-%s</span></div>
                                  <div class="totals-row grand-total"><span>Tổng cộng:</span> <span>%,.0f₫</span></div>
                                </div>
                              </div>
                        
                              <div style="text-align: center;">
                                <a href="https://your-website.com/orders/%s" class="button">Tra cứu đơn hàng</a>
                              </div>
                            </div>
                            <div class="footer">
                              <p>Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>SWEATER</strong>.<br>
                                 Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua <a href="mailto:support@example.com">SWEATER@gmail.com</a> hoặc SĐT 1900 1234.
                              </p>
                            </div>
                          </div>
                        </body>
                        </html>
                        """,
                subject,
                statusColor,
                headline,
                hoaDon.getTenKhachHang(),
                hoaDon.getMaHoaDon(),
                trangThai.getDisplayName().toUpperCase(),
                statusMessage,
                hoaDon.getTenKhachHang(),
                hoaDon.getDiaChi(),
                hoaDon.getSdt(),
                ngayGiaoDuKienFormatted,
                tableRows.toString(), // <-- Bảng mới chi tiết hơn
                tamTinh,
                (double) hoaDon.getPhiVanChuyen(),
                giamGiaFormatted,
                hoaDon.getTongHoaDon().doubleValue(),
                hoaDon.getMaHoaDon()
        );

        emailService.sendEmail(email, subject, html);
    }
}