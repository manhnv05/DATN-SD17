import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Stack,
    Button,
    Chip,
    Divider,
    Tooltip,
    IconButton,
    Rating,
    useMediaQuery
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/material/styles";

// Dummy data: các sản phẩm đang sale cực mạnh
const outletProducts = [
    {
        name: "DENIM JACKET OUTLET",
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        oldPrice: "799.000",
        salePrice: "299.000",
        discount: "-63%"
    },
    {
        name: "OUTLET TEE BASIC",
        img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
        oldPrice: "349.000",
        salePrice: "119.000",
        discount: "-66%"
    },
    {
        name: "OUTLET HOODIE",
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
        oldPrice: "599.000",
        salePrice: "249.000",
        discount: "-58%"
    },
    {
        name: "OUTLET SHORTS",
        img: "https://images.unsplash.com/photo-1469398715555-76331e2b1b47?auto=format&fit=crop&w=400&q=80",
        oldPrice: "259.000",
        salePrice: "99.000",
        discount: "-62%"
    },
    {
        name: "OUTLET JEANS",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        oldPrice: "499.000",
        salePrice: "199.000",
        discount: "-60%"
    },
    {
        name: "OUTLET POLO SHIRT",
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        oldPrice: "299.000",
        salePrice: "99.000",
        discount: "-67%"
    }
    // ...bạn có thể thêm sản phẩm outlet khác
];

const OutletBlock = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderRadius: 18,
    boxShadow: "0 4px 24px 0 #bde0fe22",
    background: "#fff",
    border: "1.5px solid #e3f0fa",
    position: "relative",
    height: 410,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
}));

