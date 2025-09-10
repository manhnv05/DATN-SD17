import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Badge,
    Button,
    Stack,
    useMediaQuery,
    Menu as MuiMenu,
    Divider,
    Avatar,
    Icon
} from "@mui/material";
import { ShoppingCart, Person, Menu as MenuIcon, Favorite as FavoriteIcon } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import logoImg from "assets/images/logo4.png";
import { logout } from "../data/logout";

const demoFavoriteCount = 4;

function Logo() {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <img
                src={logoImg}
                alt="COOLMATE"
                style={{
                    height: 80,
                    marginRight: 6,
                    borderRadius: 10,
                    boxShadow: "0 2px 8px 0 #bde0fe44",
                    objectFit: "contain",
                    background: "#fff"
                }}
            />
        </Box>
    );
}

const navItems = [
    { label: "OUTLET", red: true, route: "/outlet-sales" },
    { label: "Trang chủ", route: "/home" },
    { label: "Cửa hàng", route: "/shop" },
    { label: "Giới thiệu", route: "/about" },
    { label: "Bài viết", route: "/blog" },
    { label: "Liên hệ", route: "/contact" },
     { label: "Theo Dõi Đơn Hàng", route: "/tra-cuu-don-hang" },
];

export default function Header() {
    const isMobile = useMediaQuery('(max-width:900px)');
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // LOGIN USER STATE
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // CART COUNT STATE
    const [cartCount, setCartCount] = useState(0);

    // Lấy user info qua localStorage (KHÔNG dùng API /me)
  useEffect(() => {
    // --- BƯỚC 1: Tải thông tin ban đầu từ localStorage để UI hiển thị ngay lập tức ---
    const localRole = localStorage.getItem("role");
    const localUsername = localStorage.getItem("username");
    const localEmail = localStorage.getItem("email");
    const localAvatar = localStorage.getItem("avatar") || "";
    const localUserId = localStorage.getItem("userId") || localStorage.getItem("id");

    // Chỉ thực hiện nếu có thông tin đăng nhập trong localStorage
    if (localRole && localUsername) {
        // Set state ban đầu với dữ liệu từ localStorage
        const initialUser = {
            id: localUserId,
            username: localUsername,
            role: localRole,
            email: localEmail,
            avatar: localAvatar,
        };
        setUser(initialUser);
        setIsLoggedIn(true);
        setIsAdmin(localRole === "NHANVIEN" || localRole === "QUANLY" || localRole === "QUANTRIVIEN");

        // --- BƯỚC 2: Gọi API trong nền để cập nhật lại TÊN và AVATAR mới nhất ---
        const fetchLatestUserData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include",
                });

                if (response.ok) {
            const data = await response.json();

            // ✅ BẮT ĐẦU LOGIC MỚI DỰA TRÊN ROLE
            let latestUsername;
            // Giả sử biến localRole đã có sẵn ở scope bên ngoài của hàm này
            
            if (localRole === "KHACHHANG") {
                // Nếu là khách hàng, ưu tiên lấy 'tenKh', nếu không có thì giữ lại tên cũ
                latestUsername = data.tenKh || localUsername; 
            } else if (localRole === "NHANVIEN") {
                // Nếu là nhân viên, ưu tiên lấy 'tenNhanVien'
                latestUsername = data.tenNhanVien || localUsername;
            } else {
                // Các role còn lại (QUANLY, QUANTRIVIEN, etc.) sẽ hiển thị là Admin
                latestUsername = "Admin";
            }
            // KẾT THÚC LOGIC MỚI

            const latestAvatar = data.hinhAnh || localAvatar;

            // --- BƯỚC 3: Cập nhật state, nhưng GIỮ NGUYÊN ROLE từ localStorage ---
            setUser(currentUser => ({
                ...currentUser,
                username: latestUsername,
                avatar: latestAvatar,
            }));
        }
            } catch (error) {
                console.error("Lỗi khi làm mới thông tin người dùng:", error);
            }
        };

        fetchLatestUserData();
        
    } else {
        // Nếu không có gì trong localStorage, xác định là người dùng chưa đăng nhập
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
    }
}, []);
    // Hàm fetch số lượng sản phẩm giỏ hàng theo user hoặc guest
    const fetchCartCount = async (userObj = user) => {
        let count = 0;
        try {
            if (userObj && userObj.id && userObj.role) {
                // Đã đăng nhập
                const res = await fetch(
                    `http://localhost:8080/api/v1/cart/db?idNguoiDung=${userObj.id}&loaiNguoiDung=${userObj.role}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                if (Array.isArray(data)) {
                    count = data.reduce((total, item) => total + (item.soLuong || item.quantity || 0), 0);
                }
            } else {
                // Guest
                const cartId = localStorage.getItem("cartId");
                if (!cartId) {
                    setCartCount(0);
                    return;
                }
                const res = await fetch(`http://localhost:8080/api/v1/cart/${cartId}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    count = data.reduce((total, item) => total + (item.soLuong || item.quantity || 0), 0);
                }
            }
        } catch (err) {
            count = 0;
        }
        setCartCount(count);
    };

    // Khi user thay đổi, fetch lại cartCount
    useEffect(() => {
        fetchCartCount(user);
        // eslint-disable-next-line
    }, [user]);

    // Realtime cập nhật khi có sự kiện thêm/xóa giỏ hàng
    useEffect(() => {
        function handleCartUpdated(e) {
            if (e && e.detail && typeof e.detail.count === "number") {
                setCartCount(e.detail.count);
            } else {
                fetchCartCount(user);
            }
        }
        window.addEventListener("cart-updated", handleCartUpdated);
        return () => window.removeEventListener("cart-updated", handleCartUpdated);
        // eslint-disable-next-line
    }, [user]);

    // MENU HANDLERS
    function handleOpenMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleCloseMenu() {
        setAnchorEl(null);
    }

    function handleLogout() {
        logout()
            .catch((err) => {
                // eslint-disable-next-line
                console.error("Đăng xuất thất bại:", err.message);
            })
            .finally(() => {
                localStorage.removeItem("role");
                localStorage.removeItem("username");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
                localStorage.removeItem("userId");
                localStorage.removeItem("id");
                localStorage.removeItem("avatar");
                handleCloseMenu();
                setTimeout(function () {
                    navigate("/home");
                    setUser(null);
                    setIsLoggedIn(false);
                    setIsAdmin(false);
                    setCartCount(0);
                }, 150);
            });
    }

    function handleLogin() {
        handleCloseMenu();
        setTimeout(function () {
            navigate("/authentication/sign-in");
        }, 150);
    }

    function handleGoAdmin() {
        handleCloseMenu();
        setTimeout(function () {
            navigate("/dashboard");
        }, 150);
    }

    function handleAccount() {
        setTimeout(function () {
            navigate("/profile");
        }, 150);
        handleCloseMenu();
    }

    function handleGoFavorites() {
        navigate("/favorites");
    }

    // RENDER ACCOUNT MENU
    function renderAccountMenu() {
        if (!user) return null;
        return (
            <MuiMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        minWidth: 270,
                        borderRadius: 3,
                        p: 0.5,
                        userSelect: "none",
                        boxShadow: "0 4px 24px 0 #bde0fe44"
                    }
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                MenuListProps={{
                    sx: { userSelect: "none", p: 0 }
                }}
            >
                <Box sx={{
                    display: "flex", alignItems: "center", px: 2, pt: 2, userSelect: "none"
                }}>
                    <Avatar
                        src={user.avatar}
                        sx={{
                            bgcolor: "#1976d2", width: 46, height: 46, mr: 1.3, fontWeight: 700, fontSize: 22
                        }}
                    >
                        {user.username && user.username.length > 0 ? user.username[0].toUpperCase() : "A"}
                    </Avatar>
                    <Box>
                        <Box sx={{ fontWeight: 700, fontSize: 15.5, color: "#1a237e" }}>{user.username}</Box>
                        <Box sx={{ fontSize: 12.5, color: "#1976d2", fontWeight: 600, mt: 0.2 }}>
                            {user.role === "NHANVIEN" ? "Nhân viên"
                                : user.role === "QUANLY" ? "Quản lý"
                                    : user.role === "QUANTRIVIEN" ? "Quản trị viên"
                                        : "Khách hàng"}
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{ my: 1.5, bgcolor: "#e3f0fa" }} />
                <Box sx={{ px: 2, pb: 1 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 1, px: 1,
                            borderRadius: 2,
                            cursor: "pointer",
                            userSelect: "none",
                            fontSize: 15.2,
                            fontWeight: 500,
                            color: "#205072",
                            "&:hover": { background: "#e3f0fa", color: "#1976d2" },
                            transition: "all 0.11s"
                        }}
                        onMouseDown={e => e.preventDefault()}
                        onClick={handleAccount}
                    >
                        <Icon sx={{ mr: 1, color: "#1976d2" }}>person</Icon>
                        Tài khoản
                    </Box>
                    {isAdmin && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                py: 1, px: 1,
                                borderRadius: 2,
                                cursor: "pointer",
                                userSelect: "none",
                                fontSize: 15.2,
                                fontWeight: 500,
                                color: "#205072",
                                "&:hover": { background: "#e3f0fa", color: "#1769aa" },
                                transition: "all 0.11s"
                            }}
                            onMouseDown={e => e.preventDefault()}
                            onClick={handleGoAdmin}
                        >
                            <Icon sx={{ mr: 1, color: "#1769aa" }}>settings</Icon>
                            Trang quản lý
                        </Box>
                    )}
                </Box>
                <Divider sx={{ my: 1, bgcolor: "#e3f0fa" }} />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2, pb: 2,
                        cursor: "pointer",
                        color: "#e53935",
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: 15.2,
                        "&:hover": { background: "#ffeaea" },
                        transition: "all 0.11s"
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={handleLogout}
                >
                    <Icon sx={{ mr: 1, color: "#e53935" }}>logout</Icon>
                    Đăng xuất
                </Box>
            </MuiMenu>
        );
    }

    // RENDER
    return (
        <Box>
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "linear-gradient(90deg, #e3f0fa 0%, #bde0fe 100%)",
                    color: "#1976d2",
                    textAlign: "center",
                    fontSize: 13.4,
                    py: 0.8,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    boxShadow: "0 2px 8px 0 #bde0fe33"
                }}
            >
                Miễn phí vận chuyển với đơn hàng trên 500k, hàng pre-order còn được giảm thêm 5%.
            </Box>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: "#fff",
                    color: "#205072",
                    boxShadow: "none",
                    borderBottom: "1px solid #e3f0fa"
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: 62,
                        px: { xs: 1.5, md: 5 },
                        gap: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "relative"
                    }}
                >
                    <Box display="flex" alignItems="center" minWidth={isMobile ? 0 : 160} justifyContent="center">
                        {isMobile && (
                            <IconButton sx={{ mr: 0.5 }}>
                                <MenuIcon sx={{ fontSize: 28, color: "#1976d2" }} />
                            </IconButton>
                        )}
                        <Logo />
                    </Box>
                    {!isMobile && (
                        <Stack direction="row" spacing={1.9} sx={{ flex: 1, justifyContent: "center", ml: 2, mr: 2 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={item.route ? RouterLink : "button"}
                                    to={item.route}
                                    sx={{
                                        fontWeight: item.red ? 800 : 600,
                                        color: item.red ? "#e53935" : "#205072",
                                        fontSize: 15.2,
                                        px: 1.6,
                                        letterSpacing: 0.8,
                                        textTransform: "uppercase",
                                        borderRadius: 2.5,
                                        background: item.red ? "rgba(229,57,53,0.07)" : "transparent",
                                        boxShadow: item.red ? "0 2px 8px 0 #e5393522" : "none",
                                        "&:hover": {
                                            bgcolor: item.red ? "#ffe6e6" : "#e9f5fc",
                                            color: item.red ? "#d32f2f" : "#1769aa",
                                            boxShadow: "0 2px 12px 0 #bde0fe44",
                                            transform: "translateY(-2px)"
                                        },
                                        transition: "all 0.13s"
                                    }}
                                >
                                    {item.label}
                                    {item.red && (
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: "#fff",
                                                bgcolor: "#e53935",
                                                borderRadius: 1,
                                                px: 1,
                                                ml: 0.9,
                                                fontSize: 10.2,
                                                fontWeight: "bold",
                                                letterSpacing: 0.7,
                                                display: "inline-block",
                                                boxShadow: "0 1px 8px 0 #e5393522"
                                            }}
                                        >
                                            SALE
                                        </Typography>
                                    )}
                                </Button>
                            ))}
                        </Stack>
                    )}
                    <Stack direction="row" spacing={1.1} alignItems="center" minWidth={isMobile ? 0 : 180}>
                          {!isMobile && isLoggedIn && user && (
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: "#1a237e",
                                    bgcolor: "#e3f0fa",
                                    px: 1.5,
                                    py: 0.7,
                                    borderRadius: 2,
                                    border: "1px solid #bde0fe",
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Chào, {user.username}
                            </Typography>
                        )}
                        {!isLoggedIn ? (
                            <>
                                <IconButton
                                    sx={{
                                        bgcolor: "#fff",
                                        border: "1.5px solid #e3f0fa",
                                        color: "#1976d2",
                                        borderRadius: 2.5,
                                        width: 42,
                                        height: 42,
                                        fontWeight: 700,
                                        fontSize: 17,
                                        "&:hover": { bgcolor: "#e3f0fa", borderColor: "#1976d2" }
                                    }}
                                    onClick={handleOpenMenu}
                                >
                                    <Person sx={{ fontSize: 23 }} />
                                </IconButton>
                                <MuiMenu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloseMenu}
                                    PaperProps={{
                                        elevation: 5,
                                        sx: { minWidth: 200, borderRadius: 3, p: 0.5 }
                                    }}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            px: 2, py: 1,
                                            cursor: "pointer",
                                            fontSize: 15.2,
                                            fontWeight: 500,
                                            color: "#205072",
                                            userSelect: "none",
                                            "&:hover": { bgcolor: "#e3f0fa" }
                                        }}
                                        onMouseDown={e => e.preventDefault()}
                                        onClick={handleLogin}
                                    >
                                        <Icon sx={{ mr: 1, color: "#1769aa" }}>login</Icon>
                                        Đăng nhập
                                    </Box>
                                </MuiMenu>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    sx={{
                                        bgcolor: "#fff",
                                        border: "1.5px solid #e3f0fa",
                                        color: "#1976d2",
                                        borderRadius: 2.5,
                                        width: 42,
                                        height: 42,
                                        fontWeight: 700,
                                        fontSize: 17,
                                        "&:hover": { bgcolor: "#e3f0fa", borderColor: "#1976d2" }
                                    }}
                                    onClick={handleOpenMenu}
                                >
                                    {user.avatar
                                        ? <Avatar src={user.avatar} sx={{ width: 30, height: 30, fontSize: 15 }} />
                                        : <Avatar sx={{ width: 30, height: 30, fontSize: 15, bgcolor: "#1976d2" }}>
                                            {user.username && user.username.length > 0 ? user.username[0].toUpperCase() : "A"}
                                        </Avatar>
                                    }
                                </IconButton>
                                {renderAccountMenu()}
                            </>
                        )}
                        <IconButton
                            component={RouterLink}
                            to="/card"
                            sx={{
                                bgcolor: "#fff",
                                border: "1.5px solid #e3f0fa",
                                color: "#1976d2",
                                borderRadius: 2.5,
                                width: 42,
                                height: 42,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": { bgcolor: "#e3f0fa", borderColor: "#1976d2" }
                            }}>
                            <Badge badgeContent={cartCount} color="error" showZero sx={{
                                "& .MuiBadge-badge": {
                                    background: "#e53935",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    minWidth: 20,
                                    height: 20,
                                    borderRadius: 2.5,
                                    boxShadow: "0 1px 8px 0 #e5393522"
                                }
                            }}>
                                <ShoppingCart sx={{ fontSize: 23 }} />
                            </Badge>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
            {!isMobile && (
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#e9f5fc",
                        borderBottom: "1px solid #bde0fe",
                        boxShadow: "0 1px 8px 0 #bde0fe",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                </Box>
            )}
        </Box>
    );
}