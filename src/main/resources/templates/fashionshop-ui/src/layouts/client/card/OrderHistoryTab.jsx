import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import OrderDetailModal from "./OrderDetailModal";
import axios from "axios"; // Import axios để gọi API
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";

// Hàm helper để chuyển đổi trạng thái từ API sang text và màu sắc
const formatOrderStatus = (status) => {
  switch (status) {
    case "TAO_DON_HANG":
      return { text: "Tạo đơn hàng", color: "success" };
    // Thêm các trạng thái đang xử lý khác nếu có
    case "CHO_XAC_NHAN":
      return { text: "Chờ xác nhận", color: "success" };
    // Thêm các trạng thái đang xử lý khác nếu có
    case "DA_XAC_NHAN":
      return { text: "Đã xác nhận", color: "success" };
    // Thêm các trạng thái đang xử lý khác nếu có
    case "CHO_GIAO_HANG":
      return { text: "Chờ giao hàng", color: "success" };
    case "HUY":
      return { text: "Hủy", color: "error" };
    case "DANG_VAN_CHUYEN":
      return { text: "Đang vận chuyển", color: "info" };
    case "HOAN_THANH":
      return { text: "Hoàn thành", color: "success" };
    // Thêm các trạng thái đang xử lý khác nếu có
    default:
      return { text: status, color: "primary" };
  }
};

// Hàm helper để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function OrderHistoryTab({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // BƯỚC 2: Thêm state cho trang hiện tại
  const ORDERS_PER_PAGE = 5; // Số đơn hàng mỗi trang
  const pageCount = Math.ceil(allOrders.length / ORDERS_PER_PAGE);
  const displayedOrders = allOrders.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);
  // === BƯỚC 2.2: Tạo hàm để mở/đóng Modal ===
  const handleOpenModal = (orderCode) => {
    setSelectedOrderCode(orderCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderCode(null);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    if (user && user.id) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/api/lich-su-hoa-don/lay-lich-su/khach-hang/${user.id}`,{ withCredentials: true }
          );

          if (response.data && response.data.data) {
            const pendingOrders = response.data.data
              .filter((order) => order.trangThai == "HOAN_THANH" || order.trangThai == "HUY")
              .map((order) => ({
                id: order.idHoaDon,
                maHoaDon: order.maHoaDon,
                trangThai: order.trangThai,
                ngayTao: formatDate(order.ngayTao),
                tongTien: order.tongTien,
                soLuongSanPham: order.soLuongSanPham,
                diaChi: order.diaChi || "Không có thông tin địa chỉ",
              }));
            setOrders(pendingOrders);
            setAllOrders(pendingOrders);
          }
        } catch (error) {
          console.error("Lỗi khi tải danh sách đơn hàng:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || !user.id) {
    return (
      <Paper sx={{ p: 6, mt: 8, textAlign: "center" }}>
        <Typography variant="h6">Vui lòng đăng nhập để xem đơn hàng!</Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Stack alignItems="center" mt={6}>
        <CircularProgress />
      </Stack>
    );
  }

  if (allOrders.length === 0) {
    return (
      <Paper sx={{ p: 6, mt: 8, textAlign: "center" }}>
        <Typography variant="h6">Bạn chưa có đơn hàng nào đang xử lý.</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Lịch sử đơn hàng
      </Typography>
      <Stack spacing={2}>
        {displayedOrders.map((order) => {
          const statusInfo = formatOrderStatus(order.trangThai);
          return (
            <Paper key={order.id} sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontWeight={700}>Mã đơn: #{order.maHoaDon}</Typography>
                <Chip
                  label={statusInfo.text}
                  color={statusInfo.color}
                  sx={{ fontWeight: 700, fontSize: 14, color: "white" }}
                />
                <Typography ml="auto" color="#888" fontSize={15}>
                  Ngày đặt: {order.ngayTao}
                </Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Box>
                <Typography>
                  Tổng tiền:{" "}
                  <b style={{ color: "#e53935" }}>
                    {order.tongTien != null ? order.tongTien.toLocaleString("vi-VN") + "₫" : "N/A"}
                  </b>
                </Typography>
                <Typography color="#888" fontSize={14} mt={0.5}>
                  Số sản phẩm: {order.soLuongSanPham}
                </Typography>
                <Typography color="#888" fontSize={14} mt={0.5}>
                  Địa chỉ: {order.diaChi}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 400,
                    color: "#49a3f1",
                    borderColor: "#49a3f1",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#1769aa",
                      background: "#f0f6fd",
                      color: "#1769aa",
                    },
                  }}
                  onClick={() => handleOpenModal(order.maHoaDon)}
                >
                  Xem chi tiết
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
      {pageCount > 1 && (
        <Stack alignItems="center" mt={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Stack>
      )}
      {isModalOpen && (
        <OrderDetailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          orderCode={selectedOrderCode}
        />
      )}
    </Box>
  );
}

OrderHistoryTab.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role: PropTypes.string,
  }),
};
