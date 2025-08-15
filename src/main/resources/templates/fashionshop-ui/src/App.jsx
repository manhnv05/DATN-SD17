import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SoftBox from "components/SoftBox";
import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routesAdmin from "./layouts/routes/routes-admin";
import routesClient from "./layouts/routes/routes-client";
import { useSoftUIController, setMiniSidenav } from "context";
import "bootstrap/dist/css/bootstrap.min.css";
import brand from "assets/images/logo4.png";
import Home from "layouts/client/home";
import PropTypes from "prop-types";
import SanPham from "./layouts/admin/SanPham/sanphan";
import ThuongHieu from "./layouts/admin/SanPham/thuonghieu";
import ChatLieu from "./layouts/admin/SanPham/chatlieu";
import DanhMuc from "./layouts/admin/SanPham/danhmuc";
import KichThuoc from "./layouts/admin/SanPham/kichthuoc";
import MauSac from "./layouts/admin/SanPham/mausac";
import TayAo from "./layouts/admin/SanPham/tayao";
import CoAo from "./layouts/admin/SanPham/coao";
import HinhAnh from "./layouts/admin/SanPham/hinhanh";
import ProductForm from "./layouts/admin/SanPham/themsp";
import ProductDetailForm from "./layouts/admin/SanPham/chitiet";
import GiamGia from "./layouts/admin/GiamGia";
import OrderManagementPage from "./layouts/admin/HoaDon/pages/OrderManagementPage";
import OrderDetailPage from "./layouts/admin/HoaDon/pages/OrderDetailPage";
import PhieuGiamPage from "./layouts/admin/phieugiamgia/phieugiam";
import AddPhieuGiam from "./layouts/admin/phieugiamgia/addPhieuGiam";
import UpdatePhieuGiam from "./layouts/admin/phieugiamgia/updatePhieuGiamGia";
import KhachHang from "./layouts/admin/khachhang";
import AddKhachHang from "./layouts/admin/khachhang/add";
import DetailKhachHang from "./layouts/admin/khachhang/detail";
import UpdateKhachHang from "./layouts/admin/khachhang/update";
import NhanVien from "./layouts/admin/nhanvien";
import AddNhanVien from "./layouts/admin/nhanvien/add";
import DetailNhanVien from "./layouts/admin/nhanvien/detail";
import UpdateNhanVien from "./layouts/admin/nhanvien/update";
import SalesDashboardPage from "./layouts/admin/BanHangTaiQuay/pages/SalesDashboardPage";
import DashboardStats from "./layouts/admin/thongke/thongke";
import AddDiscountEventPage from "./layouts/admin/GiamGia/AddDiscountEventPage";
import ViewDiscountEventPage from "./layouts/admin/GiamGia/ViewDiscountEventPage";
import OAuth2RedirectHandler from "./layouts/admin/authentication/OAuth2RedirectHandler";
import SignIn from "./layouts/admin/authentication/sign-in";
import SignUp from "./layouts/admin/authentication/sign-up";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lọc route theo role
function filterRoutesByRole(routes, role) {
    const allowedKeysForStaff = ["dashboard", "billing", "sales"];
    if (role === "QUANLY" || role === "QUANTRIVIEN") return routes;
    if (role === "NHANVIEN") {
        return routes.filter(route => allowedKeysForStaff.includes(route.key));
    }
    return [];
}

