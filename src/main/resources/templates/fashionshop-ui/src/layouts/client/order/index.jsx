import React, { useState } from "react";
import {
    Box, Grid, Paper, TextField, Button, Typography, Radio, FormControlLabel,
    RadioGroup, InputAdornment, Avatar, Divider, Stack, Autocomplete, Modal, IconButton
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VNPAY_LOGO from "../../../assets/images/vnPay.png";
import MOMO_LOGO from "../../../assets/images/momo.png";
import ZALOPAY_LOGO from "../../../assets/images/zalopay.png";

import {
    cartItem, SIZE_OPTIONS, PROVINCES, DISTRICTS, WARDS, AVAILABLE_COUPONS,
    PRIMARY_BLUE, WHITE, LIGHT_BLUE_BG, BORDER_COLOR, DISABLED_BG, MAIN_TEXT_COLOR
} from "./constants";
import ModalCouponContent from "./ModalCouponContent";
import SizeModalContent from "./SizeModalContent";
import Footer from "../components/footer";
import { Link as RouterLink } from "react-router-dom";

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

    // Banner inline code (giống giỏ hàng, có nút quay lại)
    const Banner = (
        <Box
            sx={{
                width: "100%",
                height: { xs: 90, md: 140 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                mt: 2,
                px: 0,
                background: "linear-gradient(90deg, #ffe169 0%, #ffc94a 60%, #ffb55e 100%)",
                borderRadius: { xs: "0 0 28px 28px", md: "0 60px 0 60px" },
                boxShadow: "0 8px 32px 0 #ffd58033",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                justifyContent="center"
                sx={{ mx: "auto" }}
            >
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    component={RouterLink}
                    to="/card"
                    sx={{
                        fontWeight: 700,
                        borderRadius: 3,
                        px: 2.1,
                        background: "#fff",
                        color: "#1976d2",
                        border: "1.5px solid #bde0fe",
                        boxShadow: "0 2px 8px 0 #bde0fe22",
                        "&:hover": {
                            background: "#e3f0fa",
                            color: "#0d47a1",
                            borderColor: "#1976d2",
                        },
                        fontSize: 15.5,
                        position: "absolute",
                        left: { xs: 8, sm: 28 },
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    Quay lại
                </Button>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <ShoppingCartIcon sx={{ fontSize: 33, color: "#1976d2" }} />
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            color: "#1976d2",
                            px: 2.2,
                            py: 0.7,
                            borderRadius: 5,
                            fontSize: { xs: 21, sm: 27 },
                            bgcolor: "#fff",
                            border: "1.5px solid #bde0fe",
                            boxShadow: "0 2px 8px 0 #bde0fe22",
                            textAlign: "center",
                            minWidth: 160,
                        }}
                    >
                        Thanh Toán Đơn Hàng
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: LIGHT_BLUE_BG, minHeight: "100vh", py: 0 }}>
            {Banner}
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
                                <SizeModalContent
                                    selectedSize={selectedSize}
                                    setSelectedSize={setSelectedSize}
                                    onClose={() => setSizeModalOpen(false)}
                                />
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
                                <ModalCouponContent
                                    onClose={() => setCouponModalOpen(false)}
                                    handleQuickCouponSelect={handleQuickCouponSelect}
                                />
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
            <Footer />
        </Box>
    );
}