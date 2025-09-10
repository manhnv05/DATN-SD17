// File: VoucherList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick"; // Import Slider component
import {
    Box, Typography, Paper, Divider, Stack, Button, CircularProgress, Alert
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { toast } from "react-toastify"; // Giả sử bạn dùng react-toastify để thông báo

// --- Cấu hình cho Slider ---
const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false, // Ẩn nút next/prev mặc định
    appendDots: dots => (
        <Box sx={{ bottom: "-25px" }}>
            <ul style={{ margin: "0px" }}> {dots} </ul>
        </Box>
    ),
};
function formatDieuKienGiam(condition) {
    if (!condition) {
        return "Áp dụng cho mọi đơn hàng"; // Hiển thị mặc định nếu không có điều kiện
    }
    
    // Cố gắng chuyển đổi điều kiện thành một con số
    const numericCondition = parseInt(condition.replace(/\D/g, ''), 10);

    // Nếu là một số hợp lệ và lớn hơn 0, định dạng nó
    if (!isNaN(numericCondition) && numericCondition > 0) {
        return `Cho đơn từ: ${numericCondition.toLocaleString('vi-VN')}₫`;
    }
    
    // Nếu không phải là số (ví dụ: "Mua 2 tặng 1"), trả về chuỗi gốc
    return condition;
}
// --- Các hàm tiện ích ---
function formatDiscount(voucher) {
    if (voucher.phamTramGiamGia && voucher.phamTramGiamGia > 0) {
        return `Giảm ${voucher.phamTramGiamGia}%`;
    }
    if (voucher.soTienGiam && voucher.soTienGiam > 0) {
        return `Giảm ${voucher.soTienGiam.toLocaleString('vi-VN')}₫`;
    }
    return voucher.tenPhieu; // Fallback
}

function calculateRemainingDays(ngayKetThuc) {
    const now = new Date();
    const endDate = new Date(ngayKetThuc);
    const diffTime = endDate - now;
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// --- Component chính ---
export default function VoucherList() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/phieu_giam_gia/public");
                setVouchers(response.data || []);
            } catch (err) {
                setError("Không thể tải danh sách khuyến mãi.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);

    const handleCopyCode = (maPhieu) => {
        navigator.clipboard.writeText(maPhieu);
        toast.success(`Đã sao chép mã: ${maPhieu}`);
    };

    // --- Logic hiển thị ---

    if (loading) {
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: 150 }}>
                <CircularProgress />
            </Stack>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (vouchers.length === 0) {
        return (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
                Hiện chưa có mã khuyến mãi công khai nào.
            </Typography>
        );
    }
    
    // Chỉ sử dụng Slider nếu có nhiều hơn 1 voucher
    const useSlider = vouchers.length > 1;

    const voucherCards = vouchers.map((voucher) => {
        const remainingDays = calculateRemainingDays(voucher.ngayKetThuc);
        
        return (
            // Thêm key vào đây để Slider hoạt động đúng
            <Box key={voucher.id} sx={{ px: useSlider ? 1 : 0, py: 1 }}> 
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex", alignItems: "stretch", bgcolor: "#fff",
                        borderRadius: 3, boxShadow: "0 4px 22px 0 #bde0fe26",
                        overflow: "hidden", border: "1.5px solid #e3f0fa"
                    }}
                >
                    <Box sx={{
                        bgcolor: "#ffa750", display: "flex", alignItems: "center", justifyContent: "center",
                        minWidth: 92, px: 1, py: 3, flexDirection: "column", gap: 1.5
                    }}>
                        <CardGiftcardIcon sx={{ color: "#fff", fontSize: 44 }} />
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ borderRight: "2px dashed #ececec" }}/>

                    <Box sx={{
                        flex: 1, px: 2.5, py: 2.5, display: "flex",
                        flexDirection: "column", justifyContent: "center"
                    }}>
                        <Typography sx={{ fontSize: 21, fontWeight: 900, mb: 0.6, color: "#191b23", letterSpacing: 1.2 }}>
                            {formatDiscount(voucher)}
                        </Typography>
                       <Typography sx={{ fontSize: 15.5, color: "#434343", mb: 0.2 }}>
    {formatDieuKienGiam(voucher.dieuKienGiam)}
</Typography>
                        
                        {remainingDays > 0 ? (
                            <Typography sx={{ fontSize: 14.2, color: "#e53935", mb: 0.8, fontWeight: 700 }}>
                                Hết hạn trong {remainingDays} ngày
                            </Typography>
                        ) : (
                             <Typography sx={{ fontSize: 14.2, color: "#9e9e9e", mb: 0.8, fontWeight: 700 }}>
                                Đã hết hạn
                            </Typography>
                        )}
 {voucher.maPhieuGiamGia && (
                        <Box sx={{ mb: 1.5, alignSelf: 'flex-start' }}>
                             <Box sx={{ 
                                display: 'inline-block',
                                border: '2px dashed #ffc999',
                                bgcolor: '#fffaf5',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 2
                             }}>
                                <Typography sx={{ 
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    color: '#d96e00',
                                    letterSpacing: 2
                                }}>
                                    {voucher.maPhieuGiamGia}
                                </Typography>
                             </Box>
                        </Box>
                    )}
                        <Stack direction="row" spacing={2} mt={1.2}>
                         
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: "#191b23", color: "#fff", fontWeight: 700,
                                    fontSize: 17, px: 3, borderRadius: 2,
                                    boxShadow: "0 2px 10px 0 #191b2316", textTransform: "none",
                                    "&:hover": { bgcolor: "#23252c" }
                                }}
                                onClick={() => handleCopyCode(voucher.maPhieuGiamGia)}
                            >
                                Sao chép
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        );
    });


    return (
        <Box sx={{ maxWidth: 470, width: '100%', mx: "auto" }}>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 2.3, color: "#171b22", letterSpacing: 1.1 }}>
                Mã khuyến mãi
            </Typography>
            {useSlider ? (
                <Slider {...sliderSettings}>
                    {voucherCards}
                </Slider>
            ) : (
                voucherCards
            )}
        </Box>
    );
}