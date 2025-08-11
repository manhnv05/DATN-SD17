import React, { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    Radio,
    FormControlLabel,
    RadioGroup,
    InputAdornment,
    Avatar,
    Divider,
    Stack,
    Autocomplete,
    Modal,
    IconButton
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import VNPAY_LOGO from "../../../assets/images/vnPay.png";
import MOMO_LOGO from "../../../assets/images/momo.png";
import ZALOPAY_LOGO from "../../../assets/images/zalopay.png";

const cartItem = {
    name: "SWE VISION L/S TEE - CREAM",
    price: 528000,
    salePrice: 480000,
    img: "https://product.hstatic.net/200000690725/product/5_6e6e1d0b6d9e4e2ebf8ec8a9a1b07ee8_large.jpg",
    quantity: 1,
    size: "M"
};

const SIZE_OPTIONS = ["M", "L", "XL"];

const PROVINCES = [
    "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "An Giang", "Bà Rịa – Vũng Tàu", "Bình Dương", "Bình Phước"
];
const DISTRICTS = {
    "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7"],
    "Hà Nội": ["Ba Đình", "Đống Đa", "Hoàn Kiếm"],
    "Đà Nẵng": ["Hải Châu", "Thanh Khê"],
    "An Giang": ["Long Xuyên", "Châu Đốc"],
    "Bà Rịa – Vũng Tàu": ["Bà Rịa", "Vũng Tàu"],
    "Bình Dương": ["Thủ Dầu Một", "Dĩ An"],
    "Bình Phước": ["Đồng Xoài"]
};
const WARDS = {
    "Quận 1": ["Bến Nghé", "Bến Thành", "Cầu Kho"],
    "Quận 3": ["Phường 1", "Phường 3"],
    "Ba Đình": ["Phúc Xá", "Trúc Bạch"],
    "Hải Châu": ["Hải Châu 1", "Hòa Thuận Đông"],
    "Long Xuyên": ["Mỹ Bình", "Mỹ Long"],
    "Bà Rịa": ["Phước Trung", "Long Tâm"],
    "Thủ Dầu Một": ["Chánh Nghĩa", "Hiệp Thành"],
    "Đồng Xoài": ["Tân Bình", "Tân Phú"]
};

const AVAILABLE_COUPONS = [
    { code: "SALE10", label: "Giảm 10%", best: true },
    { code: "FREESHIP", label: "Miễn phí vận chuyển", best: false },
    { code: "SUMMER2025", label: "Ưu đãi hè 2025", best: false }
];

const PRIMARY_BLUE = "#2274cf";
const WHITE = "#fff";
const LIGHT_BLUE_BG = "#f4f8fd";
const BORDER_COLOR = "#e0e7f5";
const DISABLED_BG = "#f4f7fa";
const MAIN_TEXT_COLOR = "#16345a";
const SIZE_MODAL_BG = "#f6f8f5";
const SIZE_MODAL_BTN_BG = "#fafbfa";
const SIZE_MODAL_BTN_ACTIVE_BG = "#fff";
const SIZE_MODAL_BTN_BORDER = "#56806b";
const SIZE_MODAL_BTN_COLOR = "#222";
const SIZE_MODAL_BTN_ACTIVE_COLOR = "#56806b";
const SIZE_MODAL_BTN_HEIGHT = 40;

