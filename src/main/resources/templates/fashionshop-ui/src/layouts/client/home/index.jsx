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
    Alert,
    Divider,
    IconButton,
    useTheme,
    Rating
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

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
    const saleEndAt = new Date("2025-08-15T23:59:59");
    const { days, hours, minutes, seconds, finished } = useCountdown(saleEndAt);

    const bestSelling = [
        {
            name: "SWEATSHIRT SWE",
            price: "369.000",
            sale: "299.000",
            discount: "-19%",
            img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
            rating: 4.5
        },
        {
            name: "JACKET SUMMER",
            price: "499.000",
            sale: "429.000",
            discount: "-14%",
            img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
            rating: 4.2
        },
        {
            name: "DENIM SHORTS",
            price: "299.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
            rating: 3.8
        },
        {
            name: "T-SHIRT BLACK",
            price: "189.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
            rating: 4.0
        },
        {
            name: "HOODIE BASIC",
            price: "429.000",
            sale: "359.000",
            discount: "-16%",
            img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
            rating: 4.7
        },
        {
            name: "CARGO SHORTS",
            price: "259.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1469398715555-76331e2b1b47?auto=format&fit=crop&w=600&q=80",
            rating: 3.6
        },
        {
            name: "TEE LOGO",
            price: "199.000",
            sale: "159.000",
            discount: "-20%",
            img: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=600&q=80",
            rating: 4.8
        },
        {
            name: "POLO SHIRT",
            price: "299.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
            rating: 4.1
        }
    ];

    const feedbackImgs = [
        "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ];

    const couponExpireDays = 4;
    const couponExpireDate = new Date();
    couponExpireDate.setDate(couponExpireDate.getDate() + couponExpireDays);

    const [favoriteIndexes, setFavoriteIndexes] = useState([]);
    const [ratings, setRatings] = useState(
        bestSelling.map(item => item.rating || 4)
    );

    const handleToggleFavorite = (index) => {
        setFavoriteIndexes((previousIndexes) =>
            previousIndexes.includes(index)
                ? previousIndexes.filter(i => i !== index)
                : [...previousIndexes, index]
        );
    };

    const handleAddToCart = (item) => {
        alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
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
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        alignItems: "stretch",
                        bgcolor: "#fff",
                        borderRadius: 3,
                        minWidth: 340,
                        maxWidth: 470,
                        boxShadow: "0 4px 22px 0 #bde0fe26",
                        overflow: "hidden",
                        border: "1.5px solid #e3f0fa"
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: "#ffa750",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 92,
                            px: 1,
                            py: 3,
                            flexDirection: "column",
                            gap: 1.5
                        }}
                    >
                        <CardGiftcardIcon sx={{ color: "#fff", fontSize: 44 }} />
                    </Box>
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            borderRight: "2px dashed #ececec"
                        }}
                    />
                    <Box
                        sx={{
                            flex: 1,
                            px: 2.5,
                            py: 2.5,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}
                    >
                        <Typography sx={{ fontSize: 21, fontWeight: 900, mb: 0.6, color: "#191b23", letterSpacing: 1.2 }}>
                            Giảm 2%
                        </Typography>
                        <Typography sx={{ fontSize: 15.5, color: "#434343", mb: 0.2 }}>
                            Cho đơn hàng tối thiểu 12 sản phẩm
                        </Typography>
                        <Typography sx={{ fontSize: 14.2, color: "#e53935", mb: 0.8, fontWeight: 700 }}>
                            Hết hạn trong {couponExpireDays} ngày
                        </Typography>
                        <Stack direction="row" spacing={2} mt={1.2}>
                            <Button
                                variant="text"
                                sx={{
                                    color: "#1976d2",
                                    fontWeight: 700,
                                    fontSize: 15.5,
                                    minWidth: 0,
                                    px: 0,
                                    textTransform: "none"
                                }}
                            >
                                Chi tiết
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: "#191b23",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 17,
                                    px: 3,
                                    borderRadius: 2,
                                    boxShadow: "0 2px 10px 0 #191b2316",
                                    textTransform: "none",
                                    "&:hover": {
                                        bgcolor: "#23252c"
                                    }
                                }}
                                onClick={() => {
                                    navigator.clipboard.writeText("SALE2%12SP");
                                }}
                            >
                                Sao chép
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
            <Box sx={{
                maxWidth: 1240, mx: "auto", mt: 6, px: 2,
                bgcolor: "#fff", borderRadius: 7, boxShadow: "0 10px 36px 0 #ffe6000c", py: 2.5
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.7, px: 1 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: 1.3 }}>
                        Best Selling Items
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
                <Grid container spacing={4} alignItems="stretch">
                    {bestSelling.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 2.2,
                                    textAlign: "center",
                                    borderRadius: 5,
                                    bgcolor: "#fcfcfc",
                                    height: 420,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    transition: "box-shadow 0.22s, transform 0.19s",
                                    position: "relative",
                                    "&:hover": {
                                        boxShadow: "0 12px 48px 0 #ffe60033",
                                        transform: "translateY(-8px) scale(1.03)"
                                    }
                                }}
                            >
                                {item.discount && (
                                    <Chip
                                        label={item.discount}
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
                                {item.sale && (
                                    <Tooltip title="Đang giảm giá!" arrow>
                                        <Chip
                                            icon={<LocalOfferIcon sx={{ fontSize: 20, color: "#fff" }} />}
                                            label="SALE"
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
                                        component="img"
                                        src={item.img}
                                        alt={item.name}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />
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
                                    {item.sale ? (
                                        <>
                                            <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#e53935" }}>
                                                {item.sale}₫
                                            </Typography>
                                            <Typography sx={{ color: "#aaa", textDecoration: "line-through", fontSize: 16, fontWeight: 600 }}>
                                                {item.price}₫
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#205072" }}>
                                            {item.price}₫
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
                                            onClick={() => handleToggleFavorite(index)}
                                        >
                                            {favoriteIndexes.includes(index) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Thêm vào giỏ hàng">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<ShoppingCartIcon />}
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: 3,
                                                px: 2.2,
                                                fontSize: 15,
                                                boxShadow: "0 2px 8px 0 #bde0fe33",
                                                background: "#6cacec",
                                                "&:hover": { background: "#205072" }
                                            }}
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            Thêm vào giỏ
                                        </Button>
                                    </Tooltip>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{
                maxWidth: 1240, mx: "auto", mt: 8, mb: 7, px: 2,
                bgcolor: "#fff", borderRadius: 7, boxShadow: "0 4px 18px 0 #bde0fe26", py: 2.5
            }}>
                <Typography variant="h4" fontWeight={900} sx={{ mb: 2.7, letterSpacing: 1.2 }}>
                    Feedback Gallery
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