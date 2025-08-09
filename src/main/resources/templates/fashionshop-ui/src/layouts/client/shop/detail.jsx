import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Stack,
    Button,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Rating,
    Breadcrumbs,
    Link as MuiLink,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Header from "../components/header";
import Footer from "../components/footer";

// Thay bộ ảnh mới (Unsplash) đảm bảo load được
const product = {
    name: "SWE VIRGIN TEE - CREAM",
    price: "299.000",
    sale: "249.000",
    discount: "-17%",
    images: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
    ],
    colors: [
        { name: "Cream", value: "#f5f5dc" },
        { name: "Black", value: "#222" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    sold: 120,
    description: `- Chất liệu: 100% cotton nhập khẩu
- Vải dày dặn, thoáng khí, không bai dão, không xù lông
- Form dáng: Oversize, unisex
- Hoạ tiết thêu sắc nét, bền màu
- Sản xuất tại Việt Nam
- Hướng dẫn bảo quản: Giặt với nước lạnh, không ngâm lâu, không dùng thuốc tẩy
- Hạn chế sấy, ủi ở nhiệt độ thấp
- Hình ảnh thực tế 100%`,
    shipping: "Miễn phí vận chuyển cho đơn hàng từ 500k",
    voucher: {
        code: "SALE5OFF",
        percent: 5,
        min: "399.000",
        expire: "Còn 3 ngày"
    },
    // Đổi ảnh size guide thành 1 ảnh Unsplash demo
    detailImg: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80"
};

const relatedProducts = [
    {
        name: "SWE VIRGIN TEE - WHITE",
        img: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        rating: 4.6
    },
    {
        name: "SWE VIRGIN TEE - SKY",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        rating: 4.8
    },
    {
        name: "SWE VIRGIN TEE - BLACK",
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        rating: 4.9
    },
    {
        name: "SWE VIRGIN TEE - NAVY",
        img: "https://images.unsplash.com/photo-1469398715555-76331e2b1b47?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        rating: 4.7
    },
    {
        name: "SWE PLAY TEE - BLACK",
        img: "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        rating: 4.5
    },
];

export default function ProductDetail() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
    const [quantity, setQuantity] = useState(1);
    const [favorite, setFavorite] = useState(false);

    return (
        <Box sx={{ bgcolor: "#f9fbfc" }}>
            <Header />

            <Box sx={{ maxWidth: 1320, mx: "auto", px: 2, pt: 2 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ fontSize: 14, mb: 2 }}
                >
                    <MuiLink underline="hover" color="inherit" href="/">Trang chủ</MuiLink>
                    <MuiLink underline="hover" color="inherit" href="/shop">Sản phẩm</MuiLink>
                    <Typography color="text.primary">{product.name}</Typography>
                </Breadcrumbs>
            </Box>

            <Box sx={{ maxWidth: 1320, mx: "auto", px: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Stack direction="row" spacing={2}>
                            <Stack spacing={1} sx={{ mt: 0.5 }}>
                                {product.images.map((img, idx) => (
                                    <Box
                                        key={img}
                                        component="img"
                                        src={img}
                                        alt={`thumb-${idx}`}
                                        sx={{
                                            width: 58,
                                            height: 58,
                                            objectFit: "cover",
                                            borderRadius: 2,
                                            border: selectedImage === idx ? "2.5px solid #1976d2" : "1.5px solid #e3f0fa",
                                            boxShadow: selectedImage === idx ? "0 2px 8px #1976d233" : "none",
                                            cursor: "pointer",
                                            transition: "all .16s",
                                            bgcolor: "#fafafa"
                                        }}
                                        onClick={() => setSelectedImage(idx)}
                                    />
                                ))}
                            </Stack>
                            <Box
                                sx={{
                                    flex: 1,
                                    bgcolor: "#fff",
                                    borderRadius: 3,
                                    minHeight: 440,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1.5px solid #e3f0fa",
                                    boxShadow: "0 2px 18px 0 #bde0fe22",
                                    p: 2,
                                    position: "relative"
                                }}
                            >
                                <Box
                                    component="img"
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 400,
                                        maxHeight: 430,
                                        objectFit: "contain",
                                        display: "block",
                                        mx: "auto"
                                    }}
                                />
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1.7 }}>
                            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 0.7, mb: 0.5 }}>
                                {product.name}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Rating value={product.rating} precision={0.1} size="small" readOnly />
                                <Typography sx={{ color: "#888", fontSize: 15 }}>({product.sold} đã bán)</Typography>
                            </Stack>
                        </Box>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                            <Typography variant="h5" fontWeight={900} sx={{ color: "#e53935" }}>
                                {product.sale}₫
                            </Typography>
                            <Typography sx={{ color: "#aaa", textDecoration: "line-through", fontSize: 17, fontWeight: 700 }}>
                                {product.price}₫
                            </Typography>
                            <Chip
                                label={product.discount}
                                color="error"
                                sx={{
                                    fontWeight: 900,
                                    bgcolor: "#ff5252",
                                    color: "#fff",
                                    fontSize: 15,
                                    px: 1.2,
                                    letterSpacing: 1
                                }}
                                size="small"
                            />
                        </Stack>
                        <Divider sx={{ mb: 2 }} />

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Typography sx={{ minWidth: 54, fontWeight: 500 }}>Màu:</Typography>
                            <Stack direction="row" spacing={1.2}>
                                {product.colors.map((color) => (
                                    <Tooltip title={color.name} key={color.value}>
                                        <IconButton
                                            sx={{
                                                border: selectedColor.value === color.value ? "2.5px solid #1976d2" : "2px solid #eee",
                                                bgcolor: color.value,
                                                width: 32,
                                                height: 32,
                                                transition: "border 0.15s",
                                                boxShadow: selectedColor.value === color.value ? "0 2px 8px 0 #1976d299" : "none"
                                            }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    </Tooltip>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Typography sx={{ minWidth: 54, fontWeight: 500 }}>Size:</Typography>
                            <FormControl size="small" sx={{ minWidth: 90 }}>
                                <InputLabel>Chọn size</InputLabel>
                                <Select
                                    value={selectedSize}
                                    label="Chọn size"
                                    onChange={e => setSelectedSize(e.target.value)}
                                >
                                    {product.sizes.map(size => (
                                        <MenuItem value={size} key={size}>{size}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography sx={{ color: "#1976d2", fontSize: 14, ml: 1, fontWeight: 500, cursor: "pointer" }}>
                                Hướng dẫn chọn size
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                            <Typography sx={{ minWidth: 54, fontWeight: 500 }}>Số lượng:</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Button variant="outlined" size="small" sx={{ minWidth: 32, px: 0 }} onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                                <Typography sx={{ minWidth: 32, textAlign: "center" }}>{quantity}</Typography>
                                <Button variant="outlined" size="small" sx={{ minWidth: 32, px: 0 }} onClick={() => setQuantity(q => q + 1)}>+</Button>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<ShoppingCartIcon />}
                                sx={{
                                    fontWeight: 800,
                                    borderRadius: 3,
                                    px: 3.5,
                                    fontSize: 16.5,
                                    boxShadow: "0 2px 10px 0 #e539351a"
                                }}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <Tooltip title={favorite ? "Bỏ yêu thích" : "Yêu thích"}>
                                <IconButton
                                    sx={{
                                        color: favorite ? "#e53935" : "#bbb",
                                        border: favorite ? "2px solid #e53935" : "2px solid #ececec",
                                        bgcolor: "#fff",
                                        borderRadius: "50%",
                                        boxShadow: favorite ? "0 4px 16px #ffe6e6" : "none",
                                        "&:hover": {
                                            color: "#e53935",
                                            border: "2px solid #e53935",
                                            background: "#ffe6e6"
                                        },
                                        transition: "all 0.15s"
                                    }}
                                    onClick={() => setFavorite(fav => !fav)}
                                >
                                    {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: "#fff7f7",
                                border: "1.5px solid #ffe0e6",
                                borderRadius: 3,
                                px: 2.5,
                                py: 1.7,
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 2
                            }}
                        >
                            <LocalOfferIcon sx={{ color: "#e53935", fontSize: 28 }} />
                            <Box flex={1}>
                                <Typography sx={{ fontWeight: 700, color: "#e53935", fontSize: 16 }}>
                                    {product.voucher.percent}% GIẢM
                                </Typography>
                                <Typography sx={{ color: "#222", fontSize: 14.5 }}>
                                    Đơn tối thiểu {product.voucher.min} &nbsp;
                                    <Chip label={product.voucher.expire} size="small" sx={{ bgcolor: "#ffe6e6", color: "#e53935", ml: 1 }} />
                                </Typography>
                                <Typography sx={{ color: "#888", fontSize: 13, mt: 0.3 }}>Mã: <b>{product.voucher.code}</b></Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    px: 2,
                                    fontSize: 15,
                                    bgcolor: "#fff",
                                    "&:hover": { bgcolor: "#ffe6e6", borderColor: "#e53935" }
                                }}
                                onClick={() => navigator.clipboard.writeText(product.voucher.code)}
                            >
                                Sao chép mã
                            </Button>
                        </Paper>
                        <Alert severity="info" sx={{ bgcolor: "#f3fafd", border: "1.5px solid #bde0fe", color: "#205072", borderRadius: 2.5, mb: 2 }}>
                            {product.shipping}
                        </Alert>
                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.2 }}>Mô tả sản phẩm</Typography>
                        <Typography sx={{ whiteSpace: "pre-line", color: "#222", fontSize: 15.5 }}>
                            {product.description}
                        </Typography>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 5, textAlign: "center" }}>
                    <Box
                        component="img"
                        src={product.detailImg}
                        alt="size guide"
                        sx={{
                            width: { xs: "100%", md: 400 },
                            borderRadius: 3,
                            boxShadow: "0 2px 10px 0 #bde0fe22",
                            border: "1.5px solid #e3f0fa",
                            mb: 2
                        }}
                    />
                </Box>
            </Box>
            <Box sx={{ maxWidth: 1320, mx: "auto", px: 2, mt: 8 }}>
                <Typography variant="h5" fontWeight={900} sx={{ mb: 2.7, letterSpacing: 1.2 }}>
                    Sản phẩm liên quan
                </Typography>
                <Grid container spacing={3}>
                    {relatedProducts.map((item, idx) => (
                        <Grid item xs={6} sm={4} md={2.4} key={idx}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 1.5,
                                    textAlign: "center",
                                    borderRadius: 4,
                                    bgcolor: "#fff",
                                    height: 255,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    boxShadow: "0 2px 14px 0 #bde0fe22",
                                    border: "1.5px solid #e3f0fa",
                                    transition: "box-shadow 0.18s, transform 0.16s",
                                    "&:hover": {
                                        boxShadow: "0 8px 32px 0 #bde0fe33",
                                        border: "1.5px solid #1976d2",
                                        transform: "translateY(-5px) scale(1.04)"
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.img}
                                    alt={item.name}
                                    sx={{
                                        width: "100%",
                                        height: 118,
                                        objectFit: "cover",
                                        borderRadius: 3,
                                        mb: 1.2
                                    }}
                                />
                                <Typography fontWeight={700} sx={{ fontSize: 15, mb: 0.5, color: "#205072", letterSpacing: 0.2 }}>
                                    {item.name}
                                </Typography>
                                <Rating value={item.rating} precision={0.1} size="small" readOnly sx={{ mb: 0.6 }} />
                                <Typography sx={{ fontWeight: 900, fontSize: 15.5, color: "#e53935" }}>
                                    {item.price}₫
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box mt={8}>
                <Footer />
            </Box>
        </Box>
    );
}