export default function OrderForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        province: "",
        district: "",
        ward: "",
        note: "",
        coupon: "",
        payment: "cod"
    });
    const [appliedCoupon, setAppliedCoupon] = useState("");
    const [success, setSuccess] = useState(false);
    const [couponModalOpen, setCouponModalOpen] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(cartItem.quantity);
    const [sizeModalOpen, setSizeModalOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(cartItem.size);

    const handleProvinceChange = (event, newValue) => {
        setForm((previousValue) => ({
            ...previousValue,
            province: newValue || "",
            district: "",
            ward: ""
        }));
    };
    const handleDistrictChange = (event, newValue) => {
        setForm((previousValue) => ({
            ...previousValue,
            district: newValue || "",
            ward: ""
        }));
    };
    const handleWardChange = (event, newValue) => {
        setForm((previousValue) => ({
            ...previousValue,
            ward: newValue || ""
        }));
    };

    const handleChange = (event) => {
        setForm((previousValue) => ({ ...previousValue, [event.target.name]: event.target.value }));
    };

    const handleApplyCoupon = () => {
        setAppliedCoupon(form.coupon);
        setCouponModalOpen(false);
    };

    const handleQuickCouponSelect = (coupon) => {
        setForm((previousValue) => ({
            ...previousValue,
            coupon: coupon.code
        }));
        setAppliedCoupon(coupon.code);
        setCouponModalOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    const handleCartQuantityChange = (type) => {
        if (type === "decrement" && cartQuantity > 1) {
            setCartQuantity(cartQuantity - 1);
        }
        if (type === "increment") {
            setCartQuantity(cartQuantity + 1);
        }
    };

    const handleRemoveCart = () => {
        setCartQuantity(0);
    };

    let total = cartItem.salePrice * cartQuantity;
    if (appliedCoupon === "SALE10") total = Math.floor(total * 0.9);

    const bestCoupon = AVAILABLE_COUPONS.find(coupon => coupon.best);
    const otherCoupons = AVAILABLE_COUPONS.filter(coupon => !coupon.best);

    const ModalCouponContent = (
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
                <IconButton size="small" sx={{ mr: 1 }} onClick={() => setCouponModalOpen(false)}>
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ fontWeight: 700, flex: 1, textAlign: "center", fontSize: 17, color: MAIN_TEXT_COLOR }}>
                    Chọn mã khuyến mãi
                </Typography>
                <Box width={32} />
            </Box>
            <Box sx={{ p: 3, pt: 1.5, textAlign: "center" }}>
                {AVAILABLE_COUPONS.length === 0 ? (
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
                                {bestCoupon.label}
                                <Typography variant="caption" sx={{ color: "#888", ml: 1 }}>
                                    ({bestCoupon.code})
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
                                key={coupon.code}
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
                                {coupon.label}
                                <Typography variant="caption" sx={{ color: "#888", ml: 1 }}>
                                    ({coupon.code})
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
                    onClick={() => setCouponModalOpen(false)}
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

    const SizeModalContent = (
        <Box
            sx={{
                bgcolor: WHITE,
                borderRadius: '20px',
                width: 440,
                maxWidth: "95vw",
                mx: "auto",
                mt: 7,
                p: 0,
                boxShadow: 8,
                outline: "none",
                overflow: "hidden",
                minHeight: "520px",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f0f1ee", p: 2, pb: 1.5 }}>
                <IconButton size="small" sx={{ mr: 1, bgcolor: "#f5f7f2", borderRadius: 2 }} onClick={() => setSizeModalOpen(false)}>
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ fontWeight: 700, flex: 1, textAlign: "center", fontSize: 18, color: "#23351e" }}>
                    Chọn phân loại
                </Typography>
                <Box width={36} />
            </Box>
            <Box sx={{ p: 3, pt: 2, pb: 2, display: "flex", alignItems: "center", borderBottom: "1px solid #f0f1ee" }}>
                <Avatar
                    src={cartItem.img}
                    alt={cartItem.name}
                    variant="rounded"
                    sx={{ width: 64, height: 64, borderRadius: 2, flexShrink: 0, mr: 2 }}
                />
                <Typography fontWeight={700} fontSize={20} color="#23351e">
                    {cartItem.price.toLocaleString()}₫
                </Typography>
            </Box>
            <Box sx={{ p: 3, pt: 2, bgcolor: "#fafbfa", borderBottom: "1px solid #f0f1ee" }}>
                <Typography fontWeight={600} fontSize={16} sx={{ mb: 2 }} color="#23351e">
                    Kích thước
                </Typography>
                <Stack direction="row" spacing={2}>
                    {SIZE_OPTIONS.map((size) => (
                        <Button
                            key={size}
                            variant="outlined"
                            sx={{
                                minWidth: 56,
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: 15,
                                bgcolor: selectedSize === size ? SIZE_MODAL_BTN_ACTIVE_BG : SIZE_MODAL_BTN_BG,
                                borderColor: selectedSize === size ? SIZE_MODAL_BTN_BORDER : "#e0e0e0",
                                color: selectedSize === size ? SIZE_MODAL_BTN_ACTIVE_COLOR : SIZE_MODAL_BTN_COLOR,
                                boxShadow: "none",
                                textTransform: "none",
                                height: SIZE_MODAL_BTN_HEIGHT,
                                px: 3
                            }}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Button>
                    ))}
                </Stack>
            </Box>
            <Box sx={{ flex: 1, bgcolor: "#f3f4f3" }} />
            <Box sx={{ p: 2.5, bgcolor: "#f3f4f3" }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setSizeModalOpen(false)}
                    sx={{
                        bgcolor: "#6e8c74",
                        color: "#fff",
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 17,
                        textTransform: "none",
                        py: 1.2,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#4f6f56" }
                    }}
                >
                    Xác nhận
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: LIGHT_BLUE_BG, minHeight: "100vh", py: 4 }}>
            <Grid container justifyContent="center" spacing={4}>
                <Grid item xs={12} md={7} lg={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2, bgcolor: WHITE }}>
                        <Typography fontWeight={700} fontSize={18} mb={2} color={MAIN_TEXT_COLOR}>
                            Thông tin giao hàng
                        </Typography>
                        <Stack spacing={1.7} component="form" onSubmit={handleSubmit}>
                            <label>Họ và tên</label>
                            <TextField
                                placeholder="Nhập họ và tên"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />
                            <label>Số điện thoại</label>
                            <TextField
                                placeholder="Nhập số điện thoại"
                                name="phone"
                                required
                                value={form.phone}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <img width={16} alt="vn" src="https://flagcdn.com/w20/vn.png" />
                                        </InputAdornment>
                                    ),
                                    style: { color: MAIN_TEXT_COLOR }
                                }}
                            />
                            <label>Email</label>
                            <TextField
                                placeholder="Nhập email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                                <Box sx={{ minWidth: 80 }}>
                                    <Typography variant="body2" fontWeight={600} color={MAIN_TEXT_COLOR} sx={{ mb: { xs: 0.5, sm: 0 }, whiteSpace: "nowrap" }}>
                                        Tỉnh / TP
                                    </Typography>
                                    <Autocomplete
                                        options={PROVINCES}
                                        value={form.province}
                                        onChange={handleProvinceChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Tỉnh / TP"
                                                size="small"
                                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2, minWidth: 140 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: MAIN_TEXT_COLOR }
                                                }}
                                            />
                                        )}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{ minWidth: 110 }}>
                                    <Typography variant="body2" fontWeight={600} color={MAIN_TEXT_COLOR} sx={{ mb: { xs: 0.5, sm: 0 }, whiteSpace: "nowrap" }}>
                                        Quận / Huyện
                                    </Typography>
                                    <Autocomplete
                                        options={form.province ? DISTRICTS[form.province] || [] : []}
                                        value={form.district}
                                        onChange={handleDistrictChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Quận / Huyện"
                                                size="small"
                                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2, minWidth: 140 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: MAIN_TEXT_COLOR }
                                                }}
                                            />
                                        )}
                                        disabled={!form.province}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{ minWidth: 110 }}>
                                    <Typography variant="body2" fontWeight={600} color={MAIN_TEXT_COLOR} sx={{ mb: { xs: 0.5, sm: 0 }, whiteSpace: "nowrap" }}>
                                        Phường / Xã
                                    </Typography>
                                    <Autocomplete
                                        options={form.district ? WARDS[form.district] || [] : []}
                                        value={form.ward}
                                        onChange={handleWardChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Phường / Xã"
                                                size="small"
                                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2, minWidth: 140 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: MAIN_TEXT_COLOR }
                                                }}
                                            />
                                        )}
                                        disabled={!form.district}
                                        fullWidth
                                    />
                                </Box>
                            </Stack>

                            <label>Địa chỉ cụ thể</label>
                            <TextField
                                placeholder="Địa chỉ, tên đường"
                                name="address"
                                required
                                value={form.address}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />

                            <Box sx={{
                                mt: 2, bgcolor: "#f5f9ff", borderRadius: 2, p: 2,
                                border: `1px solid ${BORDER_COLOR}`
                            }}>
                                <Typography fontWeight={600} fontSize={15} color={MAIN_TEXT_COLOR}>
                                    Phương thức thanh toán
                                </Typography>
                                <RadioGroup
                                    value={form.payment}
                                    onChange={handleChange}
                                    name="payment"
                                    sx={{ mt: 1 }}
                                >
                                    <FormControlLabel
                                        value="cod"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", height: 24 }}>
                                                <Typography fontWeight={600} fontSize={15} color={MAIN_TEXT_COLOR} sx={{ whiteSpace: "nowrap" }}>
                                                    Thanh toán khi nhận hàng (COD)
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: WHITE,
                                            p: 1,
                                            borderRadius: 2,
                                            border: `1.5px solid ${BORDER_COLOR}`,
                                            mt: 0,
                                            alignItems: "center"
                                        }}
                                    />
                                    <FormControlLabel
                                        value="vnpay"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: 24 }}>
                                                <Typography fontWeight={600} fontSize={15} color={PRIMARY_BLUE} sx={{ whiteSpace: "nowrap" }}>
                                                    Thanh toán qua VNPAY
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={VNPAY_LOGO}
                                                    alt="VNPAY Logo"
                                                    sx={{
                                                        height: 20,
                                                        width: 48,
                                                        ml: 0.5,
                                                        objectFit: "contain",
                                                        filter: "drop-shadow(0 0 1px #2274cf)"
                                                    }}
                                                />
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: WHITE,
                                            p: 1,
                                            borderRadius: 2,
                                            border: `1.5px solid ${BORDER_COLOR}`,
                                            mt: 1,
                                            alignItems: "center"
                                        }}
                                    />
                                    <FormControlLabel
                                        value="momo"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: 24 }}>
                                                <Typography fontWeight={600} fontSize={15} color="#a50064" sx={{ whiteSpace: "nowrap" }}>
                                                    Thanh toán qua MoMo
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={MOMO_LOGO}
                                                    alt="MoMo Logo"
                                                    sx={{
                                                        height: 20,
                                                        width: 48,
                                                        ml: 0.5,
                                                        objectFit: "contain"
                                                    }}
                                                />
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: WHITE,
                                            p: 1,
                                            borderRadius: 2,
                                            border: `1.5px solid ${BORDER_COLOR}`,
                                            mt: 1,
                                            alignItems: "center"
                                        }}
                                    />
                                    <FormControlLabel
                                        value="zalopay"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: 24 }}>
                                                <Typography fontWeight={600} fontSize={15} color="#00aeef" sx={{ whiteSpace: "nowrap" }}>
                                                    Thanh toán qua ZaloPay
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={ZALOPAY_LOGO}
                                                    alt="ZaloPay Logo"
                                                    sx={{
                                                        height: 20,
                                                        width: 48,
                                                        ml: 0.5,
                                                        objectFit: "contain"
                                                    }}
                                                />
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: WHITE,
                                            p: 1,
                                            borderRadius: 2,
                                            border: `1.5px solid ${BORDER_COLOR}`,
                                            mt: 1,
                                            alignItems: "center"
                                        }}
                                    />
                                </RadioGroup>
                            </Box>

                            <TextField
                                placeholder="Ghi chú đơn hàng"
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                size="small"
                                multiline
                                minRows={2}
                                fullWidth
                                sx={{ mt: 2, bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5} lg={4}>
                    <Stack spacing={2}>
                        <Paper elevation={2} sx={{ p: 2.2, borderRadius: 3, mb: 1, bgcolor: WHITE }}>
                            <Typography fontWeight={700} fontSize={16} mb={1} color={MAIN_TEXT_COLOR}>
                                Giỏ hàng
                            </Typography>
                            {cartQuantity > 0 ? (
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="flex-start" position="relative">
                                        <Avatar
                                            src={cartItem.img}
                                            alt={cartItem.name}
                                            variant="rounded"
                                            sx={{ width: 64, height: 64, borderRadius: 2, flexShrink: 0 }}
                                        />
                                        <Box flex={1} minWidth={0}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Typography fontSize={15} fontWeight={700} color="#222" sx={{ pr: 2 }}>
                                                    SWE VISION L/S TEE - CREAM
                                                </Typography>
                                                <IconButton size="small" sx={{ color: "#bdbdbd" }} onClick={handleRemoveCart}>
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                                <Box
                                                    sx={{
                                                        px: 2,
                                                        py: 0.2,
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        bgcolor: "#f6f6f6",
                                                        borderRadius: 2,
                                                        color: "#222",
                                                        border: "1px solid #e0e0e0",
                                                        display: "inline-block",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => setSizeModalOpen(true)}
                                                >
                                                    {selectedSize}
                                                </Box>
                                                <ChevronRightIcon sx={{ color: "#bdbdbd", fontSize: 18, cursor: "pointer" }} onClick={() => setSizeModalOpen(true)} />
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                                <Typography
                                                    sx={{
                                                        textDecoration: "line-through",
                                                        color: "#bdbdbd",
                                                        fontSize: 14,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    528,000₫
                                                </Typography>
                                                <Typography
                                                    fontWeight={700}
                                                    color="#e53935"
                                                    fontSize={19}
                                                    sx={{ ml: 0 }}
                                                >
                                                    480,000₫
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            bgcolor: "#fafbfc",
                                            borderRadius: 2,
                                            border: "1px solid #e0e0e0",
                                            px: 0.5,
                                            height: 36
                                        }}>
                                            <IconButton
                                                size="small"
                                                sx={{ color: cartQuantity <= 1 ? "#e0e0e0" : "#222" }}
                                                onClick={() => handleCartQuantityChange("decrement")}
                                                disabled={cartQuantity <= 1}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography
                                                fontWeight={700}
                                                fontSize={16}
                                                sx={{
                                                    minWidth: 24,
                                                    textAlign: "center",
                                                    color: "#222",
                                                    mx: 1
                                                }}
                                            >
                                                {cartQuantity}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                sx={{ color: "#222" }}
                                                onClick={() => handleCartQuantityChange("increment")}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                    <Divider sx={{ my: 1.1, borderStyle: "dashed" }} />
                                    <Typography
                                        fontSize={15}
                                        color="#e53935"
                                        sx={{ fontWeight: 500, display: "flex", alignItems: "center" }}
                                    >
                                        Bạn đã được giảm
                                        <Box component="span" sx={{ fontWeight: 700, ml: 0.5 }}>
                                            48,000₫
                                        </Box>
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography fontSize={15} color="#888" mt={2}>
                                    Giỏ hàng của bạn đang trống
                                </Typography>
                            )}
                            <Modal
                                open={sizeModalOpen}
                                onClose={() => setSizeModalOpen(false)}
                                aria-labelledby="modal-size"
                                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                {SizeModalContent}
                            </Modal>
                        </Paper>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: WHITE, position: "relative" }}>
                            <Typography fontWeight={700} fontSize={16} mb={1} color={MAIN_TEXT_COLOR}>
                                Mã khuyến mãi
                            </Typography>
                            <Stack spacing={1}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        bgcolor: LIGHT_BLUE_BG,
                                        borderRadius: 2,
                                        border: `1px solid ${BORDER_COLOR}`,
                                        px: 1.5,
                                        py: 1,
                                        cursor: "pointer",
                                        transition: "border-color 0.2s",
                                        "&:hover": { borderColor: PRIMARY_BLUE }
                                    }}
                                    onClick={() => setCouponModalOpen(true)}
                                >
                                    <ConfirmationNumberOutlinedIcon sx={{ color: PRIMARY_BLUE, fontSize: 20, mr: 1 }} />
                                    <Typography sx={{ flex: 1, color: MAIN_TEXT_COLOR, fontWeight: 500, fontSize: 15 }}>
                                        {form.coupon
                                            ? (AVAILABLE_COUPONS.find((c) => c.code === form.coupon)?.label || form.coupon)
                                            : "Chọn mã"}
                                    </Typography>
                                    <ChevronRightIcon sx={{ color: "#bbb", fontSize: 22 }} />
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                    <TextField
                                        placeholder="Nhập mã khuyến mãi"
                                        name="coupon"
                                        value={form.coupon}
                                        onChange={handleChange}
                                        size="small"
                                        sx={{ flex: 1, bgcolor: LIGHT_BLUE_BG, borderRadius: 2 }}
                                        InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            px: 2.5,
                                            ml: 1,
                                            minWidth: 0,
                                            minHeight: 36,
                                            boxShadow: "none",
                                            textTransform: "none",
                                            bgcolor: PRIMARY_BLUE,
                                            color: WHITE,
                                            '&:hover': { bgcolor: "#1762ac" }
                                        }}
                                        onClick={handleApplyCoupon}
                                    >
                                        Áp dụng
                                    </Button>
                                </Box>
                            </Stack>
                            <Modal
                                open={couponModalOpen}
                                onClose={() => setCouponModalOpen(false)}
                                aria-labelledby="modal-coupon"
                                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                {ModalCouponContent}
                            </Modal>
                        </Paper>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: WHITE }}>
                            <Typography fontWeight={700} fontSize={16} mb={1} color={MAIN_TEXT_COLOR}>
                                Tóm tắt đơn hàng
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" mb={0.7}>
                                <Typography color="#666">Tổng tiền hàng</Typography>
                                <Typography color={MAIN_TEXT_COLOR} fontWeight={600}>
                                    {cartItem.salePrice.toLocaleString()}₫
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={0.7}>
                                <Typography color="#666">Phí vận chuyển</Typography>
                                <Typography color={MAIN_TEXT_COLOR} fontWeight={600}>
                                    -
                                </Typography>
                            </Stack>
                            <Divider sx={{ my: 1.2 }} />
                            <Stack direction="row" justifyContent="space-between" mb={1.4}>
                                <Typography fontWeight={700}>Tổng thanh toán</Typography>
                                <Typography fontWeight={900} fontSize={18} color={PRIMARY_BLUE}>
                                    {total.toLocaleString()}₫
                                </Typography>
                            </Stack>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 800,
                                    py: 1.3,
                                    fontSize: 16,
                                    boxShadow: "none",
                                    textTransform: "none",
                                    mt: 1,
                                    bgcolor: PRIMARY_BLUE,
                                    color: WHITE,
                                    '&:hover': { bgcolor: "#1762ac" }
                                }}
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleSubmit}
                            >
                                Đặt hàng
                            </Button>
                            {success && (
                                <Typography color="success.main" mt={1} align="center" fontWeight={600}>
                                    Đặt hàng thành công!
                                </Typography>
                            )}
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}