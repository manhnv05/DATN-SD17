import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button, IconButton } from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
    PRIMARY_BLUE,
    WHITE,
    LIGHT_BLUE_BG,
    BORDER_COLOR,
    MAIN_TEXT_COLOR
} from "./constants";
import axios from "axios";

// Dùng API động, không lấy AVAILABLE_COUPONS cứng nữa
export default function ModalCouponContent({ onClose, handleQuickCouponSelect }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API lấy danh sách mã giảm giá động, có thể truyền thêm props để fetch đúng tổng tiền
        // Ở đây demo: lấy tất cả mã, bạn có thể truyền prop "subtotal" để lọc phù hợp
        const fetchCoupons = async () => {
            setLoading(true);
            try {
                // Thay thế bằng API thực tế của bạn, ví dụ /PhieuGiamGiaKhachHang/query
                const response = await axios.post(
                    "http://localhost:8080/PhieuGiamGiaKhachHang/query",
                    { tongTienHoaDon: 1000000, khachHang: null }
                );
                setCoupons(response.data?.data?.content || []);
            } catch {
                setCoupons([]);
            }
            setLoading(false);
        };
        fetchCoupons();
    }, []);

    // Tìm coupon tốt nhất (ví dụ: giảm nhiều nhất)
    let bestCoupon = null;
    let otherCoupons = [];
    if (coupons && coupons.length > 0) {
        bestCoupon = coupons[0];
        for (let i = 1; i < coupons.length; ++i) {
            // So sánh giảm giá thực tế
            const bestValue = bestCoupon.loaiPhieu === 0
                ? bestCoupon.giamToiDa
                : (bestCoupon.soTienGiam || 0);
            const thisValue = coupons[i].loaiPhieu === 0
                ? coupons[i].giamToiDa
                : (coupons[i].soTienGiam || 0);
            if (thisValue > bestValue) bestCoupon = coupons[i];
        }
        otherCoupons = coupons.filter(c => c !== bestCoupon);
    }

    return (
        <Box
            sx={{
                bgcolor: WHITE,
                borderRadius: 3,
                width: 350,
                maxWidth: "90vw",
                mx: "auto",
                mt: 7,
                p: 0,
                boxShadow: 8,
                outline: "none",
                overflow: "hidden"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER_COLOR}`, p: 2, pb: 1.5 }}>
                <IconButton size="small" sx={{ mr: 1 }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ fontWeight: 700, flex: 1, textAlign: "center", fontSize: 17, color: MAIN_TEXT_COLOR }}>
                    Chọn mã khuyến mãi
                </Typography>
                <Box width={32} />
            </Box>
            <Box sx={{ p: 3, pt: 1.5, textAlign: "center" }}>
                {loading ? (
                    <Typography color="#888" fontWeight={500}>
                        Đang tải mã khuyến mãi...
                    </Typography>
                ) : coupons.length === 0 ? (
                    <Box>
                        <LocalOfferOutlinedIcon sx={{ color: "#bbb", fontSize: 56, mb: 2 }} />
                        <Typography color="#888" fontWeight={500}>
                            Không có mã khuyến mãi phù hợp
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        {bestCoupon && (
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    mb: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    fontSize: 15,
                                    borderWidth: 2,
                                    borderColor: PRIMARY_BLUE,
                                    bgcolor: LIGHT_BLUE_BG,
                                    color: PRIMARY_BLUE,
                                    textTransform: "none",
                                    "& .MuiSvgIcon-root": { mr: 1 }
                                }}
                                onClick={() => handleQuickCouponSelect(bestCoupon)}
                                startIcon={<ConfirmationNumberOutlinedIcon sx={{ color: PRIMARY_BLUE }} />}
                            >
                                {bestCoupon.maPhieuGiamGia}
                                <Typography variant="caption" sx={{ color: "#888", ml: 1 }}>
                                    ({bestCoupon.tenPhieu})
                                </Typography>
                                <Box sx={{
                                    ml: 1.5,
                                    px: 1.2,
                                    py: 0.2,
                                    bgcolor: PRIMARY_BLUE,
                                    color: WHITE,
                                    fontWeight: 700,
                                    fontSize: 12,
                                    borderRadius: 1
                                }}>
                                    Tốt nhất
                                </Box>
                            </Button>
                        )}
                        {otherCoupons.map((coupon) => (
                            <Button
                                key={coupon.id}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    my: 0.5,
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    fontSize: 15,
                                    color: PRIMARY_BLUE,
                                    borderColor: BORDER_COLOR,
                                    textTransform: "none"
                                }}
                                onClick={() => handleQuickCouponSelect(coupon)}
                                startIcon={<ConfirmationNumberOutlinedIcon sx={{ color: "#bdbdbd" }} />}
                            >
                                {coupon.maPhieuGiamGia}
                                <Typography variant="caption" sx={{ color: "#888", ml: 1 }}>
                                    ({coupon.tenPhieu})
                                </Typography>
                            </Button>
                        ))}
                        {(!bestCoupon && otherCoupons.length === 0) && (
                            <Box sx={{ mt: 3, mb: 2 }}>
                                <LocalOfferOutlinedIcon sx={{ color: "#bbb", fontSize: 56, mb: 2 }} />
                                <Typography color="#888" fontWeight={500}>
                                    Không có mã khuyến mãi phù hợp
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
            <Box sx={{ borderTop: `1px solid ${BORDER_COLOR}`, bgcolor: "#fafafa", p: 1.3 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="inherit"
                    onClick={onClose}
                    sx={{
                        bgcolor: "#eee",
                        color: "#444",
                        boxShadow: "none",
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: 15,
                        textTransform: "none"
                    }}
                >Đóng</Button>
            </Box>
        </Box>
    );
}

ModalCouponContent.propTypes = {
    onClose: PropTypes.func.isRequired,
    handleQuickCouponSelect: PropTypes.func.isRequired,
};