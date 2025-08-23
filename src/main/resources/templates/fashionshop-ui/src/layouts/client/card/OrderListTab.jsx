import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Chip,
    Divider,
    Button,
    CircularProgress,
} from "@mui/material";

// ================= FIXED DUMMY DATA FOR UI TEST =================
const DUMMY_ORDERS = [
    {
        id: 201,
        trangThai: "CHỜ XÁC NHẬN",
        ngayTao: "2025-08-17",
        tongTien: 999000,
        soLuongSanPham: 2,
        diaChi: "12 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    {
        id: 202,
        trangThai: "ĐANG GIAO",
        ngayTao: "2025-08-15",
        tongTien: 450000,
        soLuongSanPham: 1,
        diaChi: "15 Trần Phú, Hà Nội",
    },
    {
        id: 203,
        trangThai: "ĐANG XỬ LÝ",
        ngayTao: "2025-08-12",
        tongTien: 1750000,
        soLuongSanPham: 4,
        diaChi: "345 Lê Lợi, Đà Nẵng",
    },
];
// ================================================================

export default function OrderListTab({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // FIXED: Always set dummy orders after a short delay to simulate loading
    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setOrders(DUMMY_ORDERS);
            setLoading(false);
        }, 800); // 800ms loading effect
        return () => clearTimeout(timeout);
    }, [user]);

    if (!user || !user.id || !user.role) {
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
    if (orders.length === 0) {
        return (
            <Paper sx={{ p: 6, mt: 8, textAlign: "center" }}>
                <Typography variant="h6">Bạn chưa có đơn hàng nào đang xử lý.</Typography>
            </Paper>
        );
    }
    return (
        <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
                Đơn hàng đang xử lý
            </Typography>
            <Stack spacing={2}>
                {orders.map((order) => (
                    <Paper key={order.id} sx={{ p: 3, borderRadius: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography fontWeight={700}>Mã đơn: #{order.id}</Typography>
                            <Chip
                                label={order.trangThai || "Đang xử lý"}
                                color={order.trangThai === "CHỜ XÁC NHẬN" ? "warning" : "primary"}
                                sx={{ fontWeight: 700, fontSize: 14 }}
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
                                    {order.tongTien && order.tongTien.toLocaleString("vi-VN")}₫
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
                            {order.trangThai === "CHỜ XÁC NHẬN" && (
                                <Button
                                    color="error"
                                    variant="outlined"
                                    sx={{ fontWeight: 700 }}
                                    onClick={() => alert("Hủy đơn hàng chưa được code!")}
                                >
                                    Hủy đơn hàng
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                sx={{ fontWeight: 700, bgcolor: "#1976d2" }}
                                onClick={() => alert("Xem chi tiết đơn hàng chưa được code!")}
                            >
                                Xem chi tiết
                            </Button>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}

// PropTypes để tránh lỗi eslint và cảnh báo prop validation
OrderListTab.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        role: PropTypes.string,
    }),
};