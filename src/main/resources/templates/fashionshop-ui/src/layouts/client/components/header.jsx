import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    InputBase,
    Badge,
    Button,
    Paper,
    Stack,
    useMediaQuery,
    Menu as MuiMenu,
    MenuItem,
    Divider,
    Avatar,
    ListItemIcon
} from "@mui/material";
import { ShoppingCart, Person, Search, Menu, Logout, AccountCircle, Settings, Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logoImg from "assets/images/logo4.png";

function Logo() {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <img
                src={logoImg}
                alt="COOLMATE"
                style={{
                    height: 80,
                    marginRight: 6,
                    borderRadius: 7,
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.09)"
                }}
            />
        </Box>
    );
}

const navItems = [
    { label: "OUTLET", red: true },
    { label: "HOME" },
    { label: "SHOP" },
    { label: "ABOUT" },
    { label: "BLOG" },
    { label: "CONTACT" }
];

const subNavItems = [
    "New Arrivals",
    "Best Selling",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Accessories",
    "Sale Off"
];

export default function Header() {
    const isMobile = useMediaQuery('(max-width:900px)');
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const isLoggedIn = Boolean(role && username);
    const isAdmin = role === "NHANVIEN" || role === "QUANLY" || role === "QUANTRIVIEN";
    const user = isLoggedIn
        ? {
            name: username,
            email: "",
            role: role === "NHANVIEN" ? "Nhân viên" : role === "QUANLY" ? "Quản lý" : role === "QUANTRIVIEN" ? "Quản trị viên" : "Khách hàng",
            avatar: ""
        }
        : null;

    function handleOpenMenu(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleCloseMenu() {
        setAnchorEl(null);
    }

    function handleLogout() {
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        handleCloseMenu();
        setTimeout(function () {
            navigate("/home");
        }, 150);
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
        alert("Tài khoản!");
        handleCloseMenu();
    }

    function handleSettings() {
        alert("Cài đặt!");
        handleCloseMenu();
    }

    return (
        <Box>
            <Box
                sx={{
                    width: "100%",
                    bgcolor: "linear-gradient(90deg, #ffe600 0%, #ff8b60 100%)",
                    color: "#222",
                    textAlign: "center",
                    fontSize: 13,
                    py: 0.8,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)"
                }}
            >
                Miễn phí vận chuyển với đơn hàng trên 500k, hàng pre-order còn được giảm thêm 5%.
            </Box>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: "#fff",
                    color: "#222",
                    boxShadow: "none",
                    borderBottom: "1px solid #eee"
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: 72,
                        px: { xs: 1.5, md: 5 },
                        gap: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "relative"
                    }}
                >
                    <Box display="flex" alignItems="center" minWidth={isMobile ? 0 : 180} justifyContent="center">
                        {isMobile && (
                            <IconButton sx={{ mr: 0.5 }}>
                                <Menu sx={{ fontSize: 28 }} />
                            </IconButton>
                        )}
                        <Logo />
                    </Box>
                    {!isMobile && (
                        <Stack direction="row" spacing={2} sx={{ flex: 1, justifyContent: "center", ml: 2, mr: 2 }}>
                            {navItems.map(function (item) {
                                return (
                                    <Button
                                        key={item.label}
                                        sx={{
                                            fontWeight: item.red ? 800 : 500,
                                            color: item.red ? "#e53935" : "#111",
                                            fontSize: 15,
                                            px: 1.6,
                                            letterSpacing: 0.8,
                                            textTransform: "uppercase",
                                            borderRadius: 2,
                                            background: item.red ? "rgba(229,57,53,0.07)" : "transparent",
                                            boxShadow: item.red ? "0 2px 8px 0 rgba(229,57,53,0.07)" : "none",
                                            "&:hover": {
                                                bgcolor: item.red ? "#ffe6e6" : "#f8f8f8",
                                                color: item.red ? "#d32f2f" : "#000",
                                                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.11)",
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
                                                    boxShadow: "0 1px 8px 0 rgba(229,57,53,0.21)"
                                                }}
                                            >
                                                SALE
                                            </Typography>
                                        )}
                                    </Button>
                                );
                            })}
                        </Stack>
                    )}
                    <Stack direction="row" spacing={1.2} alignItems="center" minWidth={isMobile ? 0 : 200}>
                        <Paper
                            component="form"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                borderRadius: 6,
                                boxShadow: "none",
                                bgcolor: "#f6f6f6",
                                px: 1.2,
                                py: 0.3,
                                minWidth: isMobile ? 90 : 170,
                                mr: 0.4,
                                border: "1px solid #efeaea"
                            }}
                        >
                            <InputBase
                                placeholder="Tìm kiếm sản phẩm…"
                                sx={{ ml: 0.7, flex: 1, fontSize: 14.2, color: "#222" }}
                                inputProps={{ "aria-label": "search" }}
                            />
                            <IconButton sx={{ p: 0.4 }}>
                                <Search sx={{ color: "#999", fontSize: 21 }} />
                            </IconButton>
                        </Paper>
                        {!isLoggedIn ? (
                            <React.Fragment>
                                <IconButton
                                    sx={{
                                        bgcolor: "#ffe600", color: "#222", "&:hover": { bgcolor: "#ffef7a" },
                                        borderRadius: 2, mx: 0.2
                                    }}
                                    onClick={handleOpenMenu}
                                >
                                    <Person sx={{ fontSize: 25 }} />
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
                                    <MenuItem onClick={handleLogin}>
                                        <ListItemIcon>
                                            <Login fontSize="small" />
                                        </ListItemIcon>
                                        Đăng nhập
                                    </MenuItem>
                                </MuiMenu>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <IconButton
                                    sx={{
                                        bgcolor: "#ffe600", color: "#222", "&:hover": { bgcolor: "#ffef7a" },
                                        borderRadius: 2, mx: 0.2
                                    }}
                                    onClick={handleOpenMenu}
                                >
                                    {user.avatar
                                        ? <Avatar src={user.avatar} sx={{ width: 30, height: 30, fontSize: 15 }} />
                                        : <Avatar sx={{ width: 30, height: 30, fontSize: 15, bgcolor: "#b347e6" }}>
                                            {user.name && user.name.length > 0 ? user.name[0] : "A"}
                                        </Avatar>
                                    }
                                </IconButton>
                                <MuiMenu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleCloseMenu}
                                    PaperProps={{
                                        elevation: 5,
                                        sx: { minWidth: 290, borderRadius: 3, p: 0.5 }
                                    }}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                                >
                                    <Box sx={{ px: 2, pt: 2, pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Avatar
                                            src={user.avatar}
                                            sx={{ width: 48, height: 48, fontWeight: 700, fontSize: 20, bgcolor: "#b347e6" }}
                                        >{user.name && user.name.length > 0 ? user.name[0] : "A"}</Avatar>
                                        <Box>
                                            <Typography fontWeight={700} fontSize={16}>{user.name}</Typography>
                                            <Typography fontSize={13} color="#888">{user.email}</Typography>
                                            <Typography fontSize={12} color="#d32f2f" fontWeight={600}>
                                                {user.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 1, bgcolor: "#eee" }} />
                                    {isAdmin ? [
                                        <MenuItem onClick={handleGoAdmin} key="go-admin">
                                            <ListItemIcon>
                                                <Settings fontSize="small" />
                                            </ListItemIcon>
                                            Trang quản lý
                                        </MenuItem>,
                                        <MenuItem onClick={handleAccount} key="account">
                                            <ListItemIcon>
                                                <AccountCircle fontSize="small" />
                                            </ListItemIcon>
                                            Tài khoản
                                        </MenuItem>,
                                        <Divider sx={{ my: 1, bgcolor: "#eee" }} key="divider" />,
                                        <MenuItem onClick={handleLogout} sx={{ color: "#e53935" }} key="logout">
                                            <ListItemIcon>
                                                <Logout fontSize="small" sx={{ color: "#e53935" }} />
                                            </ListItemIcon>
                                            Đăng xuất
                                        </MenuItem>
                                    ] : [
                                        <MenuItem onClick={handleAccount} key="account">
                                            <ListItemIcon>
                                                <AccountCircle fontSize="small" />
                                            </ListItemIcon>
                                            Tài khoản
                                        </MenuItem>,
                                        <Divider sx={{ my: 1, bgcolor: "#eee" }} key="divider" />,
                                        <MenuItem onClick={handleLogout} sx={{ color: "#e53935" }} key="logout">
                                            <ListItemIcon>
                                                <Logout fontSize="small" sx={{ color: "#e53935" }} />
                                            </ListItemIcon>
                                            Đăng xuất
                                        </MenuItem>
                                    ]}
                                </MuiMenu>
                            </React.Fragment>
                        )}
                        <IconButton sx={{
                            bgcolor: "#ffe600", color: "#222", "&:hover": { bgcolor: "#ffef7a" },
                            borderRadius: 2, mx: 0.2
                        }}>
                            <Badge badgeContent={6} color="error" overlap="circular" sx={{
                                "& .MuiBadge-badge": {
                                    background: "#e53935",
                                    color: "#fff",
                                    fontWeight: 700,
                                    border: "2px solid #fff"
                                }
                            }}>
                                <ShoppingCart sx={{ fontSize: 25 }} />
                            </Badge>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>
            {!isMobile && (
                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#fff",
                        borderBottom: "1px solid #eee",
                        boxShadow: "0 1px 8px 0 rgba(255,230,0,0.03)",
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={3}
                        sx={{ py: 1 }}
                        justifyContent="center"
                        alignItems="center"
                    >
                        {subNavItems.map(function (item, idx) {
                            return (
                                <Typography
                                    key={item}
                                    variant="caption"
                                    sx={{
                                        color: idx === 0 ? "#e53935" : "#888",
                                        fontWeight: idx === 0 ? 700 : 400,
                                        textTransform: "capitalize",
                                        fontSize: 15,
                                        letterSpacing: 0.5,
                                        cursor: "pointer",
                                        px: 1,
                                        borderRadius: 1.5,
                                        "&:hover": {
                                            color: "#111",
                                            background: "#ffe60033",
                                            textDecoration: "underline"
                                        },
                                        transition: "all 0.14s"
                                    }}
                                >
                                    {item}
                                </Typography>
                            );
                        })}
                    </Stack>
                </Box>
            )}
        </Box>
    );
}