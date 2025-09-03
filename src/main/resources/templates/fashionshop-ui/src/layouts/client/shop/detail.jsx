import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Header from "../components/header";
import Footer from "../components/footer";
import sizeGuideImg from "../../../assets/images/size.jpg";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Hàm lấy user hiện tại
async function fetchCurrentUser() {
  try {
    const res = await axios.get("http://localhost:8080/api/auth/me", { withCredentials: true });
    return res.data; // { id, username, role }
  } catch {
    return null;
  }
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addCartStatus, setAddCartStatus] = useState({ loading: false, success: false, error: "" });
  const [user, setUser] = useState(null);
  // TẠO DANH SÁCH SIZE HỢP LỆ DỰA TRÊN MÀU ĐÃ CHỌN
const isSizeDisabled = (size) => {
    // Nếu chưa chọn màu, không có size nào bị disable
    if (!selectedColor) return false; 
    
    // Nếu đã chọn màu, kiểm tra xem có biến thể nào khớp với cặp màu-size này không
    return !product.variants.some(
        (variant) => variant.maMau === selectedColor.maMau && variant.kichThuoc === size
    );
};

// Hàm kiểm tra xem một MÀU có nên bị disable không
const isColorDisabled = (color) => {
    // Nếu chưa chọn size, không có màu nào bị disable
    if (!selectedSize) return false;
    
    // Nếu đã chọn size, kiểm tra xem có biến thể nào khớp với cặp size-màu này không
    return !product.variants.some(
        (variant) => variant.kichThuoc === selectedSize && variant.maMau === color.maMau
    );
};

