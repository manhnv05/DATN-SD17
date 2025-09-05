import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import Footer from "../components/footer";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "assets/images/logo4.png";
import OrderListTab from "./OrderListTab";
import OrderHistoryTab from "./OrderHistoryTab";
import { toast } from "react-toastify"; 
// --- Styled ---
const CartBlock = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.2),
  borderRadius: 16,
  boxShadow: "0 2px 24px 0 #bde0fe44",
  background: "#fafdff",
  border: "1.5px solid #bde0fe",
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2.5),
  transition: "box-shadow .2s, border-color .2s",
  "&:hover": {
    boxShadow: "0 8px 32px 0 #bde0fe55",
    borderColor: "#1976d2",
  },
}));

export default function CartPage() {
  // Tab state
  const [tab, setTab] = useState(0);

  // Lấy cartId từ localStorage, nếu chưa có thì tạo mới
  const cartId = useMemo(() => {
    let cid = localStorage.getItem("cartId");
    if (!cid) {
      cid = "cart-" + Math.random().toString(36).substring(2, 12);
      localStorage.setItem("cartId", cid);
    }
    return cid;
  }, []);

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // Đồng bộ số lượng badge ở header khi giỏ hàng thay đổi
  const updateCartBadge = (cartArr) => {
    const sum = cartArr.reduce((total, item) => total + (item.qty || 0), 0);
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: sum } }));
  };

  // Lấy user đăng nhập từ localStorage (KHÔNG gọi API /me, chỉ lấy localStorage)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });
        if (res?.data && res.data.id) {
          setUser({
            id: res.data.id,
            username: res.data.username,
            role: res.data.role,
            email: res.data.email || "",
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // Khi đăng nhập/logout, đồng bộ lại cart nếu cần
  useEffect(() => {
    let ignore = false;
    async function fetchCart() {
      try {
        let cartData = [];
        if (user && user.id && user.role) {
          // Đã đăng nhập, dùng API DB
          const res = await axios.get(
            `http://localhost:8080/api/v1/cart/db?idNguoiDung=${user.id}&loaiNguoiDung=${user.role}`,
            { withCredentials: true }
          );
          cartData = Array.isArray(res.data) ? res.data : [];
        } else {
          // Chưa đăng nhập, dùng API Redis
          const res = await axios.get(`http://localhost:8080/api/v1/cart/${cartId}`);
          cartData = Array.isArray(res.data) ? res.data : [];
        }
        // Nếu dữ liệu toàn null, set cart rỗng
        if (
          cartData.length > 0 &&
          cartData.every((item) =>
            Object.values(item).every((val) => val === null || val === undefined)
          )
        ) {
          cartData = [];
        }
        // Chuẩn hóa dữ liệu cho UI
        const mapped = cartData.map((item, idx) => {
          let price = 0;
          let oldPrice = 0;
          if (typeof item.donGia === "number") {
            price = item.donGia;
          } else if (typeof item.donGia === "string") {
            price = Number(item.donGia);
          }
          if (typeof item.giaGoc === "number") {
            oldPrice = item.giaGoc;
          } else if (typeof item.giaGoc === "string") {
            oldPrice = Number(item.giaGoc);
          }
          return {
            id: item.idChiTietSanPham || `cartitem-${idx}`,
            name: item.tenSanPham || "SWEATER",
            img:
              item.hinhAnh && Array.isArray(item.hinhAnh) && item.hinhAnh.length > 0
                ? item.hinhAnh[0]
                : logoImg,
            price: price,
            oldPrice: oldPrice,
            discount: item.phanTramGiamGia ? `-${item.phanTramGiamGia}%` : "",
            qty: typeof item.soLuong === "number" && item.soLuong > 0 ? item.soLuong : 1,
            size: item.tenKichCo || "M",
            color: item.maMau
              ? item.maMau.startsWith("#")
                ? item.maMau
                : "#" + item.maMau
              : "#000",
            tenMauSac: item.tenMauSac || "",
          };
        });
        if (!ignore) {
          setCart(mapped);
        }
      } catch (err) {
        if (!ignore) {
          setCart([]);
        }
      }
    }
    if (tab === 0) fetchCart();
    return () => {
      ignore = true;
    };
  }, [cartId, user, tab]);

  // Khi cart thay đổi, chỉ setSelected khi cart thực sự thay đổi (KHÔNG set cả selectAll ở đây)
  useEffect(() => {
    setSelected(cart.map((item) => item.id));
    updateCartBadge(cart);
  }, [cart]);

  // Sync select all state (KHÔNG setSelected ở đây!)
  useEffect(() => {
    if (cart.length === 0) {
      setSelectAll(false);
    } else if (selected.length === cart.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [cart, selected]);

  const handleTabChange = (event, newValue) => setTab(newValue);

  // Select/deselect product
  const handleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  };

  // Select/deselect all
  const handleSelectAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(cart.map((item) => item.id));
      setSelectAll(true);
    }
  };

  // Remove item (API)
  const handleRemove = async (id) => {
    try {
      if (user && user.id && user.role) {
        // DB API
        await axios.delete(
          `http://localhost:8080/api/v1/cart/db/items/${id}?idNguoiDung=${user.id}&loaiNguoiDung=${user.role}`,
          { withCredentials: true }
        );
      } else {
        // Redis API
        await axios.delete(`http://localhost:8080/api/v1/cart/${cartId}/items/${id}`);
      }
      setCart((prev) => {
        const next = prev.filter((item) => item.id !== id);
        updateCartBadge(next);
        return next;
      });
      setSelected((prev) => prev.filter((sid) => sid !== id));
    } catch (err) {
      // Handle error if needed
    }
  };

  // Change quantity (API)
  const changeQty = async (id, val) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
     const originalQty = item.qty;
    const newQty = Math.max(1, item.qty + val);
    try {
      let res;
      if (user && user.id && user.role) {
        // DB API
        res = await axios.put(
          `http://localhost:8080/api/v1/cart/db/update-quantity?idNguoiDung=${user.id}&loaiNguoiDung=${user.role}`,
          { chiTietSanPhamId: id, soLuong: newQty },
          { withCredentials: true }
        );
      } else {
        // Redis API
        res = await axios.put(`http://localhost:8080/api/v1/cart/update-quantity`, {
          cartId: cartId,
          chiTietSanPhamId: id,
          soLuong: newQty,
        });
      }
      const actualQty =
        res.data && typeof res.data.soLuong === "number" ? res.data.soLuong : newQty;
      setCart((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, qty: actualQty } : item));
        updateCartBadge(next);
        return next;
      });
  } catch (err) {
      // --- XỬ LÝ LỖI Ở ĐÂY ---
      const errorMessage = err.response?.data?.message || "Cập nhật số lượng thất bại!";
      toast.error(errorMessage); // <-- Hiển thị toast lỗi

      // Khôi phục lại số lượng ban đầu trên giao diện vì API đã thất bại
      setCart((prev) => {
        const next = prev.map((item) => (item.id === id ? { ...item, qty: originalQty } : item));
        updateCartBadge(next);
        return next;
      });
    }
  };
