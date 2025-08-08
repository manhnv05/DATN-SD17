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
    Checkbox,
    Slider,
    FormControlLabel,
    FormGroup,
    IconButton,
    useMediaQuery,
    Tooltip,
    Rating
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { styled } from "@mui/material/styles";

const products = [
    {
        name: "SWEATSHIRT JACKET",
        img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
        price: "369.000",
        sale: "299.000",
        discount: "-19%"
    },
    {
        name: "SUEDE JACKET BEIGE",
        img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        price: "499.000",
        sale: "429.000",
        discount: "-14%"
    },
    {
        name: "RIPPED JEANS",
        img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
        price: "399.000",
        sale: "",
        discount: ""
    },
    {
        name: "GRAPHIC TEE",
        img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
        price: "189.000",
        sale: "",
        discount: ""
    },
    {
        name: "POLO SHIRT WHITE",
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        sale: "",
        discount: ""
    },
    {
        name: "TEE LOGO",
        img: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=400&q=80",
        price: "199.000",
        sale: "159.000",
        discount: "-20%"
    },
    {
        name: "BASIC SHORTS",
        img: "https://images.unsplash.com/photo-1469398715555-76331e2b1b47?auto=format&fit=crop&w=400&q=80",
        price: "259.000",
        sale: "",
        discount: ""
    },
    {
        name: "DENIM SHORTS",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        price: "299.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWEATSHIRT WHITE",
        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
        price: "189.000",
        sale: "",
        discount: ""
    },
    {
        name: "T-SHIRT BLACK",
        img: "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=400&q=80",
        price: "189.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWE BLACK SHIRT",
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        price: "199.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWEATSHIRT WHITE",
        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
        price: "189.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWE WHITE TEE",
        img: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=400&q=80",
        price: "209.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWE GREY TEE",
        img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
        price: "199.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWE TEE PINK",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        price: "199.000",
        sale: "",
        discount: ""
    },
    {
        name: "SWE TEE 25",
        img: "https://images.unsplash.com/photo-1519408469771-2586093c3d5b?auto=format&fit=crop&w=400&q=80",
        price: "219.000",
        sale: "",
        discount: ""
    }
];

const colorOptions = [
    "#000", "#fff", "#f44336", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800", "#e91e63", "#9c27b0"
];

const sizeOptions = ["S", "M", "L", "XL", "XXL"];

const styleOptions = ["Basic", "Hoodie", "Polo", "Sweatshirt", "Tee", "Shorts", "Jeans"];

const FilterBlock = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 20,
    boxShadow: "0 4px 24px 0 #bde0fe22",
    minWidth: 200,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: "1.5px solid #e3f0fa"
}));