export default function OutletSalePage() {
    const isMobile = useMediaQuery("(max-width:900px)");
    const [favoriteIndexes, setFavoriteIndexes] = useState([]);
    const [cartIndexes, setCartIndexes] = useState([]);
    const [ratings, setRatings] = useState(outletProducts.map(() => 4));

    const handleToggleFavorite = (index) => {
        setFavoriteIndexes((prev) =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleAddToCart = (index) => {
        setCartIndexes((prev) =>
            prev.includes(index)
                ? prev
                : [...prev, index]
        );
    };

    const handleChangeRating = (index, value) => {
        setRatings(prev => prev.map((r, i) => (i === index ? value : r)));
    };

    return (
        <Box sx={{ bgcolor: "#f7fafc", minHeight: "100vh" }}>
            <Header />
            <Box
                sx={{
                    width: "100%",
                    height: 160,
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    mt: 2,
                    background: "linear-gradient(90deg,#ffe259 0%,#ffa751 100%)",
                    borderRadius: { xs: "0 0 18px 18px", md: "0 0 36px 36px" },
                    boxShadow: "0 8px 32px 0 #ffd58033"
                }}
            >
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    fontWeight={900}
                    sx={{
                        color: "#b71c1c",
                        letterSpacing: 1.5,
                        textShadow: "0 3px 20px #fff6",
                        bgcolor: "rgba(255,255,255,0.82)",
                        px: isMobile ? 3 : 7,
                        py: 1.2,
                        borderRadius: 8,
                        border: "1.5px solid #ffe259"
                    }}
                >
                    OUTLET SALE - GIẢM GIÁ CỰC SỐC
                </Typography>
            </Box>

            <Box sx={{ maxWidth: 1220, mx: "auto", px: { xs: 1, md: 3 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: { xs: 2, md: 3 },
                        borderRadius: 4,
                        background: "#fffbe6",
                        border: "1.5px solid #ffe259",
                        textAlign: "center"
                    }}
                >
                    <Typography variant="h5" fontWeight={800} color="#b71c1c" sx={{ letterSpacing: 1.2 }}>
                        ⚡ Chỉ áp dụng cho các sản phẩm outlet, số lượng cực giới hạn!
                    </Typography>
                    <Typography sx={{ mt: 0.8, color: "#a67c00", fontSize: 17, fontWeight: 700 }}>
                        Sản phẩm không đổi trả, không áp dụng cùng các khuyến mãi khác.
                    </Typography>
                </Paper>
                <Grid container spacing={4}>
                    {outletProducts.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <OutletBlock>
                                {/* Giảm giá lớn */}
                                <Chip
                                    label={item.discount}
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        top: 18,
                                        left: 18,
                                        fontWeight: 900,
                                        bgcolor: "#e53935",
                                        color: "#fff",
                                        fontSize: 15,
                                        px: 1.4,
                                        zIndex: 3,
                                        letterSpacing: 1,
                                        boxShadow: "0 2px 8px 0 #ff525288"
                                    }}
                                    size="small"
                                />
                                <Chip
                                    label="OUTLET"
                                    sx={{
                                        position: "absolute",
                                        top: 18,
                                        right: 18,
                                        bgcolor: "#ffd600",
                                        color: "#e53935",
                                        fontWeight: 900,
                                        fontSize: 15,
                                        px: 1.3,
                                        zIndex: 3,
                                        boxShadow: "0 2px 12px 0 #ffe60077"
                                    }}
                                    size="small"
                                />
                                <Box
                                    sx={{
                                        width: "100%",
                                        aspectRatio: "4/3",
                                        borderRadius: 4,
                                        overflow: "hidden",
                                        boxShadow: "0 2px 10px 0 #bde0fe22",
                                        border: "1.5px solid #ffe259",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#fff8e1",
                                        mb: 2
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
                                <Typography fontWeight={900} sx={{ fontSize: 17.2, mb: 0.6, color: "#b71c1c", letterSpacing: 0.3 }}>
                                    {item.name}
                                </Typography>
                                <Rating
                                    size="small"
                                    precision={0.5}
                                    value={ratings[idx]}
                                    sx={{ mb: 0.7 }}
                                    onChange={(_, value) => handleChangeRating(idx, value)}
                                />
                                <Stack direction="row" spacing={1.1} alignItems="center" justifyContent="center" sx={{ mb: 1.2 }}>
                                    <Typography sx={{ fontWeight: 900, fontSize: 17, color: "#e53935" }}>
                                        {item.salePrice}₫
                                    </Typography>
                                    <Typography sx={{ color: "#bbb", textDecoration: "line-through", fontSize: 15.2, fontWeight: 700 }}>
                                        {item.oldPrice}₫
                                    </Typography>
                                </Stack>
                                <Box sx={{ mt: "auto", width: "100%" }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                        <Tooltip title={favoriteIndexes.includes(idx) ? "Bỏ yêu thích" : "Yêu thích"}>
                                            <IconButton
                                                sx={{
                                                    color: favoriteIndexes.includes(idx) ? "#e53935" : "#bbb",
                                                    border: favoriteIndexes.includes(idx) ? "2px solid #e53935" : "2px solid #ececec",
                                                    bgcolor: "#fff",
                                                    borderRadius: "50%",
                                                    boxShadow: favoriteIndexes.includes(idx) ? "0 4px 16px #ffe6e6" : "none",
                                                    "&:hover": {
                                                        color: "#e53935",
                                                        border: "2px solid #e53935",
                                                        background: "#ffe6e6"
                                                    },
                                                    transition: "all 0.15s"
                                                }}
                                                onClick={() => handleToggleFavorite(idx)}
                                            >
                                                {favoriteIndexes.includes(idx) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
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
                                                    boxShadow: "0 2px 8px 0 #ffd58066",
                                                    background: "#ffe259",
                                                    color: "#b71c1c",
                                                    "&:hover": { background: "#ffb300", color: "#fff" }
                                                }}
                                                onClick={() => handleAddToCart(idx)}
                                            >
                                                Thêm vào giỏ
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </OutletBlock>
                        </Grid>
                    ))}
                </Grid>
                <Stack direction="row" justifyContent="center" alignItems="center" mt={5} spacing={2}>
                    <Button variant="outlined" size="small" sx={{
                        minWidth: 38, borderRadius: 2.3, color: "#b71c1c", borderColor: "#ffe259",
                        "&:hover": { borderColor: "#e53935", bgcolor: "#fffbe6" }
                    }}>1</Button>
                    <Button variant="outlined" size="small" sx={{
                        minWidth: 38, borderRadius: 2.3, color: "#b71c1c", borderColor: "#ffe259",
                        "&:hover": { borderColor: "#e53935", bgcolor: "#fffbe6" }
                    }}>2</Button>
                    <Typography sx={{ mx: 1, color: "#888" }}>...</Typography>
                    <Button variant="outlined" size="small" sx={{
                        minWidth: 38, borderRadius: 2.3, color: "#b71c1c", borderColor: "#ffe259",
                        "&:hover": { borderColor: "#e53935", bgcolor: "#fffbe6" }
                    }}>6</Button>
                </Stack>
            </Box>
            <Box mt={8}>
                <Footer />
            </Box>
        </Box>
    );
}