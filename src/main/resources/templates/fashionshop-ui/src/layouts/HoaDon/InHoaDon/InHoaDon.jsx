import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';

const InHoaDon = React.forwardRef(({ orderData }, ref) => {
  // Log để debug khi nào InHoaDon được render và nhận dữ liệu
  console.log('InHoaDon component rendering. Received orderData:', orderData);

  // === Đảm bảo dữ liệu tồn tại trước khi render chi tiết ===
  // Nếu orderData là null/undefined hoặc không có products, trả về thông báo
  if (!orderData || !orderData.products || orderData.products.length === 0) {
    console.log("InHoaDon: Không có dữ liệu hóa đơn hoặc danh sách sản phẩm rỗng.");
    return (
        <Box ref={ref} sx={{ p: 4 }}>
          <Typography variant="h6" align="center" sx={{ p: 4 }}>Không có dữ liệu hóa đơn để in.</Typography>
        </Box>
    );
  }

  // Cập nhật tên biến để khớp với dữ liệu đã transform
  const qrCodeData = `Invoice ID: ${orderData.maHoaDon}, Total: ${orderData.totalAmount}`;

  return (
      <Box ref={ref} sx={{ p: 4, fontFamily: 'Arial, sans-serif' }}>
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tên Cửa Hàng Của Bạn</Typography>
            <Typography variant="body2">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</Typography>
            <Typography variant="body2">Điện thoại: 0123.456.789</Typography>
            <Typography variant="body2">Email: info@cuahang.com</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}>HÓA ĐƠN BÁN HÀNG</Typography>
            <Typography variant="body2">Mã hóa đơn: <strong>{orderData.maHoaDon || 'N/A'}</strong></Typography>
            <Typography variant="body2">Ngày tạo: <strong>{new Date(orderData.ngayTao).toLocaleDateString('vi-VN')}</strong></Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#ccc' }} />

        {/* THÔNG TIN KHÁCH HÀNG */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Thông tin khách hàng:</Typography>
          <Typography variant="body2">Tên khách hàng: <strong>{orderData.customerName || 'N/A'}</strong></Typography>
          <Typography variant="body2">Số điện thoại: <strong>{orderData.phoneNumber || 'N/A'}</strong></Typography>
          <Typography variant="body2">Địa chỉ nhận hàng: <strong>{orderData.diaChi || 'N/A'}</strong></Typography>
          {orderData.ghiChu && <Typography variant="body2">Ghi chú: <em>{orderData.ghiChu}</em></Typography>}
        </Box>

        {/* DANH SÁCH SẢN PHẨM */}
        <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #eee' }}>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mã SP</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đơn giá (VNĐ)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thành tiền (VNĐ)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData.products.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.maSanPhamChiTiet}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{(item.price || 0).toLocaleString("vi-VN")}</TableCell>
                    <TableCell align="right">{(item.price * item.quantity || 0).toLocaleString("vi-VN")}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* TỔNG KẾT */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ textAlign: 'right', width: '280px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body1">Tổng tiền hàng:</Typography>
              <Typography variant="body1">{(orderData.totalItemsPrice || 0).toLocaleString("vi-VN")} VND</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body1">Phí vận chuyển:</Typography>
              <Typography variant="body1">{(orderData.shippingFee || 0).toLocaleString("vi-VN")} VND</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body1">Giảm giá:</Typography>
              <Typography variant="body1">{(orderData.totalDiscount || 0).toLocaleString("vi-VN")} VND</Typography>
            </Box>
            <Divider sx={{ my: 1, borderColor: '#ccc' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tổng cộng:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {(orderData.totalAmount || 0).toLocaleString("vi-VN")} VND
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CHỮ KÝ VÀ QR CODE */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
          <Box sx={{ textAlign: 'center', width: '45%' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 4 }}>Chữ ký khách hàng</Typography>
            <Typography variant="body2">(Ký, ghi rõ họ tên)</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', width: '45%' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 4 }}>Chữ ký nhân viên</Typography>
            <Typography variant="body2">({orderData.StaffName || 'N/A'})</Typography>
          </Box>
        </Box>

        {/* FOOTER */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi!</Typography>
        </Box>
      </Box>
  );
});

InHoaDon.displayName = 'InHoaDon';
InHoaDon.propTypes = {
  orderData: PropTypes.shape({
    id: PropTypes.string,
    maHoaDon: PropTypes.string.isRequired,
    customerName: PropTypes.string,
    phoneNumber: PropTypes.string,
    type: PropTypes.string,
    receiverName: PropTypes.string,
    status: PropTypes.string,
    ngayTao: PropTypes.string.isRequired,
    diaChi: PropTypes.string,
    StaffName: PropTypes.string,
    ghiChu: PropTypes.string,
    products: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          maSanPhamChiTiet: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        })
    ).isRequired,
    totalItemsPrice: PropTypes.number.isRequired,
    totalDiscount: PropTypes.number,
    shippingFee: PropTypes.number,
    totalAmount: PropTypes.number.isRequired,
    payments: PropTypes.array,
    trangThaiGoc: PropTypes.string,
  }).isRequired,
};

export default InHoaDon;