import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Slidenav from "../components/slidenav";
import Footer from "../components/footer";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Stack,
    Button,
    Chip,
    Tooltip,
    Divider,
    IconButton,
    useTheme,
    Rating,
    CircularProgress,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VoucherList from"./VoucherList"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import ProductSlideshow from "../../admin/BanHangTaiQuay/component/ProductSlideshow";
function useCountdown(targetDate) {
    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
        const days = Math.floor(difference / (60 * 60 * 24));
        const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((difference % (60 * 60)) / 60);
        const seconds = difference % 60;
        return { days, hours, minutes, seconds, finished: difference === 0 };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
    useEffect(() => {
        if (timeLeft.finished) {
            return;
        }
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDate, timeLeft.finished]);
    return timeLeft;
}

export default function HomePage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const saleEndAt = new Date("2025-08-15T23:59:59");
    const { days, hours, minutes, seconds, finished } = useCountdown(saleEndAt);

    const [bestSelling, setBestSelling] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteIndexes, setFavoriteIndexes] = useState([]);
    const [ratings, setRatings] = useState([]);

    // Fake feedback images (giữ nguyên, hoặc lấy từ API nếu muốn)
    const feedbackImgs = [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ];

    const couponExpireDays = 4;
    const couponExpireDate = new Date();
    couponExpireDate.setDate(couponExpireDate.getDate() + couponExpireDays);

    // Fetch API danh sách sản phẩm bán chạy
    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:8080/api/home/best-selling?limit=8", { withCredentials: true })
            .then(res => {
                setBestSelling(res.data || []);
                setRatings(res.data ? res.data.map(item => item.rating || 4) : []);
                setLoading(false);
            })
            .catch(() => {
                setBestSelling([]);
                setRatings([]);
                setLoading(false);
            });
    }, []);

    const handleToggleFavorite = (index) => {
        setFavoriteIndexes((previousIndexes) =>
            previousIndexes.includes(index)
                ? previousIndexes.filter(i => i !== index)
                : [...previousIndexes, index]
        );
    };

    // Sửa lại: Mua ngay sẽ chuyển sang trang chi tiết sản phẩm cha
    const handleAddToCart = (item) => {
        // Nếu item.id là id sản phẩm cha thì điều hướng sang trang detail
        navigate(`/shop/detail/${item.id}`);
    };

    const handleChangeRating = (index, value) => {
        setRatings(previousRatings => previousRatings.map((rating, i) => (i === index ? value : rating)));
    };

    return (
        <Box sx={{ bgcolor: "linear-gradient(180deg,#f9fbfc 70%,#f5f4ee 100%)" }}>
            <Header />
            <Box sx={{ maxWidth: 1260, mx: "auto", pt: 2.5, px: { xs: 0, md: 2 } }}>
                <Slidenav />
            </Box>
            {/* Coupon section giữ nguyên */}
            <Box
                sx={{
                    bgcolor: "#f9fbfc",
                    py: 5,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography variant="h4" fontWeight={900} sx={{ mb: 2.3, color: "#171b22", letterSpacing: 1.1 }}>
                    Mã khuyến mãi
                </Typography>
                
              <Box sx={{ width: '100%', maxWidth: '470px' }}> {/* Bọc VoucherList lại */}
    <VoucherList/>
</Box>
            </Box>
            {/* Best selling products */}
            <Box sx={{
                maxWidth: 1240, mx: "auto", mt: 6, px: 2,
                bgcolor: "#fff", borderRadius: 7, boxShadow: "0 10px 36px 0 #ffe6000c", py: 2.5
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.7, px: 1 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: 1.3 }}>
                        Các mặt hàng bán chạy nhất
                    </Typography>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{
                            bgcolor: "#ffe600", color: "#222", fontWeight: 800, borderRadius: 5, px: 3,
                            fontSize: 18, boxShadow: "0 2px 8px 0 #ffe60026", "&:hover": { bgcolor: "#ffef7a" }
                        }}
                        startIcon={<LocalOfferIcon />}
                    >
                        Xem tất cả
                    </Button>
                </Stack>
                {loading ? (
                    <Stack alignItems="center" py={8}>
                        <CircularProgress />
                    </Stack>
                ) : (
                    <Grid container spacing={4} alignItems="stretch">
                        {bestSelling.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper
                                    elevation={4}
                                   sx={{
                                                p: 2.2,
                                                textAlign: "center",
                                                borderRadius: 6,
                                                bgcolor: "#fff",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                position: "relative",
                                                border: "1.5px solid #e3f0fa",
                                                transition: "box-shadow 0.22s, transform 0.18s",
                                                "&:hover": {
                                                    boxShadow: "0 10px 36px 0 #bde0fe44",
                                                    border: "1.5px solid #1976d2",
                                                    transform: "translateY(-8px) scale(1.03)"
                                                }
                                            }}
                                    onClick={() => navigate(`/shop/detail/${item.id}`)}
                                >
                                    {item.discountPercent && (
                                        <Chip
                                            label={item.discountPercent}
                                            color="error"
                                            sx={{
                                                position: "absolute",
                                                top: 18,
                                                left: 18,
                                                fontWeight: 900,
                                                bgcolor: "#ff5252",
                                                color: "#fff",
                                                fontSize: 15,
                                                px: 1.2,
                                                zIndex: 3,
                                                letterSpacing: 1,
                                                boxShadow: "0 2px 8px 0 #ff525299"
                                            }}
                                            size="small"
                                        />
                                    )}
                                    {item.salePrice && (
                                        <Tooltip title="Đang giảm giá!" arrow>
                                            <Chip
                                                icon={<LocalOfferIcon sx={{ fontSize: 20, color: "#fff" }} />}
                                                label="Khuyến mãi"
                                                sx={{
                                                    position: "absolute",
                                                    top: 18,
                                                    right: 18,
                                                    bgcolor: "#ffe600",
                                                    color: "#e53935",
                                                    fontWeight: 900,
                                                    fontSize: 17,
                                                    px: 1,
                                                    zIndex: 3,
                                                    boxShadow: "0 2px 12px 0 #ffe60055"
                                                }}
                                                size="medium"
                                            />
                                        </Tooltip>
                                    )}
                                    <Box
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4/3",
                                            mb: 2,
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            boxShadow: "0 2px 12px 0 #bde0fe22",
                                            border: "1.5px solid #e3f0fa",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f6f6f6"
                                        }}
                                    >
                                        <Box
                                            // component="img"
                                            // src={item.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"}
                                            // alt={item.name}
                                            // sx={{
                                            //     width: "100%",
                                            //     height: "100%",
                                            //     objectFit: "cover",
                                            //     display: "block"
                                            // }}
                                        />
                                         <ProductSlideshow product={{ listUrlImage: item.imageUrl }} sx={{
                                            width: "100%",
                                            height: "100%",
                                          }} />
                                    </Box>
                                    <Typography fontWeight={800} sx={{ fontSize: 18, mb: 0.5, color: "#205072", letterSpacing: 0.5 }}>
                                        {item.name}
                                    </Typography>
                                    <Rating
                                        size="small"
                                        precision={0.5}
                                        value={ratings[index]}
                                        sx={{ mb: 0.5 }}
                                        onChange={(_, value) => handleChangeRating(index, value)}
                                    />
                                    <Stack
                                        direction="row"
                                        spacing={1.2}
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{ mb: 1 }}
                                    >
                                        {item.salePrice ? (
                                            <>
                                                <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#e53935" }}>
                                                    {item.salePrice.toLocaleString("vi-VN")}₫
                                                </Typography>
                                                <Typography sx={{ color: "#aaa", textDecoration: "line-through", fontSize: 16, fontWeight: 600 }}>
                                                    {/* Nếu có khoảng giá */}
                                                    {item.priceMin && item.priceMax && item.priceMin !== item.priceMax
                                                        ? `${item.priceMin.toLocaleString("vi-VN")}₫ - ${item.priceMax.toLocaleString("vi-VN")}₫`
                                                        : item.price?.toLocaleString("vi-VN") + "₫"}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#205072" }}>
                                                {/* Nếu có khoảng giá */}
                                                {item.priceMin && item.priceMax && item.priceMin !== item.priceMax
                                                    ? `${item.priceMin.toLocaleString("vi-VN")}₫ - ${item.priceMax.toLocaleString("vi-VN")}₫`
                                                    : item.price?.toLocaleString("vi-VN") + "₫"}
                                            </Typography>
                                        )}
                                    </Stack>
                                    <Stack direction="row" justifyContent="center" spacing={2}>
                                        <Tooltip title={favoriteIndexes.includes(index) ? "Bỏ yêu thích" : "Yêu thích"}>
                                            <IconButton
                                                sx={{
                                                    color: favoriteIndexes.includes(index) ? "#e53935" : "#bbb",
                                                    border: favoriteIndexes.includes(index) ? "2px solid #e53935" : "2px solid #ececec",
                                                    bgcolor: "#fff",
                                                    borderRadius: "50%",
                                                    boxShadow: favoriteIndexes.includes(index) ? "0 4px 16px #ffe6e6" : "none",
                                                    "&:hover": {
                                                        color: "#e53935",
                                                        border: "2px solid #e53935",
                                                        background: "#ffe6e6"
                                                    },
                                                    transition: "all 0.15s"
                                                }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleToggleFavorite(index);
                                                }}
                                            >
                                                {favoriteIndexes.includes(index) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Mua ngay">
                                            <Button
                                                variant="contained"
                                                            color="primary"
                                                            startIcon={<ShoppingCartIcon />}
                                                            sx={{
                                                                fontWeight: 700,
                                                                borderRadius: 3,
                                                                px: 2.2,
                                                                fontSize: 12,
                                                                boxShadow: "0 2px 8px 0 #bde0fe33",
                                                                background: "#6cacec",
                                                                 color: '#fff',
                                                                "&:hover": { background: "#49a3f1" }
                                                            }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleAddToCart(item); // chuyển sang trang chi tiết sản phẩm cha
                                                }}
                                            >
                                                Mua ngay
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
            {/* Feedback section giữ nguyên */}
            <Box sx={{
                maxWidth: 1240, mx: "auto", mt: 8, mb: 7, px: 2,
                bgcolor: "#fff", borderRadius: 7, boxShadow: "0 4px 18px 0 #bde0fe26", py: 2.5
            }}>
                <Typography variant="h4" fontWeight={900} sx={{ mb: 2.7, letterSpacing: 1.2 }}>
                    Phản hồi của khách hàng
                </Typography>
                <Grid container spacing={3}>
                    {feedbackImgs.map((img, index) => (
                        <Grid item xs={6} sm={4} md={2.4} key={index}>
                            <Box
                                component="img"
                                src={img}
                                alt={`Feedback ${index + 1}`}
                                sx={{
                                    width: "100%",
                                    height: 172,
                                    objectFit: "cover",
                                    borderRadius: 6,
                                    boxShadow: "0 2px 14px 0 #bde0fe22",
                                    border: "1.5px solid #e3f0fa",
                                    transition: "transform 0.19s, box-shadow 0.19s",
                                    "&:hover": {
                                        transform: "scale(1.10)",
                                        boxShadow: "0 6px 24px 0 #ffe60044"
                                    }
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Footer />
        </Box>
    );
}