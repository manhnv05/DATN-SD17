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
        id: 101,
        trangThai: "ĐÃ HOÀN TẤT",
        ngayTao: "2025-08-15",
        tongTien: 1200000,
        soLuongSanPham: 3,
        diaChi: "123 Đường ABC, Quận 1, TP.HCM",
    },
    {
        id: 102,
        trangThai: "ĐÃ HỦY",
        ngayTao: "2025-07-21",
        tongTien: 450000,
        soLuongSanPham: 1,
        diaChi: "456 Đường DEF, Quận 3, TP.HCM",
    },
    {
        id: 103,
        trangThai: "ĐÃ HOÀN TẤT",
        ngayTao: "2025-06-10",
        tongTien: 670000,
        soLuongSanPham: 2,
        diaChi: "789 Đường XYZ, Hà Nội",
    },
];
// ================================================================

export default function OrderHistoryTab({ user }) {
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
                <Typography variant="h6">Vui lòng đăng nhập để xem lịch sử đơn hàng!</Typography>
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
                <Typography variant="h6">Bạn chưa có đơn hàng nào đã hoàn tất hoặc đã hủy.</Typography>
            </Paper>
        );
    }
    return (
        <Box>
            <Typography variant="h6" fontWeight={700} mb={2}>
                Lịch sử đơn hàng
            </Typography>
            <Stack spacing={2}>
                {orders.map((order) => (
                    <Paper key={order.id} sx={{ p: 3, borderRadius: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography fontWeight={700}>Mã đơn: #{order.id}</Typography>
                            <Chip
                                label={order.trangThai || "Đã hoàn tất"}
                                color={order.trangThai === "ĐÃ HỦY" ? "error" : "success"}
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
OrderHistoryTab.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        role: PropTypes.string,
    }),
};