export default function ShopPage() {
    const isMobile = useMediaQuery("(max-width:900px)");
    const [price, setPrice] = useState([0, 500]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [favoriteIndexes, setFavoriteIndexes] = useState([]);
    const [cartIndexes, setCartIndexes] = useState([]);
    const [ratings, setRatings] = useState(products.map(() => 4));

    const handlePriceChange = (e, newValue) => setPrice(newValue);

    const handleColorClick = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color]
        );
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSizes((prev) =>
            checked ? [...prev, value] : prev.filter((sz) => sz !== value)
        );
    };

    const handleStyleChange = (e) => {
        const { value, checked } = e.target;
        setSelectedStyles((prev) =>
            checked ? [...prev, value] : prev.filter((st) => st !== value)
        );
    };

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
        <Box sx={{ bgcolor: "#f5f8fb", minHeight: "100vh" }}>
            <Header />
            <Box
                sx={{
                    width: "100%",
                    height: 170,
                    bgcolor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    mt: 2,
                    background: "url(https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80) center/cover",
                    borderRadius: { xs: "0 0 18px 18px", md: "0 0 36px 36px" },
                    boxShadow: "0 6px 32px 0 #bde0fe22"
                }}
            >
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    fontWeight={900}
                    sx={{
                        color: "#205072",
                        letterSpacing: 1.4,
                        textShadow: "0 3px 15px #fff9",
                        bgcolor: "rgba(255,255,255,0.82)",
                        px: isMobile ? 3 : 7,
                        py: 1.2,
                        borderRadius: 8,
                        border: "1.5px solid #bde0fe"
                    }}
                >
                    Shop
                </Typography>
            </Box>

            <Box
                sx={{
                    maxWidth: 1320,
                    mx: "auto",
                    display: "flex",
                    gap: 3,
                    px: { xs: 1, md: 3 },
                    flexDirection: { xs: "column", md: "row" }
                }}
            >
                <Box sx={{
                    width: { xs: "100%", md: 270 },
                    flexShrink: 0,
                    mb: { xs: 2, md: 0 }
                }}>
                    <FilterBlock>
                        <Stack direction="row" alignItems="center" gap={1.2} mb={2}>
                            <TuneIcon sx={{ color: "#1976d2", fontSize: 23 }} />
                            <Typography sx={{ fontWeight: 900, fontSize: 20, color: "#205072", letterSpacing: 0.5 }}>
                                Filters
                            </Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.8, color: "#205072" }}>Category</Typography>
                        <FormGroup>
                            {[...styleOptions].slice(0, 4).map((style) => (
                                <FormControlLabel
                                    key={style}
                                    control={<Checkbox size="small" sx={{ color: "#1976d2" }} />}
                                    label={style}
                                    sx={{ fontWeight: 500, fontSize: 14.5, color: "#222" }}
                                />
                            ))}
                        </FormGroup>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Price</Typography>
                        <Box px={1.5} pb={1.5}>
                            <Slider
                                value={price}
                                onChange={handlePriceChange}
                                min={0}
                                max={500}
                                valueLabelDisplay="auto"
                                sx={{
                                    color: "#1976d2",
                                    "& .MuiSlider-thumb": {
                                        border: "2px solid #fff"
                                    }
                                }}
                            />
                            <Stack direction="row" justifyContent="space-between" fontSize={13.5} color="#888">
                                <span>{price[0]}.000₫</span>
                                <span>{price[1]}.000₫</span>
                            </Stack>
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Color</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1.2} mb={1.5} ml={0.5}>
                            {colorOptions.map((color) => (
                                <IconButton
                                    key={color}
                                    size="small"
                                    onClick={() => handleColorClick(color)}
                                    sx={{
                                        border: selectedColors.includes(color)
                                            ? "2.5px solid #1976d2"
                                            : "2px solid #eee",
                                        bgcolor: color,
                                        width: 28,
                                        height: 28,
                                        transition: "border 0.15s",
                                        boxShadow: selectedColors.includes(color)
                                            ? "0 2px 8px 0 #1976d299"
                                            : "none"
                                    }}
                                />
                            ))}
                        </Stack>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Size</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1.2} mb={1.5}>
                            {sizeOptions.map((sz) => (
                                <FormControlLabel
                                    key={sz}
                                    control={
                                        <Checkbox
                                            checked={selectedSizes.includes(sz)}
                                            onChange={handleSizeChange}
                                            value={sz}
                                            size="small"
                                            sx={{ color: "#1976d2" }}
                                        />
                                    }
                                    label={sz}
                                    sx={{ m: 0, fontWeight: 600, fontSize: 14.5, color: "#222" }}
                                />
                            ))}
                        </Stack>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Dress Style</Typography>
                        <FormGroup>
                            {styleOptions.map((style) => (
                                <FormControlLabel
                                    key={style}
                                    control={
                                        <Checkbox
                                            checked={selectedStyles.includes(style)}
                                            onChange={handleStyleChange}
                                            value={style}
                                            size="small"
                                            sx={{ color: "#1976d2" }}
                                        />
                                    }
                                    label={style}
                                    sx={{ m: 0, fontWeight: 600, fontSize: 14.5, color: "#222" }}
                                />
                            ))}
                        </FormGroup>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                mt: 3,
                                borderRadius: 2.5,
                                fontWeight: 800,
                                py: 1.1,
                                background: "linear-gradient(92deg,#1976d2 0%,#512da8 100%)",
                                color: "#fff",
                                fontSize: 16.5,
                                boxShadow: "0 2px 10px 0 #1976d21a"
                            }}
                        >
                            Apply Filter
                        </Button>
                    </FilterBlock>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Grid container spacing={4}>
                        {products.map((item, idx) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: 2.2,
                                        textAlign: "center",
                                        borderRadius: 6,
                                        bgcolor: "#fff",
                                        height: 420,
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
                                >
                                    {item.discount && (
                                        <Chip
                                            label={item.discount}
                                            color="error"
                                            sx={{
                                                position: "absolute",
                                                top: 16,
                                                left: 16,
                                                fontWeight: 900,
                                                bgcolor: "#ff5252",
                                                color: "#fff",
                                                fontSize: 14,
                                                px: 1.2,
                                                zIndex: 3,
                                                letterSpacing: 1,
                                                boxShadow: "0 2px 8px 0 #ff525288"
                                            }}
                                            size="small"
                                        />
                                    )}
                                    {item.sale && (
                                        <Chip
                                            label="SALE"
                                            sx={{
                                                position: "absolute",
                                                top: 16,
                                                right: 16,
                                                bgcolor: "#ffe600",
                                                color: "#e53935",
                                                fontWeight: 900,
                                                fontSize: 14,
                                                px: 1.1,
                                                zIndex: 3,
                                                boxShadow: "0 2px 12px 0 #ffe60077"
                                            }}
                                            size="small"
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4/3",
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            boxShadow: "0 2px 10px 0 #bde0fe22",
                                            border: "1.5px solid #e3f0fa",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f6f6f6",
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
                                    <Typography fontWeight={800} sx={{ fontSize: 17, mb: 0.5, color: "#205072", letterSpacing: 0.3 }}>
                                        {item.name}
                                    </Typography>
                                    <Rating
                                        size="small"
                                        precision={0.5}
                                        value={ratings[idx]}
                                        sx={{ mb: 0.5 }}
                                        onChange={(_, value) => handleChangeRating(idx, value)}
                                    />
                                    <Stack direction="row" spacing={1.1} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                                        {item.sale ? (
                                            <>
                                                <Typography sx={{ fontWeight: 900, fontSize: 16.5, color: "#e53935" }}>
                                                    {item.sale}₫
                                                </Typography>
                                                <Typography sx={{ color: "#aaa", textDecoration: "line-through", fontSize: 15.2, fontWeight: 700 }}>
                                                    {item.price}₫
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography sx={{ fontWeight: 900, fontSize: 16.5, color: "#205072" }}>
                                                {item.price}₫
                                            </Typography>
                                        )}
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
                                                        boxShadow: "0 2px 8px 0 #bde0fe33",
                                                        background: "#6cacec",
                                                        "&:hover": { background: "#205072" }
                                                    }}
                                                    onClick={() => handleAddToCart(idx)}
                                                >
                                                    Thêm vào giỏ
                                                </Button>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    <Stack direction="row" justifyContent="center" alignItems="center" mt={5} spacing={2}>
                        <Button variant="outlined" size="small" sx={{
                            minWidth: 38, borderRadius: 2.3, color: "#1976d2", borderColor: "#bde0fe",
                            "&:hover": { borderColor: "#1976d2", bgcolor: "#e3f0fa" }
                        }}>1</Button>
                        <Button variant="outlined" size="small" sx={{
                            minWidth: 38, borderRadius: 2.3, color: "#1976d2", borderColor: "#bde0fe",
                            "&:hover": { borderColor: "#1976d2", bgcolor: "#e3f0fa" }
                        }}>2</Button>
                        <Button variant="outlined" size="small" sx={{
                            minWidth: 38, borderRadius: 2.3, color: "#1976d2", borderColor: "#bde0fe",
                            "&:hover": { borderColor: "#1976d2", bgcolor: "#e3f0fa" }
                        }}>3</Button>
                        <Typography sx={{ mx: 1, color: "#888" }}>...</Typography>
                        <Button variant="outlined" size="small" sx={{
                            minWidth: 38, borderRadius: 2.3, color: "#1976d2", borderColor: "#bde0fe",
                            "&:hover": { borderColor: "#1976d2", bgcolor: "#e3f0fa" }
                        }}>8</Button>
                    </Stack>
                </Box>
            </Box>
            <Box mt={8}>
                <Footer />
            </Box>
        </Box>
    );
}