// Lấy tất cả route admin cho kiểm tra isAdminPage
function extractAllAdminRoutes(routes) {
    let allRoutes = [];
    routes.forEach(route => {
        if (route.route) {
            const baseRoute = "/" + route.route.replace(/^\//, "").split("/:")[0];
            allRoutes.push(baseRoute);
        }
        if (route.collapse) allRoutes = allRoutes.concat(extractAllAdminRoutes(route.collapse));
    });
    return allRoutes;
}

// Guard cho admin, KHÔNG redirect ở các route public
function RequireAdmin(props) {
    const role = localStorage.getItem("role");
    const location = useLocation();
    const pathname = location.pathname;
    const allowedForStaff = ["/dashboard", "/OrderManagementPage", "/sales", "/QuanLyHoaDon"];

    // DEBUG LOG
    console.log("[DEBUG] RequireAdmin check:", { pathname, role });

    // Nếu đang ở route đăng nhập/đăng ký thì KHÔNG redirect về /home
    if (
        pathname.startsWith("/authentication/sign-in")
        || pathname.startsWith("/authentication/sign-up")
        // || pathname.startsWith("/forgot-password") // Nếu có forgot-password page riêng thì mở dòng này
    ) {
        console.log("[DEBUG] RequireAdmin: Bypass for public route");
        return props.children;
    }

    // Nếu là nhân viên mà truy cập route không được phép
    if (role === "NHANVIEN" && !allowedForStaff.some(r => pathname.startsWith(r))) {
        console.log("[DEBUG] RequireAdmin: Staff, not allowed, redirect /dashboard");
        return <Navigate to="/dashboard" replace />;
    }
    // Nếu không phải role hợp lệ thì về home
    if (!["NHANVIEN", "QUANLY", "QUANTRIVIEN"].includes(role)) {
        console.log("[DEBUG] RequireAdmin: No valid role, redirect /home");
        return <Navigate to="/home" replace />;
    }
    console.log("[DEBUG] RequireAdmin: Access granted");
    return props.children;
}
RequireAdmin.propTypes = {
    children: PropTypes.node
};

function WrapperRTL(props) {
    return (
        <CacheProvider value={props.rtlCache}>
            <ThemeProvider theme={themeRTL}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </CacheProvider>
    );
}
WrapperRTL.propTypes = {
    children: PropTypes.node,
    rtlCache: PropTypes.object
};
function WrapperLTR(props) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
        </ThemeProvider>
    );
}
WrapperLTR.propTypes = {
    children: PropTypes.node
};

