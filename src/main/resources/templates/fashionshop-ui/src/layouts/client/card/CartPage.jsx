import React, { useState, useEffect, useCallback, useRef } from "react";
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
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useCart } from "./CartProvider";
import { toast } from "react-toastify";
import ProductSlideshow from "../../admin/BanHangTaiQuay/component/ProductSlideshow.jsx";
// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0 VND";
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
};

const cartId = "testcart";
const CartPage = () => {
  const { cartItems, setCartItems, cartId, isLoading } = useCart();
  const [quantities, setQuantities] = useState({});
  const totalProducts = cartItems.length;
  const handleQuantityChange = (id, newQuantity) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
  };
  useEffect(() => {
    // Đồng bộ state 'quantities' với dữ liệu từ context khi cartItems thay đổi
    // Điều này đảm bảo số lượng sản phẩm được hiển thị chính xác khi tải trang
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [cartItems]); // Phụ thuộc vào cartItems từ context
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);

    // Kiểm tra nếu số lượng không hợp lệ thì không làm gì cả
    if (isNaN(quantity) || quantity < 1) {
      // Có thể khôi phục lại giá trị cũ nếu muốn
      const oldQuantity = cartItems.find((item) => item.id === itemId)?.quantity;
      setQuantities((prev) => ({ ...prev, [itemId]: oldQuantity || 1 }));
      toast.warn("Số lượng phải là một số lớn hơn hoặc bằng 1.");
      return;
    }

    // Cập nhật state ngay lập tức để người dùng thấy thay đổi (Optimistic UI)
    setQuantities((prev) => ({ ...prev, [itemId]: quantity }));

    try {
      const response = await axios.put("http://localhost:8080/api/v1/cart/update-quantity", {
        cartId: cartId,
        chiTietSanPhamId: itemId,
        soLuong: quantity,
      });
      // Cập nhật lại state cartItems để tính toán tổng tiền cho chính xác
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, quantity: quantity } : item))
      );
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData) {
        toast.error(`${errorData.message}`);
      }
      const oldQuantity = cartItems.find((item) => item.id === itemId)?.quantity;
      setQuantities((prev) => ({ ...prev, [itemId]: oldQuantity || 10 }));
    }
  };
  const handlRemoveItem = (itemId) => {
    const apiUrlRemove = `http://localhost:8080/api/v1/cart/${cartId}/items/${itemId}`;
    try {
      axios.delete(apiUrlRemove);
      toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!");
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      toast.error("Lỗi xóa sản phẩm ");
    }
  };

  const itemSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );
  const debounceTimer = useRef(null);

  const debouncedUpdateQuantity = useCallback(
    (itemId, newQuantity) => {
      // Xóa bộ đếm thời gian cũ nếu có
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Đặt một bộ đếm thời gian mới
      debounceTimer.current = setTimeout(() => {
        // Gọi hàm cập nhật chính sau 500ms
        handleUpdateQuantity(itemId, newQuantity);
      }, 500); // 500ms delay
    },
    [handleUpdateQuantity]
  );
  const shipping = 0;
  const vat = itemSubtotal * 0.08;
  const orderTotal = itemSubtotal + shipping;

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!isLoading && cartItems.length === 0) {
    return (
      <Box sx={{ bgcolor: "#fff" }}>
        <Header />
        <Container maxWidth="lg" sx={{ pt: 8, pb: 10, textAlign: "center" }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
            GIỎ HÀNG
          </Typography>
          <Typography sx={{ mb: 4, color: "text.secondary" }}>
            Giỏ hàng của bạn hiện đang trống.
          </Typography>
          <Button
            variant="contained"
            href="/shop" // Dẫn về trang cửa hàng
            sx={{
              bgcolor: "black",
              color: "white",
              px: 5,
              py: 1.5,
              fontWeight: 600,
              "&:hover": { bgcolor: "#333" },
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
      <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 600, textAlign: "center",mt :3 }}>
        GIỎ HÀNG({totalProducts})
      </Typography>
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
                      <ProductSlideshow product={item} />
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
                          onClick={() => handlRemoveItem(item.id)} // GỌI HÀM XÓA KHI CLICK
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
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: "4px",
                              borderRadius: "50px", // Bo tròn để tạo hình viên thuốc
                              backgroundColor: "#f0f0f0", // Màu nền xám nhạt
                              width: "fit-content",
                              minWidth: "120px", // Đặt chiều rộng tối thiểu
                            }}
                          >
                            {/* Nút trừ */}
                            <IconButton
                              onClick={() =>
                                handleUpdateQuantity(item.id, (quantities[item.id] || 1) - 1)
                              }
                              disabled={(quantities[item.id] || 1) <= 1}
                              size="small"
                              sx={{ color: "text.primary" }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            {/* Ô nhập liệu */}
                            <TextField
                              value={quantities[item.id] || ""}
                              onChange={(e) => {
                                const { value } = e.target;

                                setQuantities((prev) => ({ ...prev, [item.id]: value }));

                                debouncedUpdateQuantity(item.id, value);
                              }}
                              type="number"
                              sx={{
                                width: "70px",
                                // Làm cho nền của input trong suốt
                                "& .MuiInputBase-root": {
                                  backgroundColor: "transparent",
                                },
                                // Căn giữa và làm đậm chữ số
                                "& .MuiInputBase-input": {
                                  textAlign: "center",
                                  padding: "4px 0",
                                  fontWeight: 600, // Chữ đậm hơn
                                  fontSize: "1rem",
                                  color: "text.primary",
                                  mozAppearance: "textfield",
                                },
                                "& .MuiInputBase-input::-webkit-outer-spin-button, & .MuiInputBase-input::-webkit-inner-spin-button":
                                  {
                                    display: "none",
                                    margin: 0,
                                  },
                                // Bỏ viền của TextField
                                "& fieldset": { border: "none" },
                              }}
                              inputProps={{ min: 1 }}
                            />

                            {/* Nút cộng */}
                            <IconButton
                              onClick={() =>
                                handleUpdateQuantity(item.id, (quantities[item.id] || 1) + 1)
                              }
                              size="small"
                              sx={{ color: "text.primary" }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="caption" color="text.secondary">
                              Thành tiền
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
                borderRadius: 2, // Tăng độ bo tròn cho đẹp hơn
                position: "sticky",
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Cộng giỏ hàng
              </Typography>

              {/* TẠM TÍNH */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography fontWeight={600}>Tạm tính</Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatCurrency(itemSubtotal)}
                </Typography>
              </Stack>

              <Divider />

              {/* CHÚ THÍCH */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ my: 2, textAlign: "center" }}
              >
                Phí vận chuyển và mã giảm giá sẽ được áp dụng ở bước thanh toán.
              </Typography>

              {/* NÚT HÀNH ĐỘNG CHÍNH */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                href="/pay" // Điều hướng đến trang thanh toán
                sx={{
                  py: 1.5,
                  bgcolor: "#FF0000",
                  color: "white",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#D90000" },
                }}
              >
                Tiến hành Thanh toán
              </Button>

              {/* NÚT HÀNH ĐỘNG PHỤ */}
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate("/shop")} // Điều hướng về trang cửa hàng
                sx={{
                  mt: 1,
                  py: 1.5,
                  color: "black",
                  borderColor: "black",
                  fontWeight: 700,
                  "&:hover": { borderColor: "black", bgcolor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                Tiếp tục mua sắm
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
