import React, { useState, useEffect } from "react";
import axios from "axios";

// Components from Material-UI
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Divider,
  Paper,
  Stack,
  TextField,
  Avatar,
  Badge,
  Autocomplete,
  Radio,
} from "@mui/material";
import { useCart } from "./CartProvider";
// Other components
import Header from "../components/header"; // Giả sử bạn đã có
import Footer from "../components/footer"; // Giả sử bạn đã có
import { toast } from "react-toastify";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import VNPay from "../../../assets/images/vnPay.png";
// --- Cấu hình API của Giao Hàng Nhanh ---
const GHN_API_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
// !!! THAY TOKEN VÀ SHOP ID CỦA BẠN VÀO ĐÂY !!!
const GHN_TOKEN = "03b71be1-6891-11f0-9e03-7626358ab3e0"; // Thay token của bạn
const GHN_SHOP_ID = 5908591; // Thay Shop ID của bạn

const ghnApi = axios.create({
  baseURL: GHN_API_BASE_URL,
  headers: {
    token: GHN_TOKEN,
    "Content-Type": "application/json",
  },
});

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
 // Ép kiểu sang số
  const num = Number(amount);

  // Nếu không phải số hoặc là NaN thì trả về 0 đ
  if (isNaN(num)) return "0 đ";

  return new Intl.NumberFormat("vi-VN").format(num) + " đ";
};

