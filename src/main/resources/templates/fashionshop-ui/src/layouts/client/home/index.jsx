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
    Divider
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

// Helper: Countdown string (DD:HH:MM:SS)
function useCountdown(targetDate) {
    const calc = () => {
        const now = new Date();
        const diff = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
        const days = Math.floor(diff / (60 * 60 * 24));
        const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
        const mins = Math.floor((diff % (60 * 60)) / 60);
        const secs = diff % 60;
        return { days, hours, mins, secs, finished: diff === 0 };
    };
    const [state, setState] = useState(calc);
    useEffect(() => {
        if (state.finished) return;
        const timer = setInterval(() => setState(calc()), 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, [targetDate, state.finished]);
    return state;
}

export default function HomePage() {
    // Giả sử đợt giảm giá kéo dài tới ngày 15/8/2025, 23:59:59
    const saleEndAt = new Date("2025-08-15T23:59:59");
    const { days, hours, mins, secs, finished } = useCountdown(saleEndAt);

    const bestSelling = [
        {
            name: "SWEATSHIRT SWE",
            price: "369.000",
            sale: "299.000",
            discount: "-19%",
            img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "JACKET SUMMER",
            price: "499.000",
            sale: "429.000",
            discount: "-14%",
            img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "DENIM SHORTS",
            price: "299.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "T-SHIRT BLACK",
            price: "189.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "HOODIE BASIC",
            price: "429.000",
            sale: "359.000",
            discount: "-16%",
            img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "CARGO SHORTS",
            price: "259.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1469398715555-76331e2b1b47?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "TEE LOGO",
            price: "199.000",
            sale: "159.000",
            discount: "-20%",
            img: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "POLO SHIRT",
            price: "299.000",
            sale: "",
            discount: "",
            img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
        },
    ];

    const feedbackImgs = [
        "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    ];

    // Giả sử chương trình mã khuyến mãi hết hạn sau 4 ngày
    const couponExpireDays = 4;
    const couponExpireDate = new Date();
    couponExpireDate.setDate(couponExpireDate.getDate() + couponExpireDays);

    return (
        <Box sx={{ bgcolor: "linear-gradient(180deg,#fafbfc 60%,#f7f3e6 100%)" }}>
            <Header />
            <Slidenav />

            {/* Coupon Section */}
            <Box
                sx={{
                    bgcolor: "#fafbfc",
                    py: 5,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography variant="h4" fontWeight={900} sx={{ mb: 3, color: "#171b22" }}>
                    Mã khuyến mãi
                </Typography>
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        alignItems: "stretch",
                        bgcolor: "#fff",
                        borderRadius: 2.5,
                        minWidth: 340,
                        maxWidth: 480,
                        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
                        overflow: "hidden"
                    }}
                >
                    {/* Left icon */}
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
                    {/* Dashed divider */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            borderRight: "2px dashed #ececec"
                        }}
                    />
                    {/* Coupon content */}
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
                        <Typography sx={{ fontSize: 19, fontWeight: 900, mb: 0.6, color: "#191b23" }}>
                            Giảm 2%
                        </Typography>
                        <Typography sx={{ fontSize: 15.8, color: "#434343", mb: 0.2 }}>
                            Cho đơn hàng tối thiểu 12 sản phẩm
                        </Typography>
                        <Typography sx={{ fontSize: 14.5, color: "#d32f2f", mb: 0.8 }}>
                            Hết hạn trong {couponExpireDays} ngày
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2} mt={1.2}>
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
                                    borderRadius: 1.3,
                                    boxShadow: "none",
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
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Section: Promotion/Features */}
            <Box sx={{ maxWidth: 1240, mx: "auto", mt: 5, mb: 3, px: 2 }}>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={3} sx={{
                            py: 3.5, px: 2.5, textAlign: "center", bgcolor: "#fffbea",
                            borderRadius: 5, height: "100%", boxShadow: "0 6px 32px 0 rgba(255,214,82,0.15)"
                        }}>
                            <img src="/icon-future.svg" width={62} height={62} alt="" style={{ marginBottom: 18 }} />
                            <Typography variant="h6" fontWeight={900} color="#111" sx={{ letterSpacing: 1.1, fontSize: 22 }}>
                                THE FUTURE IS BRIGHT
                            </Typography>
                            <Typography variant="body2" color="#888" sx={{ fontSize: 16, mt: 0.8 }}>
                                BST mới nhất từ SWE
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={3} sx={{
                            py: 3.5, px: 2.5, textAlign: "center", bgcolor: "#e8ffe0",
                            borderRadius: 5, height: "100%", boxShadow: "0 6px 32px 0 rgba(116,236,102,0.09)"
                        }}>
                            <img src="/icon-delivery.svg" width={62} height={62} alt="" style={{ marginBottom: 18 }} />
                            <Typography variant="h6" fontWeight={900} color="#111" sx={{ letterSpacing: 1.1, fontSize: 22 }}>
                                FREESHIP ĐƠN 500K+
                            </Typography>
                            <Typography variant="body2" color="#888" sx={{ fontSize: 16, mt: 0.8 }}>
                                Giao hàng tận nơi, đổi trả 7 ngày
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper elevation={3} sx={{
                            py: 3.5, px: 2.5, textAlign: "center", bgcolor: "#e8f2ff",
                            borderRadius: 5, height: "100%", boxShadow: "0 6px 32px 0 rgba(82,151,255,0.11)"
                        }}>
                            <img src="/icon-hotline.svg" width={62} height={62} alt="" style={{ marginBottom: 18 }} />
                            <Typography variant="h6" fontWeight={900} color="#111" sx={{ letterSpacing: 1.1, fontSize: 22 }}>
                                HOTLINE: 0357 420 420
                            </Typography>
                            <Typography variant="body2" color="#888" sx={{ fontSize: 16, mt: 0.8 }}>
                                Tư vấn miễn phí 24/7
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>



            {/* Flash Sale/Discount Period */}
            <Box sx={{
                maxWidth: 1240,
                mx: "auto",
                mb: 5,
                mt: 1,
                px: 2,
            }}>
                <Alert
                    icon={<AccessTimeFilledIcon fontSize="inherit" />}
                    severity="warning"
                    sx={{
                        borderRadius: 3,
                        fontWeight: 900,
                        mb: 0,
                        fontSize: 20,
                        boxShadow: "0 4px 18px 0 #ffe60022",
                        bgcolor: "linear-gradient(90deg,#ffe600 75%,#ffedb8 100%)",
                        color: "#d32f2f",
                        letterSpacing: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 2.2
                    }}
                >
                    {finished ? (
                        <span>Chương trình giảm giá đã kết thúc!</span>
                    ) : (
                        <>
                            <span style={{ fontWeight: 900, textShadow: "0 1px 8px #fff8" }}>
                                 FLASH SALE TOÀN BỘ SẢN PHẨM ĐẾN HẾT NGÀY 15/08/2025 |
                            </span>
                            <span style={{ marginLeft: 16, fontWeight: 700 }}>
                                Kết thúc sau:&nbsp;
                                <span style={{
                                    color: "#222",
                                    fontWeight: 900,
                                    fontVariantNumeric: "tabular-nums",
                                    textShadow: "0 1px 8px #fff8",
                                    background: "#fff9e1",
                                    px: 2,
                                    borderRadius: 2,
                                    fontSize: 24,
                                }}>
                                    {String(days).padStart(2, "0")}:{String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                                </span>
                            </span>
                        </>
                    )}
                </Alert>
            </Box>

            {/* Section: Best Selling Items */}
            <Box sx={{
                maxWidth: 1240, mx: "auto", mt: 6, px: 2,
                bgcolor: "#fff", borderRadius: 6, boxShadow: "0 6px 32px 0 rgba(255,214,82,0.08)", py: 2.5
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.7, px: 1 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: 1.3 }}>
                        Best Selling Items
                    </Typography>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{
                            bgcolor: "#ffe600", color: "#222", fontWeight: 800, borderRadius: 4, px: 3,
                            fontSize: 18, boxShadow: "0 2px 8px 0 #ffe60022", "&:hover": { bgcolor: "#ffef7a" }
                        }}
                        startIcon={<LocalOfferIcon />}
                    >
                        Xem tất cả
                    </Button>
                </Stack>
                <Grid container spacing={4}>
                    {bestSelling.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 2.2,
                                    textAlign: "center",
                                    borderRadius: 4,
                                    bgcolor: "#fcfcfc",
                                    height: 355,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    transition: "box-shadow 0.2s, transform 0.19s",
                                    position: "relative",
                                    "&:hover": {
                                        boxShadow: "0 12px 48px 0 rgba(255,214,82,0.23)",
                                        transform: "translateY(-8px) scale(1.03)"
                                    },
                                }}
                            >
                                {/* Discount badge */}
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
                                            letterSpacing: 1
                                        }}
                                        size="small"
                                    />
                                )}
                                {/* Sale tag */}
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
                                    component="img"
                                    src={item.img}
                                    alt={item.name}
                                    sx={{
                                        width: "100%",
                                        height: 200,
                                        objectFit: "cover",
                                        mb: 2,
                                        borderRadius: 3,
                                        boxShadow: "0 2px 14px 0 rgba(0,0,0,0.08)",
                                    }}
                                />
                                <Typography fontWeight={800} sx={{ fontSize: 18, mb: 0.5, color: "#222" }}>
                                    {item.name}
                                </Typography>
                                <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center">
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
                                        <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#222" }}>
                                            {item.price}₫
                                        </Typography>
                                    )}
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Section: Feedback (Gallery) */}
            <Box sx={{
                maxWidth: 1240, mx: "auto", mt: 8, mb: 7, px: 2,
                bgcolor: "#fff", borderRadius: 6, boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04)", py: 2.5
            }}>
                <Typography variant="h4" fontWeight={900} sx={{ mb: 2.7, letterSpacing: 1.2 }}>
                    Feedback Gallery
                </Typography>
                <Grid container spacing={3}>
                    {feedbackImgs.map((img, idx) => (
                        <Grid item xs={6} sm={4} md={2.4} key={idx}>
                            <Box
                                component="img"
                                src={img}
                                alt={`Feedback ${idx + 1}`}
                                sx={{
                                    width: "100%",
                                    height: 172,
                                    objectFit: "cover",
                                    borderRadius: 5,
                                    boxShadow: "0 2px 14px 0 rgba(0,0,0,0.13)",
                                    transition: "transform 0.19s, box-shadow 0.19s",
                                    "&:hover": {
                                        transform: "scale(1.10)",
                                        boxShadow: "0 6px 24px 0 rgba(255,230,0,0.21)"
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