useEffect(() => {
    // Nếu người dùng đổi màu và size đã chọn trước đó không còn hợp lệ
    if (selectedSize && isSizeDisabled(selectedSize)) {
        // Tự động bỏ chọn size đó
        setSelectedSize(null);
    }
}, [selectedColor]);

  // Cart ID lấy từ localStorage hoặc tạo mới
  const cartId =
    localStorage.getItem("cartId") ||
    (() => {
      const newId = "cart-" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("cartId", newId);
      return newId;
    })();

  // Lấy user đăng nhập (nếu có)
  useEffect(() => {
    async function getUser() {
      const u = await fetchCurrentUser();
      setUser(u);
    }
    getUser();
  }, []);

  // Fetch product detail
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/shop/detail/${id}`)
      .then((res) => {
        const p = res.data;
        const priceMin = p.giaMin || 0;
        const priceMax = p.giaMax || 0;
        let defaultColor = p.colors && p.colors.length > 0 ? p.colors[0] : null;
        let defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : null;
        let defaultVariant =
          p.variants && p.variants.length > 0
            ? p.variants.find(
                (v) =>
                  (!defaultColor || v.maMau === defaultColor.maMau) &&
                  (!defaultSize || v.kichThuoc === defaultSize)
              ) || p.variants[0]
            : null;
        setProduct({
          ...p,
          name: p.tenSanPham,
          priceMin,
          priceMax,
          variants: p.variants || [],
          images:
            defaultVariant && defaultVariant.images && defaultVariant.images.length > 0
              ? defaultVariant.images
              : p.images && p.images.length > 0
              ? p.images
              : [
                  p.imageUrl ||
                    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80",
                ],
          colors: p.colors && p.colors.length > 0 ? p.colors : [],
          sizes: p.sizes && p.sizes.length > 0 ? p.sizes : [],
          rating: p.rating || 4.5,
          sold: p.sold || 0,
          description: p.moTa || "",
          shipping: p.shipping || "Miễn phí vận chuyển cho đơn hàng từ 500k",
          voucher: p.voucher || null,
          detailImg: sizeGuideImg,
        });
        setSelectedImage(0);

        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!id) return;
    axios
      .get("http://localhost:8080/api/outlet/products", {
        params: { page: 0, pageSize: 6 },
      })
      .then((res) => {
        const rel = (res.data.content || []).filter((item) => `${item.id}` !== `${id}`).slice(0, 5);
        setRelatedProducts(
          rel.map((item) => ({
            id: item.id,
            name: item.tenSanPham,
            img: item.imageUrl,
            price: item.giaSauKhiGiam ? item.giaSauKhiGiam.toLocaleString("vi-VN") : "",
            rating: 4.5 + Math.random() * 0.5,
          }))
        );
      });
  }, [id]);

  // Nếu FE chọn màu hoặc size, cập nhật ảnh tương ứng variant
  useEffect(() => {
    if (!product || !product.variants) return;
    let variant = product.variants.find(
      (v) =>
        (!selectedColor || v.maMau === selectedColor.maMau) &&
        (!selectedSize || v.kichThuoc === selectedSize)
    );
    if (variant) {
      setProduct((prev) => ({
        ...prev,
        images: variant.images && variant.images.length > 0 ? variant.images : prev.images,
      }));
      setSelectedImage(0);
    }
    // eslint-disable-next-line
  }, [selectedColor, selectedSize]);

 let priceDisplay = "";
  let showDiscount = false;
  let giaGoc = 0;
  let giaSale = 0;
  let discount = "";

  // Bước 1: Chỉ xác định variant khi đã chọn đủ cả màu VÀ size
  let variant = null;
  if (product && product.variants && selectedColor && selectedSize) {
    variant = product.variants.find(
      (v) => v.maMau === selectedColor.maMau && v.kichThuoc === selectedSize
    );
  }

  // Bước 2: Logic hiển thị giá dựa trên kết quả của Bước 1
  if (variant && variant.gia > 0) {
    // ---- TRƯỜNG HỢP 1: Đã chọn được variant hợp lệ và có giá > 0 ----
    giaGoc = variant.gia;
    const coGiaSaleHopLe =
      variant.giaSauKhiGiam != null &&
      variant.giaSauKhiGiam > 0 &&
      variant.giaSauKhiGiam < giaGoc;

    if (coGiaSaleHopLe) {
      // Hiển thị giá sale của variant
      showDiscount = true;
      giaSale = variant.giaSauKhiGiam;
      priceDisplay = `${Number(giaSale).toLocaleString("vi-VN")}₫`;
      discount = variant.phanTramGiamGia ? `-${variant.phanTramGiamGia}%` : "";
    } else {
      // Hiển thị giá gốc của variant
      showDiscount = false;
      priceDisplay = `${Number(giaGoc).toLocaleString("vi-VN")}₫`;
    }
  } else {
    // ---- TRƯỜNG HỢP 2: Mới vào trang, hoặc chọn chưa đủ, hoặc variant có giá 0 ----
    showDiscount = false;
    if (product && product.priceMin > 0) {
      // Ưu tiên hiển thị khoảng giá của sản phẩm cha nếu có
      priceDisplay =
        product.priceMin !== product.priceMax
          ? `${Number(product.priceMin).toLocaleString("vi-VN")}₫ - ${Number(
              product.priceMax
            ).toLocaleString("vi-VN")}₫`
          : `${Number(product.priceMin).toLocaleString("vi-VN")}₫`;
    } else {
      // Fallback cuối cùng nếu không có thông tin giá nào hợp lệ
      priceDisplay = "Chọn màu & size để xem giá";
    }
  }

  // Thêm vào giỏ hàng (tự động switch Redis/DB)
  const handleAddToCart = async () => {
    if (!variant) {
      setAddCartStatus({ loading: false, success: false, error: "Vui lòng chọn đủ màu và size!" });
      return;
    }
    if (quantity < 1) {
      setAddCartStatus({ loading: false, success: false, error: "Số lượng phải lớn hơn 0!" });
      return;
    }
    setAddCartStatus({ loading: true, success: false, error: "" });
    try {
      if (user && user.id && user.role) {
        await axios.post(
          `http://localhost:8080/api/v1/cart/db/add?idNguoiDung=${
            user.id
          }&loaiNguoiDung=${user.role.toLowerCase()}`,
          {
            chiTietSanPhamId: variant.id,
            soLuong: quantity,
            donGia:
              variant.giaSauKhiGiam && variant.giaSauKhiGiam < variant.gia
                ? variant.giaSauKhiGiam
                : variant.gia,
          },
          { withCredentials: true }
        );
        const res = await axios.get(
          `http://localhost:8080/api/v1/cart/db?idNguoiDung=${
            user.id
          }&loaiNguoiDung=${user.role.toLowerCase()}`,
          { withCredentials: true }
        );
        let sum = 0;
        if (Array.isArray(res.data)) {
          sum = res.data.reduce((total, item) => total + (item.soLuong || 0), 0);
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: sum } }));
      } else {
        await axios.post(`http://localhost:8080/api/v1/cart/${cartId}/add`, {
          chiTietSanPhamId: variant.id,
          soLuong: quantity,
          donGia:
            variant.giaSauKhiGiam && variant.giaSauKhiGiam < variant.gia
              ? variant.giaSauKhiGiam
              : variant.gia,
        });
        const res = await axios.get(`http://localhost:8080/api/v1/cart/${cartId}`);
        let sum = 0;
        if (Array.isArray(res.data)) {
          sum = res.data.reduce((total, item) => total + (item.soLuong || 0), 0);
        }
        window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: sum } }));
      }
      setAddCartStatus({ loading: false, success: true, error: "" });
    } catch (err) {
      setAddCartStatus({
        loading: false,
        success: false,
        error: err?.response?.data?.message || "Thêm vào giỏ thất bại!",
      });
    }
    setTimeout(() => setAddCartStatus({ loading: false, success: false, error: "" }), 2000);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "#f9fbfc", minHeight: "100vh" }}>
        <Header />
        <Stack alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress />
        </Stack>
        <Footer />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ bgcolor: "#f9fbfc", minHeight: "100vh" }}>
        <Header />
        <Stack alignItems="center" justifyContent="center" minHeight="60vh">
          <Typography color="error" fontWeight={700} fontSize={22}>
            Không tìm thấy sản phẩm!
          </Typography>
        </Stack>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f9fbfc" }}>
      <Header />
      <Box sx={{ maxWidth: 1320, mx: "auto", px: 2, pt: 2 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ fontSize: 14, mb: 2 }}
        >
          <MuiLink underline="hover" color="inherit" href="/">
            Trang chủ
          </MuiLink>
          <MuiLink underline="hover" color="inherit" href="/shop">
            Sản phẩm
          </MuiLink>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ maxWidth: 1320, mx: "auto", px: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2}>
              <Stack spacing={1} sx={{ mt: 0.5 }}>
                {product.images &&
                  product.images.map(
                    (img, idx) =>
                      img && (
                        <Box
                          key={img + idx}
                          component="img"
                          src={img}
                          alt={`thumb-${idx}`}
                          sx={{
                            width: 58,
                            height: 58,
                            objectFit: "cover",
                            borderRadius: 2,
                            border:
                              selectedImage === idx ? "2.5px solid #1976d2" : "1.5px solid #e3f0fa",
                            boxShadow: selectedImage === idx ? "0 2px 8px #1976d233" : "none",
                            cursor: "pointer",
                            transition: "all .16s",
                            bgcolor: "#fafafa",
                          }}
                          onClick={() => setSelectedImage(idx)}
                        />
                      )
                  )}
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
                  position: "relative",
                }}
              >
                {product.images && product.images[selectedImage] && (
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
                      mx: "auto",
                    }}
                  />
                )}
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1.7 }}>
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 0.7, mb: 0.5 }}>
                {product.name}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Typography variant="h5" fontWeight={900} sx={{ color: "#e53935" }}>
                {priceDisplay}
              </Typography>
              {showDiscount && (
                <Typography
                  sx={{
                    color: "#aaa",
                    textDecoration: "line-through",
                    fontSize: 17,
                    fontWeight: 700,
                    ml: 1,
                  }}
                >
                  {Number(giaGoc).toLocaleString("vi-VN")}₫
                </Typography>
              )}
              {discount && showDiscount && (
                <Chip
                  label={discount}
                  color="error"
                  sx={{
                    fontWeight: 900,
                    bgcolor: "#ff5252",
                    color: "#fff",
                    fontSize: 15,
                    px: 1.2,
                    letterSpacing: 1,
                  }}
                  size="small"
                />
              )}
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {product.colors && product.colors.length > 0 && (
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography sx={{ minWidth: 54, fontWeight: 500 }}>Màu:</Typography>
               <Stack direction="row" flexWrap="wrap" gap={1.2}>
    {/* Quay lại dùng product.colors */}
    {product.colors && product.colors.map((color, idx) => {
   // Gọi hàm kiểm tra
 
        return (
            <Tooltip
                title={color.name || color.tenMauSac}
                key={color.maMau || idx}
            >
                <IconButton
                    onClick={() => setSelectedColor(color)}
                   
                    sx={{
                        border: selectedColor?.maMau === color.maMau ? "2.5px solid #1976d2" : "2px solid #e3e3e3",
                        bgcolor: color.maMau,
                        width: 32,
                        height: 32,
                        opacity:  1,
                        cursor: 'pointer',
                        
                    }}
                />
            </Tooltip>
        );
    })}
</Stack>
              </Stack>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Typography sx={{ minWidth: 54, fontWeight: 500 }}>Size:</Typography>
               <Stack direction="row" spacing={1}>
    {/* Quay lại dùng product.sizes */}
    {product.sizes && product.sizes.map((size) => {
        const disabled = isSizeDisabled(size); // Gọi hàm kiểm tra
        return (
            <Box
                key={size}
                // ✅ Chỉ cho phép click nếu không bị disabled
                onClick={() => !disabled && setSelectedSize(size)}
                sx={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1.2,
                    border: selectedSize === size ? "2.5px solid #1976d2" : "1.5px solid #e0e0e0",
                    bgcolor: selectedSize === size ? "#e3f0fa" : "#fff",
                    color: selectedSize === size ? "#1976d2" : "#222",
                    fontWeight: selectedSize === size ? 900 : 600,
                    transition: "all 0.16s",
                    // ✅ Thêm style cho trạng thái disabled
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                {size}
            </Box>
        );
    })}
</Stack>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Typography sx={{ minWidth: 54, fontWeight: 500 }}>Số lượng:</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 32,
                    px: 0,
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    fontWeight: 700,
                  }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <Typography
                  sx={{ minWidth: 32, textAlign: "center", color: "#1976d2", fontWeight: 700 }}
                >
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 32,
                    px: 0,
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    fontWeight: 700,
                  }}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </Button>
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
                  boxShadow: "0 2px 10px 0 #e539351a",
                }}
                onClick={handleAddToCart}
                disabled={addCartStatus.loading}
              >
                {addCartStatus.loading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
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
                      background: "#ffe6e6",
                    },
                    transition: "all 0.15s",
                  }}
                  onClick={() => setFavorite((fav) => !fav)}
                >
                  {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
            {/* Thông báo trạng thái thêm vào giỏ hàng */}
            {addCartStatus.success && (
              <Alert severity="success" sx={{ my: 1, fontWeight: 700 }}>
                Đã thêm vào giỏ hàng!
              </Alert>
            )}
            {addCartStatus.error && (
              <Alert severity="error" sx={{ my: 1, fontWeight: 700 }}>
                {addCartStatus.error}
              </Alert>
            )}
            {product.voucher && (
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#fff3f3",
                  border: "1.5px solid #ffbebe",
                  borderRadius: 3,
                  px: 2.5,
                  py: 1.7,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <LocalOfferIcon sx={{ color: "#e53935", fontSize: 28 }} />
                <Box flex={1}>
                  <Typography sx={{ fontWeight: 900, color: "#e53935", fontSize: 17 }}>
                    {product.voucher.percent}% GIẢM
                  </Typography>
                  {/* SỬA: KHÔNG để Chip nằm trong Typography với component mặc định là "p" */}
                  <Box
                    sx={{ display: "inline-flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
                  >
                    <Typography component="span" sx={{ color: "#222", fontSize: 15.5 }}>
                      Đơn tối thiểu {product.voucher.min}
                    </Typography>
                    <Chip
                      label={product.voucher.expire}
                      size="small"
                      sx={{
                        bgcolor: "#ffbebe",
                        color: "#e53935",
                        ml: 1,
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: "#e53935", fontSize: 14, mt: 0.5, fontWeight: 700 }}>
                    Mã: <b>{product.voucher.code}</b>
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{
                    fontWeight: 900,
                    borderRadius: 2,
                    px: 2,
                    fontSize: 16,
                    bgcolor: "#fff",
                    color: "#e53935",
                    borderColor: "#e53935",
                    "&:hover": { bgcolor: "#ffe6e6", borderColor: "#e53935" },
                  }}
                  onClick={() => navigator.clipboard.writeText(product.voucher.code)}
                >
                  Sao chép mã
                </Button>
              </Paper>
            )}
            <Alert
              severity="info"
              sx={{
                bgcolor: "#f3fafd",
                border: "1.5px solid #bde0fe",
                color: "#205072",
                borderRadius: 2.5,
                mb: 2,
              }}
            >
              {product.shipping}
            </Alert>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.2 }}>
                Mô tả sản phẩm
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line", color: "#222", fontSize: 15.5 }}>
                {product.description}
              </Typography>
              <Box
                component="img"
                src={product.detailImg}
                alt="size guide"
                sx={{
                  width: { xs: "100%", md: 400 },
                  borderRadius: 3,
                  boxShadow: "0 2px 10px 0 #bde0fe22",
                  border: "1.5px solid #e3f0fa",
                  mt: 2,
                  mb: 2,
                  alignSelf: "flex-start",
                }}
              />
            </Box>
          </Grid>
        </Grid>
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
                    transform: "translateY(-5px) scale(1.04)",
                  },
                }}
                onClick={() => navigate(`/shop/detail/${item.id}`)}
              >
                {item.img && (
                  <Box
                    component="img"
                    src={item.img}
                    alt={item.name}
                    sx={{
                      width: "100%",
                      height: 118,
                      objectFit: "cover",
                      borderRadius: 3,
                      mb: 1.2,
                    }}
                  />
                )}
                <Typography
                  fontWeight={700}
                  sx={{ fontSize: 15, mb: 0.5, color: "#205072", letterSpacing: 0.2 }}
                >
                  {item.name}
                </Typography>
                <Rating
                  value={item.rating}
                  precision={0.1}
                  size="small"
                  readOnly
                  sx={{ mb: 0.6 }}
                />
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
