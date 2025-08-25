import React, { useState, useEffect } from "react";
import {
    Box, Grid, Paper, TextField, Button, Typography, Radio, FormControlLabel,
    RadioGroup, InputAdornment, Avatar, Divider, Stack, Autocomplete, Modal, IconButton
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VNPAY_LOGO from "../../../assets/images/vnPay.png";
import {
    cartItem, SIZE_OPTIONS, PRIMARY_BLUE, WHITE, LIGHT_BLUE_BG, BORDER_COLOR, DISABLED_BG, MAIN_TEXT_COLOR
} from "./constants";
import ModalCouponContent from "./ModalCouponContent";
import SizeModalContent from "./SizeModalContent";
import Footer from "../components/footer";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddressDialogClient from "../components/AddressDialog";

// --- GHN CONFIG ---
const GHN_API_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = "03b71be1-6891-11f0-9e03-7626358ab3e0";
const GHN_SHOP_ID = 5908591;

const ghnApi = axios.create({
    baseURL: GHN_API_BASE_URL,
    headers: {
        token: GHN_TOKEN,
        "Content-Type": "application/json",
    },
});

const formatCurrency = (amount) =>
    `${Number(amount).toLocaleString("vi-VN")}₫`;

export default function OrderForm() {
    const location = useLocation();
    const navigate = useNavigate();

    const selectedItems = location.state?.selectedItems || [];
    useEffect(() => {
        if (!selectedItems.length) {
            toast.warn("Vui lòng chọn sản phẩm để đặt hàng!");
            navigate("/card");
        }
    }, [selectedItems, navigate]);

    const [cartItems, setCartItems] = useState(selectedItems);

    // Lấy user từ API /me thay vì localStorage!
    const [user, setUser] = useState(null);
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get("http://localhost:8080/api/auth/me", {
                    withCredentials: true
                });
                if (res?.data && res.data.id) {
                    setUser({
                        id: res.data.id,
                        username: res.data.username,
                        role: res.data.role,
                        email: res.data.email || ""
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

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        province: null,
        district: null,
        ward: null,
        note: "",
        coupon: "",
        payment: "cod"
    });
    const [appliedCoupon, setAppliedCoupon] = useState("");
    const [success, setSuccess] = useState(false);
    const [couponModalOpen, setCouponModalOpen] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const [shippingFee, setShippingFee] = useState(0);
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);

    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const [hasSelectedAddress, setHasSelectedAddress] = useState(false);

    const addressSelect = (select) => {
        console.log("Địa chỉ đã chọn:", select);
        setHasSelectedAddress(true);
        handleAddressSelect(select);
    };

    // Hàm xử lý địa chỉ
    const handleAddressSelect = async (address) => {
        if (!address) return;

        // Set địa chỉ cụ thể
        setForm(prevForm => ({
            ...prevForm,
            address: address.diaChiCuThe || ""
        }));

        // Tìm province object
        const provinceObj = provinces.find(p =>
            p.ProvinceName === address.tinhThanhPho ||
            p.ProvinceID === address.tinhThanhPhoId
        );

        if (provinceObj) {
            setForm(prevForm => ({ ...prevForm, province: provinceObj }));

            try {
                const districtResponse = await ghnApi.get("/master-data/district", {
                    params: { province_id: provinceObj.ProvinceID },
                });

                if (districtResponse.data?.data) {
                    const districtsData = districtResponse.data.data;
                    setDistricts(districtsData);

                    const districtObj = districtsData.find(d =>
                        d.DistrictName === address.quanHuyen ||
                        d.DistrictID === address.quanHuyenId
                    );

                    if (districtObj) {
                        setForm(prevForm => ({ ...prevForm, district: districtObj }));

                        try {
                            const wardResponse = await ghnApi.get("/master-data/ward", {
                                params: { district_id: districtObj.DistrictID },
                            });

                            if (wardResponse.data?.data) {
                                const wardsData = wardResponse.data.data;
                                setWards(wardsData);

                                const wardObj = wardsData.find(w =>
                                    w.WardName === address.xaPhuong ||
                                    w.WardCode === address.xaPhuongCode
                                );

                                if (wardObj) {
                                    setForm(prevForm => ({ ...prevForm, ward: wardObj }));
                                }
                            }
                        } catch (error) {
                            console.error("Error loading wards:", error);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading districts:", error);
            }
        }
    };

    useEffect(() => {
        const fetchCustomerData = async () => {
            if (!user?.id) return;

            try {
                const response = await axios.get(`http://localhost:8080/khachHang/${user.id}`, {
                    withCredentials: true
                });
                const customerRes = response?.data?.data || response?.data;

                // Set thông tin cơ bản
                setForm(prevForm => ({
                    ...prevForm,
                    name: customerRes.tenKhachHang,
                    phone: customerRes.sdt,
                    email: customerRes.email,
                }));

                // Lấy địa chỉ mặc định
                if (!hasSelectedAddress) {
                    const defaultAddress = customerRes.diaChis?.find(d => Number(d.trangThai) === 1);
                    if (defaultAddress) {
                        await handleAddressSelect(defaultAddress);
                    }
                }
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        if (provinces.length > 0) {
            fetchCustomerData();
        }
    }, [user?.id, provinces, addressDialogOpen]);


    // 1. Lấy province từ GHN
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await ghnApi.get("/master-data/province");
                if (response.data?.data) setProvinces(response.data.data);
            } catch {
                toast.error("Không thể tải danh sách tỉnh/thành phố.");
            }
        };
        fetchProvinces();
    }, []);

    // 2. Lấy district theo province
    useEffect(() => {
        if (form.province) {
            const fetchDistricts = async () => {
                try {
                    const response = await ghnApi.get("/master-data/district", {
                        params: { province_id: form.province.ProvinceID },
                    });
                    if (response.data?.data) setDistricts(response.data.data);
                } catch {
                    toast.error("Không thể tải danh sách quận/huyện.");
                }
            };
            fetchDistricts();
        } else setDistricts([]);
        setForm(prev => ({ ...prev, district: null, ward: null }));
        setWards([]);
        setShippingFee(0);
    }, [form.province]);

    // 3. Lấy ward theo district
    useEffect(() => {
        if (form.district) {
            const fetchWards = async () => {
                try {
                    const response = await ghnApi.get("/master-data/ward", {
                        params: { district_id: form.district.DistrictID },
                    });
                    if (response.data?.data) setWards(response.data.data);
                } catch {
                    toast.error("Không thể tải danh sách phường/xã.");
                }
            };
            fetchWards();
        } else setWards([]);
        setForm(prev => ({ ...prev, ward: null }));
        setShippingFee(0);
    }, [form.district]);

    // 4. Lấy voucher động theo tổng tiền
    const itemSubtotal = cartItems.reduce((sum, item) => sum + (item.price || item.salePrice) * (item.qty || 1), 0);
    useEffect(() => {
        const fetchVouchers = async () => {
            if (itemSubtotal <= 0) {
                setVouchers([]); setSelectedVoucher(null); return;
            }
            try {
                const body = { tongTienHoaDon: itemSubtotal, khachHang: null };
                const response = await axios.post(
                    "http://localhost:8080/PhieuGiamGiaKhachHang/query", body
                );
                setVouchers(response.data?.data?.content || []);
            } catch (e) {
                setVouchers([]); toast.error("Không thể tải mã giảm giá.");
            }
        };
        fetchVouchers();
    }, [itemSubtotal]);

    // 5. Tính phí vận chuyển sau khi chọn ward
    useEffect(() => {
        if (form.district && form.ward) {
            const getShippingFeeFromGHN = async () => {
                setIsCalculatingFee(true);
                try {
                    const fromDistricts = [
                        { district_id: 1442, ward_code: "21211" },
                        { district_id: 1450, ward_code: "217010" },
                        { district_id: 1443, ward_code: "21311" },
                    ];
                    let fee = 0;
                    for (const from of fromDistricts) {
                        try {
                            const serviceRes = await ghnApi.get("/v2/shipping-order/available-services", {
                                params: {
                                    shop_id: GHN_SHOP_ID,
                                    from_district: from.district_id,
                                    to_district: form.district.DistrictID,
                                }
                            });
                            if (!serviceRes.data?.data?.length) continue;
                            const service_id = serviceRes.data.data[0].service_id;
                            const payload = {
                                from_district_id: from.district_id,
                                from_ward_code: from.ward_code,
                                service_id,
                                to_district_id: form.district.DistrictID,
                                to_ward_code: form.ward.WardCode,
                                height: 20, length: 30, weight: 500, width: 15,
                                insurance_value: 0,
                            };
                            const feeRes = await ghnApi.post("/v2/shipping-order/fee", payload, {
                                headers: { ShopId: GHN_SHOP_ID },
                            });
                            if (feeRes.data?.code === 200) {
                                fee = feeRes.data.data.total;
                                break;
                            }
                        } catch { continue; }
                    }
                    if (!fee) fee = 40000;
                    setShippingFee(fee);
                } catch {
                    setShippingFee(40000);
                }
                setIsCalculatingFee(false);
            };
            getShippingFeeFromGHN();
        }
    }, [form.district, form.ward]);

    // 6. Tính discount động
    useEffect(() => {
        if (!selectedVoucher) { setDiscountAmount(0); return; }
        let discount = 0;
        if (selectedVoucher.loaiPhieu === 0 || selectedVoucher.phamTramGiamGia > 0)
            discount = itemSubtotal * (selectedVoucher.phamTramGiamGia / 100);
        else discount = selectedVoucher.soTienGiam;
        setDiscountAmount(Math.min(discount, selectedVoucher.giamToiDa));
    }, [selectedVoucher, itemSubtotal]);

    // Form Handlers
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleProvinceChange = (event, value) => {
        setForm(prev => ({ ...prev, province: value, district: null, ward: null }));
    };
    const handleDistrictChange = (event, value) => {
        setForm(prev => ({ ...prev, district: value, ward: null }));
    };
    const handleWardChange = (event, value) => {
        setForm(prev => ({ ...prev, ward: value }));
    };

    const handleApplyCoupon = () => {
        const found = vouchers.find(v => v.maPhieuGiamGia === form.coupon);
        if (found) {
            setAppliedCoupon(form.coupon);
            setSelectedVoucher(found);
        } else {
            setAppliedCoupon(""); setSelectedVoucher(null);
        }
        setCouponModalOpen(false);
    };

    const handleQuickCouponSelect = (coupon) => {
        setForm((previousValue) => ({
            ...previousValue,
            coupon: coupon.maPhieuGiamGia
        }));
        setAppliedCoupon(coupon.maPhieuGiamGia);
        setSelectedVoucher(coupon);
        setCouponModalOpen(false);
    };

    // Main submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name || !form.phone || !form.email || !form.address || !form.province || !form.district || !form.ward) {
            toast.warn("Vui lòng nhập đầy đủ thông tin giao hàng!");
            return;
        }
        if (!cartItems.length) {
            toast.warn("Giỏ hàng đang trống!");
            return;
        }

        const hoaDonOnlineRequest = {
            tenKhachHang: form.name,
            sdt: form.phone,
            email: form.email,
            diaChi: form.address,
            tenTinh: form.province?.ProvinceName || "",
            tenHuyen: form.district?.DistrictName || "",
            tenXa: form.ward?.WardName || "",
            ghiChu: form.note,
            loaiHoaDon: "online",
            phiVanChuyen: shippingFee,
            phieuGiamGia: selectedVoucher ? selectedVoucher.id : null,
            danhSachSanPham: cartItems.map(item => ({
                id: item.id,
                soLuong: item.qty || 1,
                donGia: item.price || item.salePrice,
            })),
        };

        // --- Gửi đúng API cho khách đã đăng nhập/khách lẻ ---
        let apiUrl = "http://localhost:8080/api/hoa-don/luu-hoa-don-online-chua-dang-nhap";
        if (user && user.id && user.role === "KHACHHANG") {
            hoaDonOnlineRequest.idKhachHang = Number(user.id);
            apiUrl = "http://localhost:8080/api/hoa-don/luu-hoa-don-online";
        } else if (user && user.id && (user.role === "NHANVIEN" || user.role === "ADMIN")) {
            hoaDonOnlineRequest.idNhanVien = Number(user.id);
            apiUrl = "http://localhost:8080/api/hoa-don/luu-hoa-don-online";
        }
        try {
            // 1. Lưu hóa đơn
            const resHoaDon = await axios.post(apiUrl, hoaDonOnlineRequest, {
                headers: { "Content-Type": "application/json" }
            });

            if (!(resHoaDon.data && resHoaDon.data.code === 1000)) {
                toast.error(resHoaDon.data?.message || "Không tạo được hóa đơn!");
                return;
            }
            const hoaDon = resHoaDon.data.data;
            if (!hoaDon || !hoaDon.id || isNaN(Number(hoaDon.id))) {
                toast.error("Không lấy được id hóa đơn từ BE!");
                return;
            }

            if (form.payment === "cod") {
                // 2. Lưu chi tiết thanh toán (COD)
                await axios.post("http://localhost:8080/chiTietThanhToan", {
                    idHoaDon: hoaDon.id,
                    idHinhThucThanhToan: 1, // 1: COD
                    maGiaoDich: null,
                    soTienThanhToan: Math.round(itemSubtotal + shippingFee - discountAmount),
                    ghiChu: "Thanh toán tiền mặt khi nhận hàng"
                }, {
                    headers: { "Content-Type": "application/json" }
                });

                setSuccess(true);
                toast.success("Đặt hàng thành công!");
                setTimeout(() => {
                    setSuccess(false);
                    navigate("/success");
                }, 2000);
            } else if (form.payment === "vnpay") {
                // 2. Gửi sang VNPAY, KHÔNG lưu chi tiết thanh toán ở FE
                const payload = {
                    amount: Math.round(itemSubtotal + shippingFee - discountAmount),
                    orderInfo: hoaDon.id.toString(),
                    bankcode: "",
                    ordertype: "other",
                    promocode: form.coupon || "",
                    locale: "vn",
                    urlReturn: window.location.origin + "/payment-result",
                };
                const res = await axios.post("http://localhost:8080/api/vnpay/submitOrder", payload, {
                    headers: { "Content-Type": "application/json" }
                });
                let payUrl = "";
                if (res.data.url) {
                    payUrl = res.data.url;
                } else if (typeof res.data === "string" && res.data.startsWith("redirect:")) {
                    payUrl = res.data.replace("redirect:", "");
                }
                if (payUrl) {
                    window.location.href = payUrl;
                } else {
                    toast.error("Không lấy được link thanh toán VNPAY");
                }
                // Chi tiết thanh toán sẽ được lưu ở backend khi callback thành công từ VNPAY
            }
        } catch (err) {
            toast.error("Lỗi khi xử lý đơn hàng!");
        }
    };

    const handleCartQuantityChange = (type, idx) => {
        setCartItems((prev) => prev.map((item, i) =>
            i === idx
                ? { ...item, qty: type === "increment" ? (item.qty || 1) + 1 : Math.max(1, (item.qty || 1) - 1) }
                : item
        ));
    };
    const handleRemoveCartItem = (idx) => {
        setCartItems((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <Box sx={{ bgcolor: LIGHT_BLUE_BG, minHeight: "100vh", py: 0 }}>
            {/* ...Banner giữ nguyên... */}
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
                    overflow: "hidden"
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="center"
                    sx={{ mx: "auto" }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        component={RouterLink}
                        to="/card"
                        sx={{
                            fontWeight: 700,
                            borderRadius: 3,
                            px: 2.1,
                            background: "#fff",
                            color: "#1976d2",
                            border: "1.5px solid #bde0fe",
                            boxShadow: "0 2px 8px 0 #bde0fe22",
                            "&:hover": {
                                background: "#e3f0fa",
                                color: "#0d47a1",
                                borderColor: "#1976d2",
                            },
                            fontSize: 15.5,
                            position: "absolute",
                            left: { xs: 8, sm: 28 },
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        Quay lại
                    </Button>
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
                            Thanh Toán Đơn Hàng
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
            <Grid container justifyContent="center" spacing={4}>
                <Grid item xs={12} md={7} lg={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 2, bgcolor: WHITE }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography fontWeight={700} fontSize={18} color={MAIN_TEXT_COLOR}>
                                Thông tin giao hàng
                            </Typography>
                            {user && (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            setSelectedCustomerId(user.id);
                                            setAddressDialogOpen(true);
                                        }}
                                        sx={{
                                            borderRadius: 2,
                                            color: "#1976d2",
                                            fontWeight: 600,
                                            textTransform: "none",
                                        }}
                                    >
                                        Chọn địa chỉ có sẵn
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Stack spacing={1.7} component="form" onSubmit={handleSubmit}>
                            <label>Họ và tên</label>
                            <TextField
                                placeholder="Nhập họ và tên"
                                name="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />
                            <label>Số điện thoại</label>
                            <TextField
                                placeholder="Nhập số điện thoại"
                                name="phone"
                                required
                                value={form.phone}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <img width={16} alt="vn" src="https://flagcdn.com/w20/vn.png" />
                                        </InputAdornment>
                                    ),
                                    style: { color: MAIN_TEXT_COLOR }
                                }}
                            />
                            <label>Email</label>
                            <TextField
                                placeholder="Nhập email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                                <Box sx={{ minWidth: 80 }}>
                                    <Typography variant="body2" fontWeight={600} color={MAIN_TEXT_COLOR} sx={{ mb: { xs: 0.5, sm: 0 }, whiteSpace: "nowrap" }}>
                                        Tỉnh / TP
                                    </Typography>
                                    <Autocomplete
                                        options={provinces}
                                        getOptionLabel={opt => opt?.ProvinceName || ""}
                                        value={form.province}
                                        onChange={handleProvinceChange}
                                        isOptionEqualToValue={(opt, val) => opt.ProvinceID === val?.ProvinceID}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Tỉnh / TP"
                                                size="small"
                                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2, minWidth: 140 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: MAIN_TEXT_COLOR }
                                                }}
                                            />
                                        )}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{ minWidth: 110 }}>
                                    <Typography variant="body2" fontWeight={600} color={MAIN_TEXT_COLOR} sx={{ mb: { xs: 0.5, sm: 0 }, whiteSpace: "nowrap" }}>
                                        Quận / Huyện
                                    </Typography>
                                    <Autocomplete
                                        options={districts}
                                        getOptionLabel={opt => opt?.DistrictName || ""}
                                        value={form.district}
                                        onChange={handleDistrictChange}
                                        isOptionEqualToValue={(opt, val) => opt.DistrictID === val?.DistrictID}
                                        disabled={!form.province}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Quận / Huyện"
                                                size="small"
                                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2, minWidth: 140 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: MAIN_TEXT_COLOR }
                                                }}
                                            />
                                        )}
                                        fullWidth
                                    />
                                </Box>
                                <Box sx={{ minWidth: 110 }}>
                                    <Typography variant="body2" fontWeight={600} color={MAIN_TEXT_COLOR} sx={{ mb: { xs: 0.5, sm: 0 }, whiteSpace: "nowrap" }}>
                                        Phường / Xã
                                    </Typography>
                                    <Autocomplete
                                        options={wards}
                                        getOptionLabel={opt => opt?.WardName || ""}
                                        value={form.ward}
                                        onChange={handleWardChange}
                                        isOptionEqualToValue={(opt, val) => opt.WardCode === val?.WardCode}
                                        disabled={!form.district}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Phường / Xã"
                                                size="small"
                                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2, minWidth: 140 }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: { color: MAIN_TEXT_COLOR }
                                                }}
                                            />
                                        )}
                                        fullWidth
                                    />
                                </Box>
                            </Stack>

                            <label>Địa chỉ cụ thể</label>
                            <TextField
                                placeholder="Địa chỉ, tên đường"
                                name="address"
                                required
                                value={form.address}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{ bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />

                            <Box sx={{
                                mt: 2, bgcolor: "#f5f9ff", borderRadius: 2, p: 2,
                                border: `1px solid ${BORDER_COLOR}`
                            }}>
                                <Typography fontWeight={600} fontSize={15} color={MAIN_TEXT_COLOR}>
                                    Phương thức thanh toán
                                </Typography>
                                <RadioGroup
                                    value={form.payment}
                                    onChange={handleChange}
                                    name="payment"
                                    sx={{ mt: 1 }}
                                >
                                    <FormControlLabel
                                        value="cod"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", height: 24 }}>
                                                <Typography fontWeight={600} fontSize={15} color={MAIN_TEXT_COLOR} sx={{ whiteSpace: "nowrap" }}>
                                                    Thanh toán khi nhận hàng (COD)
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: WHITE,
                                            p: 1,
                                            borderRadius: 2,
                                            border: `1.5px solid ${BORDER_COLOR}`,
                                            mt: 0,
                                            alignItems: "center"
                                        }}
                                    />
                                    <FormControlLabel
                                        value="vnpay"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: 24 }}>
                                                <Typography fontWeight={600} fontSize={15} color={PRIMARY_BLUE} sx={{ whiteSpace: "nowrap" }}>
                                                    Thanh toán qua VNPAY
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={VNPAY_LOGO}
                                                    alt="VNPAY Logo"
                                                    sx={{
                                                        height: 20,
                                                        width: 48,
                                                        ml: 0.5,
                                                        objectFit: "contain",
                                                        filter: "drop-shadow(0 0 1px #2274cf)"
                                                    }}
                                                />
                                            </Box>
                                        }
                                        sx={{
                                            bgcolor: WHITE,
                                            p: 1,
                                            borderRadius: 2,
                                            border: `1.5px solid ${BORDER_COLOR}`,
                                            mt: 1,
                                            alignItems: "center"
                                        }}
                                    />
                                </RadioGroup>
                            </Box>

                            <TextField
                                placeholder="Ghi chú đơn hàng"
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                size="small"
                                multiline
                                minRows={2}
                                fullWidth
                                sx={{ mt: 2, bgcolor: DISABLED_BG, borderRadius: 2 }}
                                InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                            />
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5} lg={4}>
                    <Stack spacing={2}>
                        <Paper elevation={2} sx={{ p: 2.2, borderRadius: 3, mb: 1, bgcolor: WHITE }}>
                            <Typography fontWeight={700} fontSize={16} mb={1} color={MAIN_TEXT_COLOR}>
                                Giỏ hàng
                            </Typography>
                            {cartItems.length > 0 ? (
                                cartItems.map((item, idx) => (
                                    <Box key={item.id} mb={idx < cartItems.length - 1 ? 2 : 0}>
                                        <Stack direction="row" spacing={1.5} alignItems="flex-start" position="relative">
                                            <Avatar
                                                src={item.img}
                                                alt={item.name}
                                                variant="rounded"
                                                sx={{ width: 64, height: 64, borderRadius: 2, flexShrink: 0 }}
                                            />
                                            <Box flex={1} minWidth={0}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Typography fontSize={15} fontWeight={700} color="#222" sx={{ pr: 2 }}>
                                                        {item.name}
                                                    </Typography>
                                                    <IconButton size="small" sx={{ color: "#bdbdbd" }} onClick={() => handleRemoveCartItem(idx)}>
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                                    <Box
                                                        sx={{
                                                            px: 2,
                                                            py: 0.2,
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            bgcolor: "#f6f6f6",
                                                            borderRadius: 2,
                                                            color: "#222",
                                                            border: "1px solid #e0e0e0",
                                                            display: "inline-block"
                                                        }}
                                                    >
                                                        {item.size}
                                                    </Box>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                                    {item.oldPrice > 0 && item.oldPrice !== (item.price || item.salePrice) && (
                                                        <Typography
                                                            sx={{
                                                                textDecoration: "line-through",
                                                                color: "#bdbdbd",
                                                                fontSize: 14,
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {item.oldPrice.toLocaleString()}₫
                                                        </Typography>
                                                    )}
                                                    <Typography
                                                        fontWeight={700}
                                                        color="#e53935"
                                                        fontSize={19}
                                                        sx={{ ml: 0 }}
                                                    >
                                                        {(item.price || item.salePrice).toLocaleString()}₫
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                bgcolor: "#fafbfc",
                                                borderRadius: 2,
                                                border: "1px solid #e0e0e0",
                                                px: 0.5,
                                                height: 36
                                            }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: (item.qty || 1) <= 1 ? "#e0e0e0" : "#222" }}
                                                    onClick={() => handleCartQuantityChange("decrement", idx)}
                                                    disabled={(item.qty || 1) <= 1}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <Typography
                                                    fontWeight={700}
                                                    fontSize={16}
                                                    sx={{
                                                        minWidth: 24,
                                                        textAlign: "center",
                                                        color: "#222",
                                                        mx: 1
                                                    }}
                                                >
                                                    {item.qty || 1}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    sx={{ color: "#222" }}
                                                    onClick={() => handleCartQuantityChange("increment", idx)}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Stack>
                                        {idx < cartItems.length - 1 && <Divider sx={{ my: 1.1, borderStyle: "dashed" }} />}
                                    </Box>
                                ))
                            ) : (
                                <Typography fontSize={15} color="#888" mt={2}>
                                    Giỏ hàng của bạn đang trống
                                </Typography>
                            )}
                        </Paper>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: WHITE, position: "relative" }}>
                            <Typography fontWeight={700} fontSize={16} mb={1} color={MAIN_TEXT_COLOR}>
                                Mã khuyến mãi
                            </Typography>
                            <Stack spacing={1}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        bgcolor: LIGHT_BLUE_BG,
                                        borderRadius: 2,
                                        border: `1px solid ${BORDER_COLOR}`,
                                        px: 1.5,
                                        py: 1,
                                        cursor: "pointer",
                                        transition: "border-color 0.2s",
                                        "&:hover": { borderColor: PRIMARY_BLUE }
                                    }}
                                    onClick={() => setCouponModalOpen(true)}
                                >
                                    <ConfirmationNumberOutlinedIcon sx={{ color: PRIMARY_BLUE, fontSize: 20, mr: 1 }} />
                                    <Typography sx={{ flex: 1, color: MAIN_TEXT_COLOR, fontWeight: 500, fontSize: 15 }}>
                                        {form.coupon
                                            ? ((vouchers.find((c) => c.maPhieuGiamGia === form.coupon)?.tenPhieu) || form.coupon)
                                            : "Chọn mã"}
                                    </Typography>
                                    <ChevronRightIcon sx={{ color: "#bbb", fontSize: 22 }} />
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                    <TextField
                                        placeholder="Nhập mã khuyến mãi"
                                        name="coupon"
                                        value={form.coupon}
                                        onChange={handleChange}
                                        size="small"
                                        sx={{ flex: 1, bgcolor: LIGHT_BLUE_BG, borderRadius: 2 }}
                                        InputProps={{ style: { color: MAIN_TEXT_COLOR } }}
                                    />
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            px: 2.5,
                                            ml: 1,
                                            minWidth: 0,
                                            minHeight: 36,
                                            boxShadow: "none",
                                            textTransform: "none",
                                            bgcolor: PRIMARY_BLUE,
                                            color: WHITE,
                                            '&:hover': { bgcolor: "#1762ac" }
                                        }}
                                        onClick={handleApplyCoupon}
                                    >
                                        Áp dụng
                                    </Button>
                                </Box>
                            </Stack>
                            <Modal
                                open={couponModalOpen}
                                onClose={() => setCouponModalOpen(false)}
                                aria-labelledby="modal-coupon"
                                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                                <ModalCouponContent
                                    onClose={() => setCouponModalOpen(false)}
                                    handleQuickCouponSelect={handleQuickCouponSelect}
                                />
                            </Modal>
                        </Paper>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: WHITE }}>
                            <Typography fontWeight={700} fontSize={16} mb={1} color={MAIN_TEXT_COLOR}>
                                Tóm tắt đơn hàng
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" mb={0.7}>
                                <Typography color="#666">Tổng tiền hàng</Typography>
                                <Typography color={MAIN_TEXT_COLOR} fontWeight={600}>
                                    {formatCurrency(itemSubtotal)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={0.7}>
                                <Typography color="#666">Phí vận chuyển</Typography>
                                <Typography color={MAIN_TEXT_COLOR} fontWeight={600}>
                                    {isCalculatingFee ? "Đang tính..." : formatCurrency(shippingFee)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={0.7}>
                                <Typography color="#666">Giảm giá</Typography>
                                <Typography color={MAIN_TEXT_COLOR} fontWeight={600}>- {formatCurrency(discountAmount)}</Typography>
                            </Stack>
                            <Divider sx={{ my: 1.2 }} />
                            <Stack direction="row" justifyContent="space-between" mb={1.4}>
                                <Typography fontWeight={700}>Tổng thanh toán</Typography>
                                <Typography fontWeight={900} fontSize={18} color={PRIMARY_BLUE}>
                                    {formatCurrency(itemSubtotal + shippingFee - discountAmount)}
                                </Typography>
                            </Stack>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    borderRadius: 2.5,
                                    fontWeight: 800,
                                    py: 1.3,
                                    fontSize: 16,
                                    boxShadow: "none",
                                    textTransform: "none",
                                    mt: 1,
                                    bgcolor: PRIMARY_BLUE,
                                    color: WHITE,
                                    '&:hover': { bgcolor: "#1762ac" }
                                }}
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleSubmit}
                                disabled={isCalculatingFee || (shippingFee === 0 && form.ward !== null)}
                            >
                                {isCalculatingFee ? "Đang tính phí..." : "Đặt hàng"}
                            </Button>
                            {success && (
                                <Typography color="success.main" mt={1} align="center" fontWeight={600}>
                                    Đặt hàng thành công!
                                </Typography>
                            )}
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
            <Footer />
            <AddressDialogClient
                customerId={selectedCustomerId}
                open={addressDialogOpen}
                onClose={() => setAddressDialogOpen(false)}
                onAddressSelect={addressSelect}
            />
        </Box>
    );
}