import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Button,
    Stack,
    Divider,
    Chip,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import Footer from "../components/footer";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "assets/images/logo4.png";

// --- Styled ---
const CartBlock = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.2),
    borderRadius: 16,
    boxShadow: "0 2px 24px 0 #bde0fe44",
    background: "#fafdff",
    border: "1.5px solid #bde0fe",
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2.5),
    transition: "box-shadow .2s, border-color .2s",
    "&:hover": {
        boxShadow: "0 8px 32px 0 #bde0fe55",
        borderColor: "#1976d2",
    },
}));

export default function CartPage() {
    // Lấy cartId từ localStorage, nếu chưa có thì tạo mới
    const cartId = React.useMemo(() => {
        let cid = localStorage.getItem("cartId");
        if (!cid) {
            cid = "cart-" + Math.random().toString(36).substring(2, 12);
            localStorage.setItem("cartId", cid);
        }
        return cid;
    }, []);
    const [cart, setCart] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();

    // Đồng bộ số lượng badge ở header khi giỏ hàng thay đổi
    const updateCartBadge = (cartArr) => {
        const sum = cartArr.reduce((total, item) => total + (item.qty || 0), 0);
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: sum } }));
    };

    // Fetch cart from API
    useEffect(() => {
        async function fetchCart() {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/cart/${cartId}`);
                const cartData = (res.data || []).map((item, idx) => ({
                    id: item.idChiTietSanPham,
                    name: item.tenSanPham,
                    img: item.hinhAnh && item.hinhAnh.length > 0 ? item.hinhAnh[0] : logoImg,
                    price: item.donGia || 0,
                    oldPrice: item.giaGoc || 0,
                    discount: item.phanTramGiamGia ? `-${item.phanTramGiamGia}%` : "",
                    qty: item.soLuong,
                    size: item.tenKichCo,
                    // code fix: chuẩn hóa mã hex nếu thiếu dấu #
                    color: item.maMau
                        ? (item.maMau.startsWith("#") ? item.maMau : "#" + item.maMau)
                        : "#000",
                    tenMauSac: item.tenMauSac,
                }));
                setCart(cartData);
                setSelected(cartData.map((item) => item.id));
                setSelectAll(cartData.length > 0);
                // Cập nhật badge cart ở header
                updateCartBadge(cartData);
            } catch (err) {
                setCart([]);
                setSelected([]);
                setSelectAll(false);
                updateCartBadge([]);
            }
        }
        fetchCart();
    }, [cartId]);

    // Select/deselect product
    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    // Select/deselect all
    const handleSelectAll = () => {
        if (selected.length === cart.length) {
            setSelected([]);
            setSelectAll(false);
        } else {
            setSelected(cart.map((item) => item.id));
            setSelectAll(true);
        }
    };

    // Remove item (API)
    const handleRemove = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/cart/${cartId}/items/${id}`);
            setCart((prev) => {
                const next = prev.filter((item) => item.id !== id);
                updateCartBadge(next);
                return next;
            });
            setSelected((prev) => prev.filter((sid) => sid !== id));
        } catch (err) {
            // Handle error if needed
        }
    };

    // Change quantity (API)
    const changeQty = async (id, val) => {
        const item = cart.find((i) => i.id === id);
        if (!item) return;
        const newQty = Math.max(1, item.qty + val);
        try {
            const res = await axios.put(`http://localhost:8080/api/v1/cart/update-quantity`, {
                cartId: cartId,
                chiTietSanPhamId: id,
                soLuong: newQty,
            });
            const actualQty = res.data && res.data.soLuong !== undefined ? res.data.soLuong : newQty;
            setCart((prev) => {
                const next = prev.map((item) =>
                    item.id === id
                        ? { ...item, qty: actualQty }
                        : item
                );
                updateCartBadge(next);
                return next;
            });
        } catch (err) {
            // Handle error nếu hết kho hoặc lỗi khác
        }
    };

    // Selected total
    const total = cart
        .filter((item) => selected.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.qty, 0);

    // Sync select all state
    useEffect(() => {
        if (cart.length === 0) {
            setSelected([]);
            setSelectAll(false);
        } else if (selected.length === cart.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [cart, selected]);

    return (
        <Box sx={{ bgcolor: "#edf6fb", minHeight: "100vh" }}>
            {/* Banner */}
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
                            Giỏ Hàng
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            {/* Header */}
            <Box
                sx={{
                    width: "100%",
                    minHeight: 92,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    bgcolor: "linear-gradient(92deg, #e3f0fa 0%, #bde0fe 100%)",
                    px: { xs: 1.5, sm: 6 },
                    py: 2.5,
                    boxShadow: "0 8px 32px 0 #bde0fe33",
                    borderRadius: { xs: "0 0 18px 18px", md: "0 0 36px 36px" },
                    mb: 2,
                    position: "relative"
                }}
            >
                {/* Home button on the left */}
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<HomeIcon />}
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
                    component={RouterLink}
                    to="/home"
                >
                    Về trang chủ
                </Button>
            </Box>

            <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 1, md: 2 }, minHeight: 400, mt: 2 }}>
                {cart.length === 0 ? (
                    <Paper sx={{
                        p: 5,
                        textAlign: "center",
                        mt: 8,
                        bgcolor: "#e3f0fa",
                        borderRadius: 5,
                        border: "1.5px solid #bde0fe"
                    }}>
                        <Typography variant="h5" fontWeight={700} color="#1976d2" gutterBottom>
                            Giỏ hàng của bạn đang trống!
                        </Typography>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/shop"
                            startIcon={<HomeIcon />}
                            sx={{
                                mt: 2.5,
                                fontWeight: 700,
                                borderRadius: 3,
                                px: 2.8,
                                background: "linear-gradient(90deg,#bde0fe 0%,#e3f0fa 100%)",
                                color: "#1976d2",
                                "&:hover": { background: "#1976d2", color: "#fff" },
                            }}
                        >
                            Về cửa hàng
                        </Button>
                    </Paper>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" spacing={1.2} mb={2} ml={0.3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selected.length === cart.length && cart.length > 0}
                                        indeterminate={selected.length > 0 && selected.length < cart.length}
                                        onChange={handleSelectAll}
                                        sx={{
                                            color: "#1976d2",
                                            "&.Mui-checked": { color: "#1976d2" },
                                        }}
                                    />
                                }
                                label={<Typography fontWeight={700} color="#1976d2" fontSize={16}>Chọn tất cả</Typography>}
                            />
                            <Typography color="#888" fontSize={15}>
                                ({selected.length} sản phẩm đã chọn)
                            </Typography>
                        </Stack>
                        {cart.map((item) => (
                            <CartBlock key={item.id}>
                                <Checkbox
                                    checked={selected.includes(item.id)}
                                    onChange={() => handleSelect(item.id)}
                                    sx={{
                                        color: "#1976d2",
                                        "&.Mui-checked": { color: "#1976d2" },
                                        mx: 1
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={item.img}
                                    alt={item.name}
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        borderRadius: 3,
                                        objectFit: "cover",
                                        mr: 2.2,
                                        border: "1.5px solid #bde0fe",
                                        bgcolor: "#e3f0fa"
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight={800} fontSize={18} color="#1769aa">
                                        {item.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                                        <Typography fontWeight={900} fontSize={17} color="#e53935">
                                            {item.price.toLocaleString()}₫
                                        </Typography>
                                        {item.oldPrice > 0 && item.oldPrice !== item.price && (
                                            <Typography
                                                sx={{
                                                    color: "#bde0fe",
                                                    textDecoration: "line-through",
                                                    fontSize: 15.5,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {item.oldPrice.toLocaleString()}₫
                                            </Typography>
                                        )}
                                        {item.discount && (
                                            <Chip
                                                label={item.discount}
                                                color="primary"
                                                sx={{
                                                    fontWeight: 900,
                                                    bgcolor: "#1976d2",
                                                    color: "#fff",
                                                    fontSize: 13.5,
                                                    px: 1.1,
                                                }}
                                                size="small"
                                            />
                                        )}
                                    </Stack>
                                    <Stack direction="row" spacing={2} mt={1.2} alignItems="center">
                                        <Typography color="#888" fontSize={14}>
                                            Size: <b style={{ color: "#1976d2" }}>{item.size}</b>
                                        </Typography>
                                        <Typography color="#888" fontSize={14}>
                                            Màu:{" "}
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: "inline-block",
                                                    width: 17,
                                                    height: 17,
                                                    borderRadius: "50%",
                                                    background: item.color,
                                                    // Nếu màu là trắng thì thêm border cho dễ nhìn
                                                    border: `2px solid ${item.color && item.color.toLowerCase() === "#fff" ? "#bbb" : "#bde0fe"}`,
                                                    ml: 0.5,
                                                    verticalAlign: "middle",
                                                }}
                                            />
                                            {item.tenMauSac ? (
                                                <span style={{
                                                    marginLeft: 8,
                                                    color: "#1769aa",
                                                    fontWeight: 600,
                                                    fontSize: 14
                                                }}>{item.tenMauSac}</span>
                                            ) : null}
                                        </Typography>
                                    </Stack>
                                </Box>
                                {/* Quantity group with - num + */}
                                <Stack spacing={0.7} alignItems="center" sx={{ minWidth: 112 }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                border: "1.5px solid #bde0fe",
                                                color: "#1976d2",
                                                bgcolor: "#e3f0fa",
                                                "&:hover": { bgcolor: "#d1eaff", borderColor: "#1976d2" }
                                            }}
                                            onClick={() => changeQty(item.id, -1)}
                                            disabled={item.qty <= 1}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography
                                            sx={{
                                                width: 32,
                                                textAlign: "center",
                                                fontWeight: 700,
                                                fontSize: 16,
                                                mx: 0.5,
                                                color: "#1976d2",
                                                bgcolor: "#fff",
                                                border: "1.5px solid #bde0fe",
                                                borderRadius: 1.2,
                                                lineHeight: "36px"
                                            }}
                                        >
                                            {item.qty}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                border: "1.5px solid #bde0fe",
                                                color: "#1976d2",
                                                bgcolor: "#e3f0fa",
                                                "&:hover": { bgcolor: "#d1eaff", borderColor: "#1976d2" }
                                            }}
                                            onClick={() => changeQty(item.id, 1)}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                    <Typography color="#777" fontSize={13}>
                                        SL
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemove(item.id)}
                                        title="Xóa khỏi giỏ"
                                        sx={{
                                            bgcolor: "#fff",
                                            border: "1.5px solid #bde0fe",
                                            mt: 1,
                                            "&:hover": { bgcolor: "#e3f0fa", borderColor: "#e53935", color: "#e53935" },
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </CartBlock>
                        ))}
                        <Divider sx={{ my: 4 }} />
                        <Paper sx={{
                            p: 3,
                            borderRadius: 5,
                            bgcolor: "#e3f0fa",
                            border: "1.5px solid #bde0fe",
                            maxWidth: 420,
                            ml: "auto",
                            boxShadow: "0 2px 12px 0 #bde0fe33"
                        }}>
                            <Stack direction="row" justifyContent="space-between" mb={1.2}>
                                <Typography fontWeight={700} color="#1769aa" fontSize={17}>
                                    Tổng tiền:
                                </Typography>
                                <Typography fontWeight={900} color="#e53935" fontSize={18}>
                                    {total.toLocaleString()}₫
                                </Typography>
                            </Stack>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={selected.length === 0}
                                sx={{
                                    mt: 2,
                                    fontWeight: 900,
                                    fontSize: 17,
                                    borderRadius: 2.5,
                                    background: "linear-gradient(90deg,#1976d2 0%,#bde0fe 100%)",
                                    color: "#fff",
                                    py: 1.2,
                                    "&:hover": { background: "#1769aa", color: "#fff" }
                                }}
                                onClick={() => {
                                    navigate("/order");
                                }}
                            >
                                Tiến hành đặt hàng ({selected.length})
                            </Button>
                        </Paper>
                    </>
                )}
            </Box>
            <Box mt={8}>
                <Footer />
            </Box>
        </Box>
    );
}