import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Paper,
    Stack,
    Card,
    CardContent,
    IconButton,
    Modal
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import logoImg from "assets/images/logo4.png";

const SOFT_PRIMARY = "#2563eb";
const SOFT_BORDER = "#e5e7eb";
const SOFT_CARD_SHADOW = "0 1px 0 0 #dbeafe";


function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
function formatNumberVN(number) {
    return number.toLocaleString('vi-VN');
}

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};

export default function VoucherTabs({ idCustomer }) {
    const [tab, setTab] = useState(0);
    const [vouchers, setVouchers] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    const AnimatedCard = styled(Paper)(({ theme, check }) => ({
        display: "flex",               // luôn xếp logo + nội dung theo hàng ngang
        alignItems: "center",
        gap: "16px",                   // khoảng cách giữa logo và nội dung
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: "none",
        border: `1.5px solid ${SOFT_BORDER}`,
        background: "#fff",
        borderRadius: 8,
        padding: "14px 18px",
        marginBottom: 10,
        "&.fade-in": {
            animation: "fadeIn 0.5s",
        },
        "&:hover": {
            borderColor: SOFT_PRIMARY,
            boxShadow: SOFT_CARD_SHADOW,
        },
        "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(20px)" },
            to: { opacity: 1, transform: "none" },
        },

        // 👉 thêm style riêng cho phần logo
        ".logo": {
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#f1f5f9",
            flexShrink: 0,
        },

        // 👉 thêm style cho phần nội dung
        ".content": {
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
        },
    }));

    const loadPgg = async () => {
        try {
            const res = await fetch(`http://localhost:8080/PhieuGiamGiaKhachHang/pddkh-online?idKhachHang=${idCustomer}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const result = await res.json();
            console.log("Vouchers:", result.data);
            setVouchers(result.data || []);
        } catch (error) {
            console.error("Failed to fetch vouchers:", error);
        }
    };

    useEffect(() => {
        loadPgg();
    }, [idCustomer]);

    const renderEmpty = () => (
        <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 200 }}
        >
            <FolderOffIcon sx={{ fontSize: 60, color: "text.secondary" }} />
            <Typography variant="h6" color="text.secondary">
                No Data Found
            </Typography>
        </Stack>
    );

    const renderVoucherCard = (voucher) => (
        <AnimatedCard
            check={1}
            key={voucher.id}
            className="fade-in"
            sx={{
                border: `1.5px solid #e2e8f0`,
                background: voucher.trangThai === 1 ? "#f0fdf4" : "#fff"
            }}
        >
            <div className="logo">
                <img
                    src={logoImg}
                    alt="Voucher Logo"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </div>

            <div className="content">
                <Typography fontWeight={600} fontSize={15.5} color="#333">
                    {voucher.tenPhieu}
                </Typography>
                <Typography fontWeight={600} fontSize={15.5} color="#333">
                    {`Mã: ${voucher.maPhieuGiamGia}`}
                </Typography>
                <Typography fontWeight={600} fontSize={15.5} color="#333">
                    Giảm:{" "}
                    {voucher.soTienGiam
                        ? `${formatNumberVN(voucher.soTienGiam)}₫`
                        : `${voucher.phamTramGiamGia}%`}
                </Typography>
                <Typography fontWeight={600} fontSize={15.5} color="#333">
                    HSD: {new Date(voucher.ngayKetThuc).toLocaleDateString()}
                </Typography>
            </div>
            <div style={{ paddingLeft: 200 }}>
                <button
                    onClick={handleOpen}
                    style={{
                        border: "none",
                        background: "none",
                        padding: 0,
                        cursor: "pointer",
                        font: "inherit",
                        color: "blue",
                        textDecoration: "underline",
                    }}
                >
                    Xem
                </button>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="select-address-modal"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        width: { xs: "98vw", sm: 650 },
                        maxWidth: "98vw",
                        borderRadius: 2,
                        px: 3,
                        pt: 2.5,
                        pb: 2.5,
                        outline: "none",
                        boxShadow: "0 4px 24px #0002",
                        position: "relative"
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography
                            id="select-address-modal"
                            fontWeight={700}
                            fontSize={22}
                            color="#365486"
                            flex={1}
                        >
                            Chi tiết phiếu giảm giá
                        </Typography>
                        <IconButton onClick={handleClose} sx={{ ml: 1 }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", mb: 2, flexDirection: "column", gap: "4px", }}>
                        <AnimatedCard
                            check={2}
                            key={voucher.id}
                            className="fade-in"
                            sx={{
                                border: `1.5px solid #e2e8f0`,
                                background: voucher.trangThai === 1 ? "#f0fdf4" : "#fff"
                            }}
                        >
                            <div className="logo">
                                <img
                                    src={logoImg}
                                    alt="Voucher Logo"
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                            </div>

                            <div className="content">
                                <Typography fontWeight={600} fontSize={15.5} color="#333">
                                    {voucher.tenPhieu}
                                </Typography>
                                <Typography fontWeight={600} fontSize={15.5} color="#333">
                                    {`Mã: ${voucher.maPhieuGiamGia}`}
                                </Typography>
                                <Typography fontWeight={600} fontSize={15.5} color="#333">
                                    Giảm:{" "}
                                    {voucher.soTienGiam
                                        ? `${formatNumberVN(voucher.soTienGiam)}₫`
                                        : `${voucher.phamTramGiamGia}%`}
                                </Typography>
                                <Typography fontWeight={600} fontSize={15.5} color="#333">
                                    HSD: {new Date(voucher.ngayKetThuc).toLocaleDateString()}
                                </Typography>
                            </div>
                        </AnimatedCard>

                        <Box sx={{ display: "flex", mb: 2, flexDirection: "column" }}>
                            <Typography fontWeight={700} fontSize={20} color="#333">
                                Hạn sử dụng
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`${voucher.ngayBatDau} ---- ${voucher.ngayKetThuc}`}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", mb: 2, flexDirection: "column" }}>
                            <Typography fontWeight={700} fontSize={20} color="#333">
                                Ưu đãi
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`Lượt sự dụng có hạn. Nhanh tay kẻo lỡ bạn nhé`}
                            </Typography>

                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`Giảm ${voucher.soTienGiam
                                    ? `${formatNumberVN(voucher.giamToiDa)}₫ cho đơn hàng`
                                    : `${voucher.phamTramGiamGia}%`} cho đơn hàng. Đơn tối thiểu: ${formatNumberVN(voucher.dieuKienGiam)} đ`}
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`${voucher.soTienGiam ? ``
                                    : `Giảm tối đa: ${formatNumberVN(voucher.giamToiDa)} đ`}`}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", mb: 2, flexDirection: "column" }}>
                            <Typography fontWeight={700} fontSize={20} color="#333">
                                Chi tiết
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`Mã: ${voucher.maPhieuGiamGia}`}
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`Tên: ${voucher.tenPhieu}`}
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`Kiểu: ${voucher.loaiPhieu === 0 ? "Công khai" : "Cá nhân"}`}
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                {`Số lượng: ${voucher.soLuong}`}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", mb: 2, flexDirection: "column" }}>
                            <Typography fontWeight={700} fontSize={20} color="#333">
                                Lưu ý
                            </Typography>
                            <Typography fontWeight={400} fontSize={15.5} color="#333">
                                Đối với những phiếu giảm giá kiểu <strong style={{ fontWeight: 600 }}>công khai</strong> phiếu giảm giá sẽ được sự dụng trên tất cả khách hàng
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Modal>
        </AnimatedCard>
    );

    const publicVouchers = vouchers.filter(v => v.loaiPhieu === 0);
    const personalVouchers = vouchers.filter(v => v.loaiPhieu === 1);

    return (
        <Paper elevation={2} sx={{ width: "100%", p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Phiếu giảm giá
            </Typography>

            <Tabs value={tab} onChange={handleChange}>
                <Tab label="Công khai" />
                <Tab label="Cá nhân" />
            </Tabs>

            <TabPanel value={tab} index={0}>
                {publicVouchers.length > 0
                    ? publicVouchers.map(renderVoucherCard)
                    : renderEmpty()}
            </TabPanel>

            <TabPanel value={tab} index={1}>
                {personalVouchers.length > 0
                    ? personalVouchers.map(renderVoucherCard)
                    : renderEmpty()}
            </TabPanel>
        </Paper>
    );
}

VoucherTabs.propTypes = {
    idCustomer: PropTypes.number.isRequired,
};