const handleQtyInputChange = (id, value) => {
  // Chuyển giá trị nhập vào thành số, nếu rỗng thì coi là 0
  const newQty = value === "" ? 0 : parseInt(value, 10);

  // Chỉ cập nhật nếu là số hợp lệ
  if (!isNaN(newQty)) {
    setCart((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      );
      // Không cần gọi updateCartBadge ở đây để tránh giật lag, sẽ gọi khi blur
      return next;
    });
  }
};

// Gửi yêu cầu API để cập nhật số lượng khi người dùng hoàn tất việc nhập (blur)
const handleQtyUpdateOnBlur = async (id) => {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  // Validate: số lượng phải ít nhất là 1
  const finalQty = Math.max(1, item.qty || 1);

  try {
    let res;
    if (user && user.id && user.role) {
      // DB API
      res = await axios.put(
        `http://localhost:8080/api/v1/cart/db/update-quantity?idNguoiDung=${user.id}&loaiNguoiDung=${user.role}`,
        { chiTietSanPhamId: id, soLuong: finalQty },
        { withCredentials: true }
      );
    } else {
      // Redis API
      res = await axios.put(`http://localhost:8080/api/v1/cart/update-quantity`, {
        cartId: cartId,
        chiTietSanPhamId: id,
        soLuong: finalQty,
      });
    }

    const actualQty =
      res.data && typeof res.data.soLuong === "number" ? res.data.soLuong : finalQty;

    // Cập nhật lại state với số lượng chính xác từ server (hoặc số lượng đã validate)
    setCart((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, qty: actualQty } : item
      );
      updateCartBadge(next); // Cập nhật badge ở đây
      return next;
    });
  } catch (err) {
    // Xử lý lỗi nếu cần, ví dụ: hiển thị lại số lượng cũ
    console.error("Failed to update quantity:", err);
  }
};
  // Listen to realtime cart badge update event (from other tabs/windows)
  useEffect(() => {
    function handleCartUpdated(e) {
      if (e && e.detail && typeof e.detail.count === "number") {
        // Just update badge, not cart itself
        // (cart update is handled by fetchCart)
      } else {
        // Could refetch cart here if needed
      }
    }
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, []);

  // Selected total
  const total = cart
    .filter((item) => selected.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Box sx={{ bgcolor: "#edf6fb", minHeight: "100vh" }}>
      {/* Banner */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 90, md: 140 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          mt: 2,
          px: 0,
          background: "linear-gradient(90deg, #ffe169 0%, #ffc94a 60%, #ffb55e 100%)",
          borderRadius: { xs: "0 0 28px 28px", md: "0 60px 0 60px" },
          boxShadow: "0 8px 32px 0 #ffd58033",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Nút về cửa hàng bên trái */}
        <Button
          component={RouterLink}
          to="/shop"
          startIcon={<HomeIcon />}
          variant="outlined"
          sx={{
            position: "absolute",
            left: { xs: 12, sm: 32 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            border: "1.5px solid #bde0fe",
            borderRadius: 3,
            color: "#1976d2",
            fontWeight: 700,
            fontSize: 15,
            px: 2.3,
            py: 1,
            boxShadow: "0 2px 8px 0 #bde0fe22",
            "&:hover": {
              background: "#e3f0fa",
              color: "#0d47a1",
              borderColor: "#1976d2",
            },
            zIndex: 2,
          }}
        >
          Về cửa hàng
        </Button>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          justifyContent="center"
          sx={{ mx: "auto" }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ShoppingCartIcon sx={{ fontSize: 33, color: "#1976d2" }} />
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#1976d2",
                px: 2.2,
                py: 0.7,
                borderRadius: 5,
                fontSize: { xs: 21, sm: 27 },
                bgcolor: "#fff",
                border: "1.5px solid #bde0fe",
                boxShadow: "0 2px 8px 0 #bde0fe22",
                textAlign: "center",
                minWidth: 160,
              }}
            >
              Giỏ Hàng
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {/* Tabs */}
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 2px 8px 0 #bde0fe22",
            px: 1,
            minHeight: 48,
            "& .MuiTab-root": { fontWeight: 700, fontSize: 17, minHeight: 48 },
            "& .Mui-selected": { color: "#1976d2" },
          }}
        >
          <Tab label="Giỏ hàng" />
          <Tab label="Đơn hàng" />
          <Tab label="Lịch sử đơn hàng" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 1, md: 2 }, minHeight: 400, mt: 2 }}>
          {cart.length === 0 ? (
            <Paper
              sx={{
                p: 5,
                textAlign: "center",
                mt: 8,
                bgcolor: "#e3f0fa",
                borderRadius: 5,
                border: "1.5px solid #bde0fe",
              }}
            >
              <Typography variant="h5" fontWeight={700} color="#1976d2" gutterBottom>
                Giỏ hàng của bạn đang trống!
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/shop"
                startIcon={<HomeIcon />}
                sx={{
                  mt: 2.5,
                  fontWeight: 700,
                  borderRadius: 3,
                  px: 2.8,
                  background: "linear-gradient(90deg,#bde0fe 0%,#e3f0fa 100%)",
                  color: "#1976d2",
                  "&:hover": { background: "#1976d2", color: "#fff" },
                }}
              >
                Về cửa hàng
              </Button>
            </Paper>
          ) : (
            <>
              <Stack direction="row" alignItems="center" spacing={1.2} mb={2} ml={0.3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectAll}
                      indeterminate={selected.length > 0 && selected.length < cart.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: "#1976d2",
                        "&.Mui-checked": { color: "#1976d2" },
                      }}
                    />
                  }
                  label={
                    <Typography fontWeight={700} color="#1976d2" fontSize={16}>
                      Chọn tất cả
                    </Typography>
                  }
                />
                <Typography color="#888" fontSize={15}>
                  ({selected.length} sản phẩm đã chọn)
                </Typography>
              </Stack>
              {cart.map((item, idx) => (
                <CartBlock key={item.id || `cartitem-${idx}`}>
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                    sx={{
                      color: "#1976d2",
                      "&.Mui-checked": { color: "#1976d2" },
                      mx: 1,
                    }}
                  />
                  <Box
                    component="img"
                    src={item.img}
                    alt={item.name}
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 3,
                      objectFit: "cover",
                      mr: 2.2,
                      border: "1.5px solid #bde0fe",
                      bgcolor: "#e3f0fa",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={800} fontSize={18} color="#1769aa">
                      {item.name}
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                      <Typography fontWeight={900} fontSize={17} color="#e53935">
                        {item.price.toLocaleString()}₫
                      </Typography>
                      {item.oldPrice > 0 && item.oldPrice !== item.price && (
                        <Typography
                          sx={{
                            color: "#bde0fe",
                            textDecoration: "line-through",
                            fontSize: 15.5,
                            fontWeight: 700,
                          }}
                        >
                          {item.oldPrice.toLocaleString()}₫
                        </Typography>
                      )}
                      {item.discount && (
                        <Chip
                          label={item.discount}
                          color="primary"
                          sx={{
                            fontWeight: 900,
                            bgcolor: "#1976d2",
                            color: "#fff",
                            fontSize: 13.5,
                            px: 1.1,
                          }}
                          size="small"
                        />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={2} mt={1.2} alignItems="center">
                      <Typography color="#888" fontSize={14}>
                        Size: <b style={{ color: "#1976d2" }}>{item.size}</b>
                      </Typography>
                      <Typography color="#888" fontSize={14}>
                        Màu:{" "}
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            width: 17,
                            height: 17,
                            borderRadius: "50%",
                            background: item.color,
                            border: `2px solid ${
                              item.color && item.color.toLowerCase() === "#fff" ? "#bbb" : "#bde0fe"
                            }`,
                            ml: 0.5,
                            verticalAlign: "middle",
                          }}
                        />
                        {item.tenMauSac ? (
                          <span
                            style={{
                              marginLeft: 8,
                              color: "#1769aa",
                              fontWeight: 600,
                              fontSize: 14,
                            }}
                          >
                            {item.tenMauSac}
                          </span>
                        ) : null}
                      </Typography>
                    </Stack>
                  </Box>
                  {/* Quantity group with - num + */}
                  <Stack spacing={0.7} alignItems="center" sx={{ minWidth: 112 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        sx={{
                          border: "1.5px solid #bde0fe",
                          color: "#1976d2",
                          bgcolor: "#e3f0fa",
                          "&:hover": { bgcolor: "#d1eaff", borderColor: "#1976d2" },
                        }}
                        onClick={() => changeQty(item.id, -1)}
                        disabled={item.qty <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                     <TextField
  type="number"
  value={item.qty}
  onChange={(e) => handleQtyInputChange(item.id, e.target.value)}
  onBlur={() => handleQtyUpdateOnBlur(item.id)}
  size="small"
  inputProps={{
    min: 1,
    style: {
      textAlign: "center",
      fontWeight: 700,
      color: "#1976d2",
      padding: "8px 0", // Điều chỉnh padding cho cân đối
    },
  }}
  sx={{
    width: 60, // Tăng nhẹ chiều rộng để vừa vặn hơn
    mx: 0.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.2,
      background: "#fff",
      "& fieldset": {
        borderColor: "#bde0fe",
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },
    // Ẩn các nút tăng/giảm mặc định của trình duyệt
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  }}
/>
                      <IconButton
                        size="small"
                        sx={{
                          border: "1.5px solid #bde0fe",
                          color: "#1976d2",
                          bgcolor: "#e3f0fa",
                          "&:hover": { bgcolor: "#d1eaff", borderColor: "#1976d2" },
                        }}
                        onClick={() => changeQty(item.id, 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Typography color="#777" fontSize={13}>
                      SL
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleRemove(item.id)}
                      title="Xóa khỏi giỏ"
                      sx={{
                        bgcolor: "#fff",
                        border: "1.5px solid #bde0fe",
                        mt: 1,
                        "&:hover": { bgcolor: "#e3f0fa", borderColor: "#e53935", color: "#e53935" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CartBlock>
              ))}
              <Divider sx={{ my: 4 }} />
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 5,
                  bgcolor: "#e3f0fa",
                  border: "1.5px solid #bde0fe",
                  maxWidth: 420,
                  ml: "auto",
                  boxShadow: "0 2px 12px 0 #bde0fe33",
                }}
              >
                <Stack direction="row" justifyContent="space-between" mb={1.2}>
                  <Typography fontWeight={700} color="#1769aa" fontSize={17}>
                    Tổng tiền:
                  </Typography>
                  <Typography fontWeight={900} color="#e53935" fontSize={18}>
                    {total.toLocaleString()}₫
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={selected.length === 0}
                  sx={{
                    mt: 2,
                    fontWeight: 900,
                    fontSize: 17,
                    borderRadius: 2.5,
                    background: "linear-gradient(90deg,#1976d2 0%,#bde0fe 100%)",
                    color: "#fff",
                    py: 1.2,
                    "&:hover": { background: "#1769aa", color: "#fff" },
                  }}
                  onClick={() => {
                    navigate("/order", {
                      state: { selectedItems: cart.filter((item) => selected.includes(item.id)) },
                    });
                  }}
                >
                  Tiến hành đặt hàng ({selected.length})
                </Button>
              </Paper>
            </>
          )}
        </Box>
      )}
      {tab === 1 && (
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
          <OrderListTab user={user} />
        </Box>
      )}
      {tab === 2 && (
        <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
          <OrderHistoryTab user={user} />
        </Box>
      )}
      <Box mt={8}>
        <Footer />
      </Box>
    </Box>
  );
}