const CheckoutPage = () => {
  // === STATE QUẢN LÝ DỮ LIỆU GIỎ HÀNG ===
  const { cartItems } = useCart();
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  // === STATE CHO FORM VÀ ĐỊA CHỈ ===
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
      email: "",
  });

  // State cho việc lấy và chọn địa chỉ từ API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // === STATE CHO THANH TOÁN VÀ VẬN CHUYỂN ===
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  // === LOGIC XỬ LÝ ===

  // Giả lập fetch dữ liệu giỏ hàng ban đầu

  // --- LẤY DỮ LIỆU ĐỊA CHỈ TỪ API GHN ---
  const itemSubtotal = cartItems.reduce(
    // Sửa lại công thức tính cho đúng, dùng item.quantity
    (sum, item) => sum + item.price * (item.quantity || 0),
    0
  );
  useEffect(() => {
    const fetchVouchers = async () => {
      // Không gọi API nếu giỏ hàng trống
      if (itemSubtotal <= 0) {
        setVouchers([]); // Xóa danh sách voucher cũ
        setSelectedVoucher(null); // Bỏ chọn voucher
        return;
      }

      try {
        const requestBody = {
          tongTienHoaDon: itemSubtotal,
          khachHang: null, // Hoặc truyền thông tin khách hàng nếu có
        };
        // Thay đổi từ GET sang POST và gửi kèm body
        const response = await axios.post(
          "http://localhost:8080/PhieuGiamGiaKhachHang/query",
          requestBody
        );
        if (response.data?.data?.content) {
          setVouchers(response.data.data.content);
        } else {
          setVouchers([]); // Nếu không có voucher phù hợp, trả về mảng rỗng
        }
      } catch (error) {
        console.error("Lỗi khi tải mã giảm giá:", error);
        toast.error("Không thể tải danh sách mã giảm giá.");
      }
    };

    fetchVouchers();
  }, [itemSubtotal]);

  // 1. Lấy danh sách Tỉnh/Thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await ghnApi.get("/master-data/province");
        if (response.data?.data) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi API tỉnh/thành phố GHN:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố.");
      }
    };
    fetchProvinces();
  }, []);

  // 2. Lấy danh sách Quận/Huyện khi Tỉnh/Thành phố thay đổi
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await ghnApi.get("/master-data/district", {
            params: { province_id: selectedProvince.ProvinceID },
          });
          if (response.data?.data) {
            setDistricts(response.data.data);
          }
        } catch (error) {
          console.error("Lỗi API quận/huyện GHN:", error);
          toast.error("Không thể tải danh sách quận/huyện.");
        }
      };
      fetchDistricts();
    }
    // Reset quận/huyện và phường/xã khi tỉnh thay đổi
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    setShippingFee(0); // Reset phí ship
  }, [selectedProvince]);

  // 3. Lấy danh sách Phường/Xã khi Quận/Huyện thay đổi
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await ghnApi.get("/master-data/ward", {
            params: { district_id: selectedDistrict.DistrictID },
          });
          if (response.data?.data) {
            setWards(response.data.data);
          }
        } catch (error) {
          console.error("Lỗi API phường/xã GHN:", error);
          toast.error("Không thể tải danh sách phường/xã.");
        }
      };
      fetchWards();
    }
    // Reset phường/xã khi quận/huyện thay đổi
    setSelectedWard(null);
    setWards([]);
    setShippingFee(0); // Reset phí ship
  }, [selectedDistrict]);

  // --- TÍNH PHÍ VẬN CHUYỂN TỪ API GHN ---

  const getEstimatedShippingFee = (to_district_id) => {
    // Phí ước tính dựa trên khoảng cách (có thể customize)
    const feeRanges = {
      hanoi_inner: 25000,
      hanoi_outer: 35000,
      major_cities: 45000,
      other_provinces: 55000,
    };
    if (to_district_id >= 1442 && to_district_id <= 1465) return feeRanges.hanoi_inner;
    if (to_district_id >= 1466 && to_district_id <= 1490) return feeRanges.hanoi_outer;
    if (to_district_id >= 1460 && to_district_id <= 1520) return feeRanges.major_cities;
    return feeRanges.other_provinces;
  };

  const getShippingFeeFromGHN = async (shippingInfo) => {
    const { districtId: to_district_id, wardCode: to_ward_code } = shippingInfo;
    if (!to_district_id || !to_ward_code) return 0;

    // ===================================================================
    // SỬA LỖI TẠI ĐÂY: Đưa "Ba Đình" lên đầu để được ưu tiên
    // ===================================================================
    const alternativeDistricts = [
      { district_id: 1442, ward_code: "21211", name: "Ba Đình" }, // <<< ƯU TIÊN SỐ 1
      { district_id: 1450, ward_code: "217010", name: "Cầu Giấy" }, // <<< Dự phòng
      { district_id: 1443, ward_code: "21311", name: "Hoàn Kiếm" }, // <<< Dự phòng
    ];

    for (const altDistrict of alternativeDistricts) {
      try {
        // Bước 1: Lấy dịch vụ khả dụng
        const serviceResponse = await ghnApi.get("/v2/shipping-order/available-services", {
          params: {
            shop_id: GHN_SHOP_ID,
            from_district: altDistrict.district_id,
            to_district: to_district_id,
          },
        });

        if (!serviceResponse.data?.data || serviceResponse.data.data.length === 0) {
          console.log(`- Không có dịch vụ khả dụng từ: ${altDistrict.name}`);
          continue;
        }

        const service_id = serviceResponse.data.data[0].service_id;

        // Bước 2: Chuẩn bị payload để tính phí
        const feePayload = {
          from_district_id: altDistrict.district_id,
          from_ward_code: altDistrict.ward_code,
          service_id,
          to_district_id,
          to_ward_code,
          height: 20,
          length: 30,
          weight: 500,
          width: 15,
          insurance_value: 0,
        };

        // Bước 3: Gọi API tính phí
        const feeResponse = await ghnApi.post("/v2/shipping-order/fee", feePayload, {
          headers: { ShopId: GHN_SHOP_ID },
        });

        if (feeResponse.data?.code === 200) {
          console.log(`✅ Tính phí thành công từ điểm gửi: ${altDistrict.name}`);
          return feeResponse.data.data.total;
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.code_message_value ||
          error.response?.data?.message ||
          error.message;
        console.log(`❌ Lỗi khi thử với ${altDistrict.name}:`, errorMessage);
        continue;
      }
    }

    console.log("🔄 Tất cả điểm gửi đều lỗi, sử dụng phí ước tính.");
    const estimatedFee = getEstimatedShippingFee(to_district_id);
    toast.warning(
      `Không thể tính phí chính xác. Sử dụng phí ước tính: ${formatCurrency(estimatedFee)}`
    );
    return estimatedFee;
  };
  // 4. Tính toán phí vận chuyển khi phường/xã thay đổi
  useEffect(() => {
    if (selectedDistrict && selectedWard) {
      const calculateFee = async () => {
        setIsCalculatingFee(true);
        const shippingInfo = {
          districtId: selectedDistrict.DistrictID,
          wardCode: selectedWard.WardCode,
        };
        const fee = await getShippingFeeFromGHN(shippingInfo);
        setShippingFee(fee);
        setIsCalculatingFee(false);
      };
      calculateFee();
    }
  }, [selectedWard, selectedDistrict]); // Phụ thuộc vào cả district và ward

  // Hàm xử lý thay đổi cho các input text
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi nhấn nút Đặt Hàng
  const handlePlaceOrder = () => {
    // Validation
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
        !formData.email ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      customerInfo: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        province: selectedProvince.ProvinceName,
        district: selectedDistrict.DistrictName,
        ward: selectedWard.WardName,
        note: formData.note,
      },
      items: cartItems,
      paymentMethod: paymentMethod,
      subtotal: itemSubtotal,
      shippingFee: shippingFee,
      discount: discount,
      total: orderTotal,
    };

    console.log("Dữ liệu đơn hàng:", orderData);
    toast.success("Đặt hàng thành công! (Kiểm tra console log để xem chi tiết)");

    // TODO: Gửi `orderData` lên server của bạn
  };
  useEffect(() => {
    if (!selectedVoucher) {
      setDiscountAmount(0);
      return;
    }

    let calculatedDiscount = 0;
    // Giảm theo %
    if (selectedVoucher.loaiPhieu === 0 || selectedVoucher.phamTramGiamGia > 0) {
      calculatedDiscount = itemSubtotal * (selectedVoucher.phamTramGiamGia / 100);
    }
    // Giảm theo số tiền cố định
    else {
      calculatedDiscount = selectedVoucher.soTienGiam;
    }
    // So sánh với mức giảm tối đa
    const finalDiscount = Math.min(calculatedDiscount, selectedVoucher.giamToiDa);
    setDiscountAmount(finalDiscount);
  }, [selectedVoucher, itemSubtotal]);

  const orderTotal = itemSubtotal + shippingFee - discountAmount;
  // Tính toán tổng tiền