export default function App() {
    const [controller, dispatch] = useSoftUIController();
    const miniSidenav = controller.miniSidenav;
    const direction = controller.direction;
    const layout = controller.layout;
    const sidenavColor = controller.sidenavColor;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [rtlCache, setRtlCache] = useState(null);
    const location = useLocation();
    const pathname = location.pathname;
    const role = localStorage.getItem("role");
    const [showChat1, setShowChat1] = useState(true);
    const [showChat2, setShowChat2] = useState(true);

    const filteredRoutesAdmin = useMemo(() => filterRoutesByRole(routesAdmin, role), [role]);
    useMemo(() => {
        const cacheRtl = createCache({
            key: "rtl",
            stylisPlugins: [rtlPlugin]
        });
        setRtlCache(cacheRtl);
    }, []);
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };
    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);
    function getRoutes(routesArray) {
        return routesArray.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }
            if (route.route) {
                return (
                    <Route
                        exact
                        path={route.route}
                        element={route.component}
                        key={route.key}
                    />
                );
            }
            return null;
        });
    }

    const configsButton = showChat1 && (
        <SoftBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="60px"
            height="60px"
            bgColor="white"
            shadow="lg"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            sx={{
                cursor: "pointer",
                transition: "box-shadow 0.3s, background 0.3s",
                userSelect: "none",
                "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 132, 255, 0.3)",
                    background: "#e8f4ff"
                }
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "20px",
                    height: "20px",
                    background: "#ff5b5b",
                    color: "white",
                    borderRadius: "50%",
                    fontWeight: "bold",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 100
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowChat1(false);
                }}
                title="Đóng"
            >
                ×
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 48 48"
                aria-label="Messenger"
                style={{ userSelect: "none" }}
            >
                <radialGradient
                    id="messengerGradient"
                    cx="11.087"
                    cy="7.022"
                    r="47.612"
                    gradientTransform="matrix(1 0 0 -1 0 50)"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#1292ff" />
                    <stop offset=".079" stopColor="#2982ff" />
                    <stop offset=".23" stopColor="#4e69ff" />
                    <stop offset=".351" stopColor="#6559ff" />
                    <stop offset=".428" stopColor="#6d53ff" />
                    <stop offset=".754" stopColor="#df47aa" />
                    <stop offset=".946" stopColor="#ff6257" />
                </radialGradient>
                <path
                    fill="url(#messengerGradient)"
                    d="M44,23.5C44,34.27,35.05,43,24,43c-1.651,0-3.25-0.194-4.784-0.564
            c-0.465-0.112-0.951-0.069-1.379,0.145L13.46,44.77C12.33,45.335,11,44.513,11,43.249v-4.025
            c0-0.575-0.257-1.111-0.681-1.499C6.425,34.165,4,29.11,4,23.5C4,12.73,12.95,4,24,4S44,12.73,44,23.5z"
                />
                <path
                    opacity=".05"
                    d="M34.992,17.292c-0.428,0-0.843,0.142-1.2,0.411l-5.694,4.215
            c-0.133,0.1-0.28,0.15-0.435,0.15c-0.15,0-0.291-0.047-0.41-0.136l-3.972-2.99
            c-0.808-0.601-1.76-0.918-2.757-0.918c-1.576,0-3.025,0.791-3.876,2.116l-1.211,1.891l-4.12,6.695
            c-0.392,0.614-0.422,1.372-0.071,2.014c0.358,0.654,1.034,1.06,1.764,1.06c0.428,0,0.843-0.142,1.2-0.411l5.694-4.215
            c0.133-0.1,0.28-0.15,0.435-0.15c0.15,0,0.291-0.047,0.41-0.136l3.972,2.99c0.809,0.602,1.76,0.918,2.757,0.918
            c1.576,0,3.025-0.791,3.876-2.116l1.211-1.891l4.12-6.695c0.392-0.614,0.422-1.372,0.071-2.014
            C36.398,17.698,35.722,17.292,34.992,17.292z"
                />
                <path
                    opacity=".07"
                    d="M34.992,17.792c-0.319,0-0.63,0.107-0.899,0.31l-5.697,4.218
            c-0.216,0.163-0.468,0.248-0.732,0.248c-0.259,0-0.504-0.082-0.71-0.236l-3.973-2.991
            c-0.719-0.535-1.568-0.817-2.457-0.817c-1.405,0-2.696,0.705-3.455,1.887l-1.21,1.891l-4.115,6.688
            c-0.297,0.465-0.32,1.033-0.058,1.511c0.266,0.486,0.787,0.8,1.325,0.8c0.319,0,0.63-0.107,0.899-0.31l5.697-4.218
            c0.216-0.163,0.468-0.248,0.732-0.248c0.259,0,0.504,0.082,0.71,0.236l3.973,2.991
            c0.719,0.535,1.568,0.817,2.457,0.817c1.405,0,2.696-0.705,3.455-1.887l1.21-1.891l4.115-6.688
            c0.297-0.465,0.32-1.033,0.058-1.511C36.051,18.106,35.531,17.792,34.992,17.792z"
                />
                <path
                    fill="#fff"
                    d="M34.394,18.501l-5.7,4.22c-0.61,0.46-1.44,0.46-2.04,0.01L22.68,19.74
            c-1.68-1.25-4.06-0.82-5.19,0.94l-1.21,1.89l-4.11,6.68c-0.6,0.94,0.55,2.01,1.44,1.34l5.7-4.22c0.61-0.46,1.44-0.46,2.04-0.01
            l3.974,2.991c1.68,1.25,4.06,0.82,5.19-0.94l1.21-1.89l4.11-6.68C36.434,18.901,35.284,17.831,34.394,18.501z"
                />
            </svg>
        </SoftBox>
    );

    const configsButton2 = showChat2 && (
        <SoftBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="60px"
            height="60px"
            bgColor="white"
            shadow="lg"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="6.5rem"
            zIndex={99}
            sx={{
                cursor: "pointer",
                transition: "box-shadow 0.3s, background 0.3s",
                userSelect: "none",
                "&:hover": {
                    boxShadow: "0 8px 30px rgba(0, 132, 255, 0.3)",
                    background: "#e8f4ff"
                }
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "20px",
                    height: "20px",
                    background: "#ff5b5b",
                    color: "white",
                    borderRadius: "50%",
                    fontWeight: "bold",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 100
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowChat2(false);
                }}
                title="Đóng"
            >
                ×
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64" style={{ userSelect: "none" }}>
                <defs>
                    <linearGradient id="gr1" x1="39.938" x2="39.938" y1="30" y2="39" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
                        <stop offset="0" stopColor="#6dc7ff" />
                        <stop offset="1" stopColor="#e6abff" />
                    </linearGradient>
                    <linearGradient id="gr2" x1="31.999" x2="31.999" y1="10.961" y2="53" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
                        <stop offset="0" stopColor="#1a6dff" />
                        <stop offset="1" stopColor="#c822ff" />
                    </linearGradient>
                    <linearGradient id="gr3" x1="24" x2="24" y1="30" y2="39" gradientUnits="userSpaceOnUse" spreadMethod="reflect">
                        <stop offset="0" stopColor="#6dc7ff" />
                        <stop offset="1" stopColor="#e6abff" />
                    </linearGradient>
                </defs>
                <path fill="url(#gr1)" d="M39.938 30A3.938 4.5 0 1 0 39.938 39A3.938 4.5 0 1 0 39.938 30Z" />
                <path
                    fill="url(#gr2)"
                    d="M52.263,15.938c-4.816-3.871-13.024-4.925-13.372-4.968c-0.437-0.057-0.855,0.182-1.035,0.583
          c-0.025,0.055-0.543,1.23-0.778,2.782C35.086,14.073,33.313,14,31.983,14c-1.373,0-3.216,0.076-5.289,0.36
          c-0.233-1.564-0.757-2.753-0.782-2.808c-0.18-0.401-0.598-0.636-1.039-0.583c-0.337,0.043-8.322,1.099-13.188,5.013
          C9.122,18.35,4,32.125,4,44c0,0.173,0.045,0.344,0.131,0.495c3.427,6.02,13.558,8.432,15.837,8.505c0.011,0,0.021,0,0.032,0
          c0.303,0,0.591-0.138,0.781-0.375l3.495-4.368C26.519,48.703,29.098,49,32.024,49c2.911,0,5.474-0.294,7.706-0.737l3.49,4.362
          C43.409,52.862,43.697,53,44,53c0.011,0,0.021,0,0.032,0c2.274-0.073,12.39-2.495,15.835-8.547c0.086-0.15,0.131-0.321,0.131-0.495
          C59.999,32.105,54.877,18.349,52.263,15.938z M44.451,50.963l-2.56-3.2c5.635-1.499,8.568-3.846,8.744-3.99
          c0.426-0.35,0.487-0.978,0.139-1.405c-0.349-0.426-0.978-0.49-1.406-0.143C49.309,42.273,43.365,47,32.024,47
          c-11.331,0-17.322-4.719-17.394-4.776c-0.427-0.348-1.057-0.284-1.405,0.145c-0.349,0.428-0.285,1.058,0.144,1.407
          c0.177,0.144,3.121,2.48,8.748,3.979l-2.567,3.209c-2.906-0.323-10.736-2.658-13.547-7.236c0.078-11.308,5.015-24.405,6.989-26.232
          c3.547-2.851,9.281-4.06,11.356-4.42c0.133,0.413,0.281,0.98,0.373,1.611c-2.991,0.579-6.274,1.619-9.246,3.463
          c-0.47,0.291-0.614,0.907-0.323,1.376c0.292,0.471,0.907,0.616,1.376,0.323C21.928,16.5,28.529,16,31.983,16
          c3.467,0,10.089,0.5,15.49,3.85c0.164,0.102,0.346,0.15,0.526,0.15c0.334,0,0.662-0.168,0.851-0.473
          c0.292-0.469,0.147-1.085-0.323-1.376c-3.043-1.888-6.417-2.931-9.473-3.502c0.093-0.618,0.239-1.171,0.369-1.576
          c2.109,0.352,8.01,1.549,11.534,4.379c2.026,1.871,6.961,14.95,7.04,26.235C55.172,48.292,47.352,50.64,44.451,50.963z"
                />
                <path fill="url(#gr3)" d="M24 30A4 4.5 0 1 0 24 39A4 4.5 0 1 0 24 30Z" />
            </svg>
        </SoftBox>
    );

    const allAdminRoutes = useMemo(() => extractAllAdminRoutes(routesAdmin), []);
    // Sửa: chỉ là trang admin nếu KHÔNG phải trang login/signup
    const isAdminPage = allAdminRoutes.some((r) =>
            pathname.startsWith(r) &&
            !pathname.startsWith("/authentication/sign-in") &&
            !pathname.startsWith("/authentication/sign-up")
        // && !pathname.startsWith("/forgot-password")
    );

    // DEBUG LOG cho xác định route
    console.log("[DEBUG] pathname:", pathname, "| isAdminPage:", isAdminPage, "| role:", role);

    // Các route public (login, signup, forgot-password) phải luôn nằm ngoài guard/wildcard
    return direction === "rtl" ? (
        <WrapperRTL rtlCache={rtlCache}>
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {configsButton}
                {configsButton2}
                <Routes>
                    <Route path="/authentication/sign-in" element={<SignIn />} />
                    <Route path="/authentication/sign-up" element={<SignUp />} />
                    {/* Nếu forgot-password là page riêng, thêm route tại đây */}
                    {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
                    {isAdminPage ? (
                        <Route
                            path="*"
                            element={
                                <RequireAdmin>
                                    {layout === "dashboard" && (
                                        <Sidenav
                                            color={sidenavColor}
                                            brand={brand}
                                            routes={filteredRoutesAdmin}
                                            onMouseEnter={handleOnMouseEnter}
                                            onMouseLeave={handleOnMouseLeave}
                                        />
                                    )}
                                    <Routes>
                                        {getRoutes(routesAdmin)}
                                        <Route path="/SanPham" element={<SanPham />} />
                                        <Route path="/Brand" element={<ThuongHieu />} />
                                        <Route path="/material" element={<ChatLieu />} />
                                        <Route path="/category" element={<DanhMuc />} />
                                        <Route path="/size" element={<KichThuoc />} />
                                        <Route path="/color" element={<MauSac />} />
                                        <Route path="/sleeve" element={<TayAo />} />
                                        <Route path="/colar" element={<CoAo />} />
                                        <Route path="/image" element={<HinhAnh />} />
                                        <Route path="/SanPham/ThemMoi" element={<ProductForm />} />
                                        <Route path="/SanPham/ChiTietSanPham/:id" element={<ProductDetailForm />} />
                                        <Route path="/discount" element={<PhieuGiamPage />} />
                                        <Route path="/discount-event" element={<GiamGia />} />
                                        <Route path="/OrderManagementPage" element={<OrderManagementPage />} />
                                        <Route path="/QuanLyHoaDon/:orderId" element={<OrderDetailPage />} />
                                        <Route path="/discount-event/add" element={<AddDiscountEventPage />} />
                                        <Route path="/discount-event/view" element={<ViewDiscountEventPage />} />
                                        <Route path="/PhieuGiam/ThemMoi" element={<AddPhieuGiam />} />
                                        <Route path="/PhieuGiam/update/:id" element={<UpdatePhieuGiam />} />
                                        <Route path="/customer-management" element={<KhachHang />} />
                                        <Route path="/khachhang/add" element={<AddKhachHang />} />
                                        <Route path="/khachhang/detail/:id" element={<DetailKhachHang />} />
                                        <Route path="/khachhang/update/:id" element={<UpdateKhachHang />} />
                                        <Route path="/staff-management" element={<NhanVien />} />
                                        <Route path="/nhanvien/add" element={<AddNhanVien />} />
                                        <Route path="/nhanvien/detail/:id" element={<DetailNhanVien />} />
                                        <Route path="/nhanvien/update/:id" element={<UpdateNhanVien />} />
                                        <Route path="/sales" element={<SalesDashboardPage />} />
                                        <Route path="/dashboard" element={<DashboardStats />} />
                                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                                        <Route path="*" element={<Navigate to="/dashboard" />} />
                                    </Routes>
                                </RequireAdmin>
                            }
                        />
                    ) : (
                        <>
                            <Route path="/home" element={<Home />} />
                            {getRoutes(routesClient)}
                            <Route path="*" element={<Navigate to="/home" />} />
                        </>
                    )}
                </Routes>
            </>
        </WrapperRTL>
    ) : (
        <WrapperLTR>
            <>
                {configsButton}
                {configsButton2}
                <Routes>
                    <Route path="/authentication/sign-in" element={<SignIn />} />
                    <Route path="/authentication/sign-up" element={<SignUp />} />
                    {/* Nếu forgot-password là page riêng, thêm route tại đây */}
                    {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
                    {isAdminPage ? (
                        <Route
                            path="*"
                            element={
                                <RequireAdmin>
                                    {layout === "dashboard" && (
                                        <Sidenav
                                            color={sidenavColor}
                                            brand={brand}
                                            routes={filteredRoutesAdmin}
                                            onMouseEnter={handleOnMouseEnter}
                                            onMouseLeave={handleOnMouseLeave}
                                        />
                                    )}
                                    <Routes>
                                        {getRoutes(routesAdmin)}
                                        <Route path="/SanPham" element={<SanPham />} />
                                        <Route path="/Brand" element={<ThuongHieu />} />
                                        <Route path="/material" element={<ChatLieu />} />
                                        <Route path="/category" element={<DanhMuc />} />
                                        <Route path="/size" element={<KichThuoc />} />
                                        <Route path="/color" element={<MauSac />} />
                                        <Route path="/sleeve" element={<TayAo />} />
                                        <Route path="/colar" element={<CoAo />} />
                                        <Route path="/image" element={<HinhAnh />} />
                                        <Route path="/SanPham/ThemMoi" element={<ProductForm />} />
                                        <Route path="/SanPham/ChiTietSanPham/:id" element={<ProductDetailForm />} />
                                        <Route path="/discount" element={<PhieuGiamPage />} />
                                        <Route path="/discount-event" element={<GiamGia />} />
                                        <Route path="/OrderManagementPage" element={<OrderManagementPage />} />
                                        <Route path="/QuanLyHoaDon/:orderId" element={<OrderDetailPage />} />
                                        <Route path="/discount-event/add" element={<AddDiscountEventPage />} />
                                        <Route path="/discount-event/view" element={<ViewDiscountEventPage />} />
                                        <Route path="/PhieuGiam/ThemMoi" element={<AddPhieuGiam />} />
                                        <Route path="/PhieuGiam/update/:id" element={<UpdatePhieuGiam />} />
                                        <Route path="/customer-management" element={<KhachHang />} />
                                        <Route path="/khachhang/add" element={<AddKhachHang />} />
                                        <Route path="/khachhang/detail/:id" element={<DetailKhachHang />} />
                                        <Route path="/khachhang/update/:id" element={<UpdateKhachHang />} />
                                        <Route path="/staff-management" element={<NhanVien />} />
                                        <Route path="/nhanvien/add" element={<AddNhanVien />} />
                                        <Route path="/nhanvien/detail/:id" element={<DetailNhanVien />} />
                                        <Route path="/nhanvien/update/:id" element={<UpdateNhanVien />} />
                                        <Route path="/sales" element={<SalesDashboardPage />} />
                                        <Route path="/dashboard" element={<DashboardStats />} />
                                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                                        <Route path="*" element={<Navigate to="/dashboard" />} />
                                    </Routes>
                                </RequireAdmin>
                            }
                        />
                    ) : (
                        <>
                            <Route path="/home" element={<Home />} />
                            {getRoutes(routesClient)}
                            <Route path="*" element={<Navigate to="/home" />} />
                        </>
                    )}
                </Routes>
            </>
        </WrapperLTR>
    );
}