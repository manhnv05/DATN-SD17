import React, { useEffect, useState } from "react";
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
    Rating,
    TextField,
    CircularProgress
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FilterBlock = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 20,
    boxShadow: "0 4px 24px 0 #bde0fe22",
    minWidth: 200,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: "1.5px solid #e3f0fa"
}));

function getPaginationItems(currentPage, totalPages) {
    // currentPage: 0-based
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    const items = [];
    if (currentPage <= 2) {
        items.push(0, 1, 2, "...", totalPages - 2, totalPages - 1);
    } else if (currentPage >= totalPages - 3) {
        items.push(0, 1, "...", totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
        items.push(0, 1, "...", currentPage, "...", totalPages - 2, totalPages - 1);
    }
    return items;
}

export default function ShopPage() {
    const isMobile = useMediaQuery("(max-width:900px)");
    const [price, setPrice] = useState([0, 500]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [favoriteIndexes, setFavoriteIndexes] = useState([]);
    const [cartIndexes, setCartIndexes] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/mauSac/all")
            .then(res => setColorOptions(res.data))
            .catch(() => setColorOptions([]));
        axios.get("http://localhost:8080/kichThuoc/all")
            .then(res => setSizeOptions(res.data))
            .catch(() => setSizeOptions([]));
        axios.get("http://localhost:8080/thuongHieu/all")
            .then(res => setBrandOptions(res.data))
            .catch(() => setBrandOptions([]));
        axios.get("http://localhost:8080/danhMuc/all")
            .then(res => setCategoryOptions(res.data))
            .catch(() => setCategoryOptions([]));
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, selectedColors, selectedSizes, selectedBrands, selectedCategories, price, page, pageSize]);

    const fetchProducts = () => {
        setLoading(true);
        const params = {
            keyword: search ? search : undefined,
            color: selectedColors.length > 0 ? selectedColors[0] : undefined,
            size: selectedSizes.length > 0 ? selectedSizes[0] : undefined,
            brand: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
            category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
            priceMin: price[0] ? price[0] * 1000 : undefined,
            priceMax: price[1] ? price[1] * 1000 : undefined,
            page: page,
            pageSize: pageSize
        };
        axios.get("http://localhost:8080/api/shop/products", { params })
            .then(res => {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
                setRatings(res.data.content.map(item => item.rating || 4));
                setLoading(false);
            })
            .catch(() => {
                setProducts([]);
                setTotalPages(1);
                setRatings([]);
                setLoading(false);
            });
    };

    const handlePriceChange = (e, newValue) => {
        setPrice(newValue);
        setPage(0);
    };

    const handleColorClick = (color) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [color]
        );
        setPage(0);
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSizes((prev) =>
            checked ? [value] : []
        );
        setPage(0);
    };

    const handleBrandChange = (e) => {
        const { value, checked } = e.target;
        setSelectedBrands((prev) =>
            checked ? [value] : []
        );
        setPage(0);
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCategories((prev) =>
            checked ? [value] : []
        );
        setPage(0);
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

    const handleGoToDetail = (id) => {
        navigate(`/shop/detail/${id}`);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage === "...") return;
        setPage(newPage);
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedBrands([]);
        setSelectedCategories([]);
        setPrice([0, 500]);
        setPage(0);
    };

    const paginationItems = getPaginationItems(page, totalPages);

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
                                Bộ lọc
                            </Typography>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<RestartAltIcon />}
                                sx={{
                                    ml: "auto",
                                    color: "#1976d2",
                                    fontWeight: 700,
                                    fontSize: 15,
                                    px: 1.2,
                                    minWidth: 0
                                }}
                                onClick={handleResetFilters}
                            >
                                Đặt lại
                            </Button>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm sản phẩm"
                            variant="outlined"
                            value={search}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{
                                mb: 2,
                                bgcolor: "#f8fbff",
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2
                                }
                            }}
                        />
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.8, color: "#205072" }}>Danh mục</Typography>
                        <FormGroup>
                            {categoryOptions.map((cat) => (
                                <FormControlLabel
                                    key={cat.id}
                                    control={
                                        <Checkbox
                                            checked={selectedCategories.includes(cat.tenDanhMuc)}
                                            onChange={handleCategoryChange}
                                            value={cat.tenDanhMuc}
                                            size="small"
                                            sx={{ color: "#1976d2" }}
                                        />
                                    }
                                    label={cat.tenDanhMuc}
                                    sx={{ fontWeight: 500, fontSize: 14.5, color: "#222" }}
                                />
                            ))}
                        </FormGroup>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Giá</Typography>
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
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Màu sắc</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1.2} mb={1.5} ml={0.5}>
                            {colorOptions.map((color) => (
                                <IconButton
                                    key={color.id}
                                    size="small"
                                    onClick={() => handleColorClick(color.maMau)}
                                    sx={{
                                        border: selectedColors.includes(color.maMau)
                                            ? "2.5px solid #1976d2"
                                            : "2px solid #eee",
                                        bgcolor: color.maMau,
                                        width: 28,
                                        height: 28,
                                        transition: "border 0.15s",
                                        boxShadow: selectedColors.includes(color.maMau)
                                            ? "0 2px 8px 0 #1976d299"
                                            : "none"
                                    }}
                                />
                            ))}
                        </Stack>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Kích thước</Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1.2} mb={1.5}>
                            {sizeOptions.map((sz) => (
                                <FormControlLabel
                                    key={sz.id}
                                    control={
                                        <Checkbox
                                            checked={selectedSizes.includes(sz.ma)}
                                            onChange={handleSizeChange}
                                            value={sz.ma}
                                            size="small"
                                            sx={{ color: "#1976d2" }}
                                        />
                                    }
                                    label={sz.tenKichCo}
                                    sx={{ m: 0, fontWeight: 600, fontSize: 14.5, color: "#222" }}
                                />
                            ))}
                        </Stack>
                        <Typography sx={{ fontWeight: 600, fontSize: 16, mt: 2, mb: 0.8, color: "#205072" }}>Thương hiệu</Typography>
                        <FormGroup>
                            {brandOptions.map((brand) => (
                                <FormControlLabel
                                    key={brand.id}
                                    control={
                                        <Checkbox
                                            checked={selectedBrands.includes(brand.tenThuongHieu)}
                                            onChange={handleBrandChange}
                                            value={brand.tenThuongHieu}
                                            size="small"
                                            sx={{ color: "#1976d2" }}
                                        />
                                    }
                                    label={brand.tenThuongHieu}
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
                            onClick={fetchProducts}
                        >
                            Áp dụng bộ lọc
                        </Button>
                    </FilterBlock>
                </Box>
                <Box sx={{ flex: 1 }}>
                    {loading ? (
                        <Stack alignItems="center" py={8}>
                            <CircularProgress />
                        </Stack>
                    ) : (
                        <Grid container spacing={4}>
                            {products.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography align="center" color="text.secondary" sx={{ mt: 8, fontSize: 20 }}>
                                        Không có sản phẩm nào phù hợp
                                    </Typography>
                                </Grid>
                            ) : (
                                products.map((item, idx) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                                            onClick={() => handleGoToDetail(item.id)}
                                        >
                                            {item.discountPercent && (
                                                <Chip
                                                    label={item.discountPercent}
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
                                            {item.salePrice && (
                                                <Chip
                                                    label="Khuyến mãi"
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
                                                    src={item.imageUrl || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"}
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
                                                onClick={e => e.stopPropagation()}
                                            />
                                            <Stack direction="row" spacing={1.1} alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                                                {item.salePrice ? (
                                                    <>
                                                        <Typography sx={{ fontWeight: 900, fontSize: 16.5, color: "#e53935" }}>
                                                            {item.salePrice.toLocaleString("vi-VN")}₫
                                                        </Typography>
                                                        <Typography sx={{ color: "#aaa", textDecoration: "line-through", fontSize: 15.2, fontWeight: 700 }}>
                                                            {item.priceMin && item.priceMax && item.priceMin !== item.priceMax
                                                                ? `${item.priceMin.toLocaleString("vi-VN")}₫ - ${item.priceMax.toLocaleString("vi-VN")}₫`
                                                                : item.price && `${item.price.toLocaleString("vi-VN")}₫`}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <Typography sx={{ fontWeight: 900, fontSize: 16.5, color: "#205072" }}>
                                                        {item.priceMin && item.priceMax && item.priceMin !== item.priceMax
                                                            ? `${item.priceMin.toLocaleString("vi-VN")}₫ - ${item.priceMax.toLocaleString("vi-VN")}₫`
                                                            : item.price && `${item.price.toLocaleString("vi-VN")}₫`}
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleFavorite(idx);
                                                            }}
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToCart(idx);
                                                            }}
                                                        >
                                                            Thêm vào giỏ
                                                        </Button>
                                                    </Tooltip>
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                    <Stack direction="row" justifyContent="center" alignItems="center" mt={5} spacing={2}>
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={page === 0}
                            onClick={() => handlePageChange(page - 1)}
                            sx={{
                                minWidth: 38,
                                borderRadius: 2.3,
                                color: page === 0 ? "#bdbdbd" : "#1976d2",
                                borderColor: "#bde0fe",
                                fontWeight: 600
                            }}
                        >
                            Trước
                        </Button>
                        {paginationItems.map((item, idx) =>
                            item === "..." ? (
                                <Button
                                    key={`ellipsis-${idx}`}
                                    variant="text"
                                    size="small"
                                    disabled
                                    sx={{
                                        minWidth: 38,
                                        borderRadius: 2.3,
                                        color: "#bdbdbd",
                                        fontWeight: 700
                                    }}
                                >
                                    ...
                                </Button>
                            ) : (
                                <Button
                                    key={item}
                                    variant={item === page ? "contained" : "outlined"}
                                    size="small"
                                    sx={{
                                        minWidth: 38,
                                        borderRadius: 2.3,
                                        color: item === page ? "#fff" : "#1976d2",
                                        borderColor: "#bde0fe",
                                        bgcolor: item === page ? "#1976d2" : "#fff",
                                        fontWeight: item === page ? 700 : 500,
                                        "&:hover": { borderColor: "#1976d2", bgcolor: "#e3f0fa" }
                                    }}
                                    onClick={() => handlePageChange(item)}
                                >
                                    {item + 1}
                                </Button>
                            )
                        )}
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={page === totalPages - 1 || totalPages === 0}
                            onClick={() => handlePageChange(page + 1)}
                            sx={{
                                minWidth: 38,
                                borderRadius: 2.3,
                                color: page === totalPages - 1 || totalPages === 0 ? "#bdbdbd" : "#1976d2",
                                borderColor: "#bde0fe",
                                fontWeight: 600
                            }}
                        >
                            Sau
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <Box mt={8}>
                <Footer />
            </Box>
        </Box>
    );
}