// Logic giảm giá có thể thêm ở đây

  // === GIAO DIỆN COMPONENT ===
  return (
    <Box sx={{ bgcolor: "#f5f5f5" }}>
      <Header />
      <Container maxWidth="lg" sx={{ pt: 5, pb: 10 }}>
        <Grid container spacing={4}>
          {/* CỘT BÊN TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Thông tin giao hàng
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                  <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="email"
                    name="email"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={provinces}
                    getOptionLabel={(option) => option.ProvinceName}
                    value={selectedProvince}
                    onChange={(event, newValue) => setSelectedProvince(newValue)}
                    isOptionEqualToValue={(option, value) => option.ProvinceID === value.ProvinceID}
                    renderInput={(params) => (
                      <TextField {...params} label="Tỉnh/Thành phố" required />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={districts}
                    getOptionLabel={(option) => option.DistrictName}
                    value={selectedDistrict}
                    onChange={(event, newValue) => setSelectedDistrict(newValue)}
                    isOptionEqualToValue={(option, value) => option.DistrictID === value.DistrictID}
                    disabled={!selectedProvince}
                    renderInput={(params) => <TextField {...params} label="Quận/Huyện" required />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={wards}
                    getOptionLabel={(option) => option.WardName}
                    value={selectedWard}
                    onChange={(event, newValue) => setSelectedWard(newValue)}
                    isOptionEqualToValue={(option, value) => option.WardCode === value.WardCode}
                    disabled={!selectedDistrict}
                    renderInput={(params) => <TextField {...params} label="Xã/Phường" required />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ cụ thể"
                    placeholder="Số nhà, tên tòa nhà, tên đường,..."
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Ghi chú"
                    name="note"
                    value={formData.note}
                    onChange={handleFormChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
                Phương thức thanh toán
              </Typography>

              {/* ========================================================= */}
              {/* === PHẦN ĐƯỢC THAY ĐỔI ĐỂ GIỐNG HÌNH ẢNH === */}
              {/* ========================================================= */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {/* Lựa chọn 1: Thanh toán khi nhận hàng (COD) */}
                <Paper
                  onClick={() => setPaymentMethod("cod")}
                  variant="outlined"
                  sx={{
                    p: 2,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    borderColor: paymentMethod === "cod" ? "primary.main" : "rgba(0, 0, 0, 0.23)",
                    borderWidth: paymentMethod === "cod" ? 2 : 1,
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Radio checked={paymentMethod === "cod"} />
                  <LocalAtmIcon
                    sx={{ color: "orange", width: 50, height: 50, objectFit: "contain", mx: 1 }}
                  />
                  <Typography fontWeight={500}>Thanh toán khi nhận hàng</Typography>
                </Paper>

                {/* Lựa chọn 2: Thanh toán VNPAY */}
                <Paper
                  onClick={() => setPaymentMethod("vnpay")}
                  variant="outlined"
                  sx={{
                    p: 2,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    borderColor: paymentMethod === "vnpay" ? "primary.main" : "rgba(0, 0, 0, 0.23)",
                    borderWidth: paymentMethod === "vnpay" ? 2 : 1,
                    "&:hover": {
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <Radio checked={paymentMethod === "vnpay"} />
                  <Box
                    component="img"
                    src={VNPay} // Thay bằng đường dẫn đến logo VNPAY của bạn
                    sx={{ width: 50, height: 50, objectFit: "contain", mx: 1 }}
                  />
                  <Typography fontWeight={500}>Thanh toán VNPAY</Typography>
                </Paper>
              </Stack>
            </Paper>
          </Grid>

          {/* CỘT BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, position: "sticky", top: 100 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Đơn hàng
              </Typography>
              <Box sx={{ maxHeight: "300px", overflowY: "auto", pr: 1, mt: 2 }}>
                <Stack spacing={2}>
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <Stack direction="row" key={item.id} spacing={2} alignItems="center">
                        {/* ✨ 5. Cập nhật Badge */}
                        <Badge
                          badgeContent={item.quantity}
                          color="primary"
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                            mt: 2,
                          }}
                          slotProps={{
                            badge: {
                              sx: {
                                // Dịch sang phải 5px và dịch xuống dưới 5px
                                transform: "translate(4px, 1px)",
                              },
                            },
                          }}
                        >
                          <Avatar
                            src={item.image}
                            variant="rounded"
                            sx={{ width: 64, height: 64, border: "1px solid #ddd" }}
                          />
                        </Badge>
                        <Box flexGrow={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>

                          <Typography variant="caption" color="text.secondary" display="block">
                            {item.color}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            Size: {item.size}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(item.price)}
                        </Typography>
                      </Stack>
                    ))
                  ) : (
                    <Typography color="text.secondary" textAlign="center">
                      Không có sản phẩm nào trong giỏ hàng.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />
 <Typography variant="h6" fontWeight={600} mb={2}>
                Phiếu giảm giá
              </Typography>
              {/* ComboBox chọn mã giảm giá */}
              <Autocomplete
                options={vouchers}
                getOptionLabel={(option) => option.maPhieuGiamGia}
                value={selectedVoucher}
                onChange={(event, newValue) => {
                  setSelectedVoucher(newValue);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="Không có mã giảm giá phù hợp"
                renderInput={(params) => (
                  <TextField {...params} label="Chọn hoặc nhập mã giảm giá" />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id}>
                    <Stack>
                      <Typography variant="body2" fontWeight="bold">
                        {option.maPhieuGiamGia}
                      </Typography>
                      <Typography variant="caption">{option.tenPhieu}</Typography>
                      <Typography variant="caption" color="primary.main">
                        {`Giảm tối đa: ${formatCurrency(option.giamToiDa)}`}
                      </Typography>
                        <Typography variant="caption" color="primary.main">
                        {`Cho đơn từ : ${formatCurrency(option.dieuKienGiam)}`}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              />
              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Tạm tính</Typography>
                  <Typography fontWeight={500}>{formatCurrency(itemSubtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Phí vận chuyển</Typography>
                  <Typography fontWeight={500}>
                    {isCalculatingFee ? "Đang tính..." : formatCurrency(shippingFee)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Giảm giá</Typography>
                  <Typography fontWeight={500}>- {formatCurrency(discountAmount)}</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Tổng cộng
                </Typography>
                <Typography variant="h6" fontWeight={600} color="error.main">
                  {formatCurrency(orderTotal)}
                </Typography>
              </Stack>

              <Button
                fullWidth
                variant="contained"
                color="error"
                size="large"
                sx={{ py: 1.5, fontWeight: 700 }}
                onClick={handlePlaceOrder}
                disabled={isCalculatingFee || (shippingFee === 0 && selectedWard !== null)}
              >
                {isCalculatingFee ? "Đang tính phí..." : "ĐẶT HÀNG"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default CheckoutPage;
