import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';


// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0 VND";
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
};

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]); // State cho sản phẩm trong giỏ, ban đầu là mảng rỗng
    const [loading, setLoading] = useState(true); // State để kiểm soát trạng thái loading
    const [quantities, setQuantities] = useState({});
  // States cho form và select
  useEffect(() => {
  const cartId = "testcart"; // ID giỏ hàng để test
  const apiUrl = `http://localhost:8080/api/v1/cart/${cartId}`;

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl);

      // **PHẦN QUAN TRỌNG: CHUYỂN ĐỔI DỮ LIỆU TỪ API**
      // API trả về: { idChiTietSanPham, tenSanPham, donGia, ... }
      // Component cần: { id, name, price, ... }
      const formattedData = response.data.map((item) => ({
        id: item.idChiTietSanPham, // Chuyển idChiTietSanPham -> id
        name: item.tenSanPham, // Chuyển tenSanPham -> name
        price: item.donGia, // Chuyển donGia -> price
        quantity: item.soLuong, // Chuyển soLuong -> quantity
        size: item.tenKichCo, // Chuyển tenKichCo -> size
        color: item.tenMauSac, // Chuyển tenMauSac -> color
        image: item.hinhAnh || "https://i.imgur.com/G5g066E.png", // Dùng ảnh mặc định nếu API không có ảnh
        sale: false, // Bạn có thể thêm logic cho sale nếu API có hỗ trợ
      }));

      setCartItems(formattedData); // Cập nhật state với dữ liệu đã được định dạng
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
      // Có thể thêm xử lý báo lỗi cho người dùng ở đây
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  fetchCartItems();
}, []);
  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
  };

  // Các phép tính tổng tiền vẫn giữ nguyên, chúng sẽ tự động tính lại khi state thay đổi
  const itemSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );
  const shipping = 0;
  const vat = itemSubtotal * 0.08;
  const orderTotal = itemSubtotal + shipping;

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }
   if (!loading && cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: "#fff" }}>
        <Header />
        <Container maxWidth="lg" sx={{ pt: 8, pb: 10, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            GIỎ HÀNG
          </Typography>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>
            Giỏ hàng của bạn hiện đang trống.
          </Typography>
          <Button
            variant="contained"
            href="/shop" // Dẫn về trang cửa hàng
            sx={{
              bgcolor: 'black',
              color: 'white',
              px: 5,
              py: 1.5,
              fontWeight: 600,
              '&:hover': { bgcolor: '#333' }
            }}
          >
            TIẾP TỤC MUA SẮM
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }
  return (
    <Box sx={{ bgcolor: "#fff" }}>
      <Header />

      <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* CỘT GIỎ HÀNG BÊN TRÁI */}
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                maxHeight: "75vh",
                overflowY: "auto",
                pr: 2,
              }}
            >
              <Stack divider={<Divider sx={{ my: 2 }} />}>
                {cartItems.map((item) => (
                  <Grid container spacing={{ xs: 2, md: 3 }} key={item.id}>
                    {/* ... Toàn bộ phần render item của bạn giữ nguyên ... */}
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{ width: "100%", height: "auto", borderRadius: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box
                        sx={{
                          position: "relative",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <IconButton
                          sx={{ position: "absolute", top: -10, right: -10, color: "text.primary" }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight={500}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Color: {item.color}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Size: {item.size}
                        </Typography>
                        {item.sale && (
                          <Typography variant="body2" sx={{ color: "red", mt: 1 }}>
                            Sale
                          </Typography>
                        )}
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{ mt: 1, color: item.sale ? "red" : "inherit" }}
                        >
                          {formatCurrency(item.price)}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 2,
                          }}
                        >
                         <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    width: 'fit-content',
  }}
>
  <IconButton 
    onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)} 
    disabled={quantities[item.id] <= 1} 
    size="small"
  >
    <RemoveIcon fontSize="small" />
  </IconButton>

  <Typography
    variant="body1"
    sx={{
      px: 2,
      minWidth: '20px',
      textAlign: 'center',
      fontWeight: 500,
    }}
  >
    {quantities[item.id] || 1}
  </Typography>

  <IconButton 
    onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1)} 
    size="small"
  >
    <AddIcon fontSize="small" />
  </IconButton>
</Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="caption" color="text.secondary">
                              SUBTOTAL
                            </Typography>
                            <Typography fontWeight={600}>
                              {formatCurrency(item.price * (quantities[item.id] || 1))}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* CỘT TÓM TẮT ĐƠN HÀNG BÊN PHẢI */}
          <Grid item xs={12} lg={4}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 1,
                position: "sticky",
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                ORDER SUMMARY | {cartItems.length} ITEM(S)
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Item(s) subtotal</Typography>
                  <Typography fontWeight={500}>{formatCurrency(itemSubtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Shipping</Typography>
                  <Typography fontWeight={500}>{formatCurrency(shipping)}</Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={1.5} sx={{ my: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={600}>SUBTOTAL</Typography>
                  <Typography fontWeight={600}>{formatCurrency(itemSubtotal)}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  VAT included {formatCurrency(vat)}
                </Typography>
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2, mb: 3 }}
              >
                <Typography variant="h6" fontWeight={600}>
                  ORDER TOTAL
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(orderTotal)}
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.5,
                  bgcolor: "#FF0000",
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 0,
                  "&:hover": { bgcolor: "#D90000" },
                }}
              >
                CHECKOUT
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  mt: 1,
                  py: 1.5,
                  color: "black",
                  borderColor: "black",
                  fontWeight: 700,
                  borderRadius: 0,
                  "&:hover": { borderColor: "black", bgcolor: "#f5f5f5" },
                }}
              >
                CONTINUE SHOPPING
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default CartPage;
