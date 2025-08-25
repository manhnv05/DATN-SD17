import { useState, useEffect } from "react";

// react-router components
import { useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui/material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import SoftTypography from "../../../components/SoftTypography"
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import { toast } from "react-toastify";
// Soft UI Dashboard React examples
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import { Client } from "@stomp/stompjs"; // <-- THÊM MỚI
import SockJS from "sockjs-client";
// Custom styles for DashboardNavbar
import {
    navbar,
    navbarContainer,
    navbarRow,
    navbarIconButton,
    navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Soft UI Dashboard React context
import {
    useSoftUIController,
    setTransparentNavbar,
    setMiniSidenav,
    setOpenConfigurator,
} from "context";

// Images
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

// Import your routesAdmin
import routesAdmin from "../../../layouts/routes/routes-admin";

// === Helper to get route name from path ===
function getRouteNameFromPath(path, routesList) {
    // Remove dynamic params in route definition
    let cleanedPath = path;
    // Remove id dynamic param (if any, e.g. /SanPham/ChiTietSanPham/123)
    cleanedPath = cleanedPath.replace(/\/\d+$/, "");
    cleanedPath = cleanedPath.toLowerCase();

    function findName(routesArr) {
        for (const route of routesArr) {
            // Check nested routesAdmin (collapse)
            if (route.collapse) {
                const found = findName(route.collapse);
                if (found) return found;
            }
            // Check current route
            if (route.route && cleanedPath === route.route.toLowerCase()) {
                return route.name;
            }
            // Support dynamic param (e.g. /SanPham/ChiTietSanPham/:id)
            if (
                route.route &&
                route.route.includes("/:") &&
                cleanedPath.startsWith(route.route.split("/:")[0].toLowerCase())
            ) {
                return route.name;
            }
        }
        return null;
    }

    return findName(routesList) || "Dashboard";
}

function DashboardNavbar({ absolute, light, isMini }) {
    const [navbarType, setNavbarType] = useState();
    const [controller, dispatch] = useSoftUIController();
    const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
    const [openMenu, setOpenMenu] = useState(null);
    const [openAccountMenu, setOpenAccountMenu] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const route = location.pathname.split("/").filter(Boolean);
     const [notifications, setNotifications] = useState([]);

    // Giả lập thông tin user
    const user = {
        name: "ADMIN SYSTEM",
        email: "hoangbamamh5x12@gmail.com",
        role: "Quản trị viên",
        avatarText: "A",
    };

    // Lấy đường dẫn đầy đủ dạng "/a/b/c"
    const fullPath = "/" + route.join("/");
    // Lấy tên route từ cấu hình routesAdmin
    const routeTitle = getRouteNameFromPath(fullPath, routesAdmin);

    useEffect(() => {
        // Setting the navbar type
        setNavbarType(fixedNavbar ? "sticky" : "static");

        // A function that sets the transparent state of the navbar.
        function handleTransparentNavbar() {
            setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
        }

        window.addEventListener("scroll", handleTransparentNavbar);

        // Call to set the state with the initial value.
        handleTransparentNavbar();

        // Remove event listener on cleanup
        return () => window.removeEventListener("scroll", handleTransparentNavbar);
    }, [dispatch, fixedNavbar]);
// useEffect cho WebSocket
  useEffect(() => {
    console.log("[DEBUG] Navbar component mounted. Setting up WebSocket...");

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(new Date(), str);
      },
      onConnect: () => {
        console.log("[DEBUG] WebSocket CONNECTED successfully!");
        const adminTopic = '/topic/admin/order-updates';
        console.log(`[DEBUG] Subscribing to topic: ${adminTopic}`);
        client.subscribe(adminTopic, (message) => {
          console.log("[DEBUG] --- RAW MESSAGE RECEIVED ---");
          console.log(message.body);
          console.log("[DEBUG] --------------------------");
          try {
            const newNotification = JSON.parse(message.body);
            console.log("[DEBUG] Parsed notification object:", newNotification);
            console.log(`[DEBUG] Checking notification type. Received type is: '${newNotification.type}'`);
            if (newNotification.type === 'NEW_ORDER') {
              console.log("[DEBUG] CONDITION MET! This is a NEW_ORDER notification.");
              toast.success(`Có đơn hàng mới: #${newNotification.maHoaDon}`);
              setNotifications((prev) => {
                const newState = [newNotification, ...prev];
                console.log("[DEBUG] State is being updated. New notifications count:", newState.length);
                return newState;
              });
            } else {
              console.log("[DEBUG] Condition FAILED. Notification type is not 'NEW_ORDER', ignoring.");
            }
          } catch (error) {
            console.error("[DEBUG] Error parsing WebSocket message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[DEBUG] Broker reported error: ' + frame.headers['message']);
        console.error('[DEBUG] Additional details: ' + frame.body);
      },
    });

    console.log("[DEBUG] Activating WebSocket client...");
    client.activate();

    return () => {
      console.log("[DEBUG] Navbar component unmounted. Deactivating WebSocket.");
      client.deactivate();
    };
  }, []); // Dependency rỗng để chỉ chạy 1 lần
    const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
    const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
    const handleCloseMenu = () => setOpenMenu(null);

    const handleOpenAccountMenu = (event) => setOpenAccountMenu(event.currentTarget);
    const handleCloseAccountMenu = () => setOpenAccountMenu(null);

    // Thêm xử lý cho chọn Shop
    const handleGoShop = () => {
        handleCloseAccountMenu();
        navigate("/home");
    };

   const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notifications.length > 0 ? (
        notifications.map((noti) => (
          <NotificationItem
            key={noti.idHoaDon}
            color="info"
            image={<Icon fontSize="small" sx={{ color: "white" }}>shopping_cart</Icon>}
            title={[`Đơn hàng mới #${noti.maHoaDon}`, `Từ: ${noti.tenKhachHang}`]}
            date={new Date(noti.thoiGian).toLocaleString("vi-VN")}
            onClick={() => {
              navigate(`/QuanLyHoaDon/${noti.idHoaDon}`);
              handleCloseMenu();
            }}
          />
        ))
      ) : (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <SoftTypography variant="body2" color="textSecondary">
            Không có thông báo mới.
          </SoftTypography>
        </Box>
      )}
    </Menu>
  );
    // Render the account dropdown menu với nút Shop về /home
    const renderAccountMenu = () => (
        <Menu
            anchorEl={openAccountMenu}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            open={Boolean(openAccountMenu)}
            onClose={handleCloseAccountMenu}
            sx={{
                mt: 2,
                "& .MuiPaper-root": {
                    minWidth: 280,
                    borderRadius: 3,
                    p: 1,
                    userSelect: "none",
                },
            }}
            MenuListProps={{
                sx: {
                    userSelect: "none",
                }
            }}
        >
            {/* User info */}
            <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2, userSelect: "none" }}>
                <Avatar sx={{ bgcolor: "#f50057", mr: 1.5 }}>{user.avatarText}</Avatar>
                <Box>
                    <Box sx={{ fontWeight: 600, fontSize: 16, color: "#1a1a1a" }}>{user.name}</Box>
                    <Box sx={{ fontSize: 13, color: "#888" }}>{user.email}</Box>
                    <Box sx={{ fontSize: 12, color: "#d81b60", fontWeight: 500, mt: 0.5 }}>{user.role}</Box>
                </Box>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            {/* Menu items */}
            <Box sx={{ px: 2, pb: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1,
                        px: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { background: "#f5f5f5" },
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={handleGoShop}
                >
                    <Icon sx={{ mr: 1, color: "#1976d2" }}>storefront</Icon>
                    <span style={{ fontSize: 15, userSelect: "none" }}>SHOP</span>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1,
                        px: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { background: "#f5f5f5" },
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={handleCloseAccountMenu}
                >
                    <Icon sx={{ mr: 1, color: "#8e24aa" }}>person</Icon>
                    <span style={{ fontSize: 15, userSelect: "none" }}>TÀI KHOẢN</span>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1,
                        px: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { background: "#f5f5f5" },
                    }}
                    onMouseDown={e => e.preventDefault()}
                    onClick={handleConfiguratorOpen}
                >
                    <Icon sx={{ mr: 1, color: "#039be5" }}>settings</Icon>
                    <span style={{ fontSize: 15, userSelect: "none" }}>CÀI ĐẶT</span>
                </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    pb: 2,
                    cursor: "pointer",
                    color: "#d32f2f",
                    fontWeight: 600,
                    borderRadius: 2,
                    userSelect: "none",
                    "&:hover": { background: "#fff0f0" },
                }}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                    // Xử lý đăng xuất: chuyển hướng sang trang đăng nhập
                    handleCloseAccountMenu();
                    navigate("/authentication/sign-in");
                }}
            >
                <Icon sx={{ mr: 1, color: "#d32f2f" }}>logout</Icon>
                <span style={{ fontSize: 15, userSelect: "none" }}>ĐĂNG XUẤT</span>
            </Box>
        </Menu>
    );

    return (
        <AppBar
            position={absolute ? "absolute" : navbarType}
            color="inherit"
            sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
        >
            <Toolbar sx={(theme) => navbarContainer(theme)}>
                <SoftBox
                    color="inherit"
                    mb={{ xs: 1, md: 0 }}
                    sx={(theme) => navbarRow(theme, { isMini })}
                >
                    {/* Nút menu lớn và có khoảng cách */}
                    <IconButton
                        size="large"
                        color="inherit"
                        sx={{ ...navbarMobileMenu, mr: 2 }}
                        onClick={handleMiniSidenav}
                    >
                        <Icon
                            className={light ? "text-white" : "text-dark"}
                            fontSize="large"
                        >
                            {miniSidenav ? "menu_open" : "menu"}
                        </Icon>
                    </IconButton>
                    {/* Breadcrumbs cách nút menu 1 đoạn */}
                    <Breadcrumbs
                        icon="home"
                        title={routeTitle}
                        route={route}
                        light={light}
                    />
                </SoftBox>
                {!isMini && (
                    <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
                        <SoftBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
                            {/* Notification */}
                          <IconButton
          size="large"
          color="inherit"
          sx={navbarIconButton}
          aria-controls="notification-menu"
          aria-haspopup="true"
          variant="contained"
          onClick={handleOpenMenu}
        >
          <Badge badgeContent={notifications.length} color="error">
            <Icon className={light ? "text-white" : "text-dark"} fontSize="large">
              notifications
            </Icon>
          </Badge>
        </IconButton>
                            {/* Account Dropdown */}
                            <IconButton
                                sx={navbarIconButton}
                                size="large"
                                onClick={handleOpenAccountMenu}
                            >
                                <Icon
                                    fontSize="large"
                                    sx={({ palette: { dark, white } }) => ({
                                        color: light ? white.main : dark.main,
                                    })}
                                >
                                    account_circle
                                </Icon>
                            </IconButton>
                            {renderAccountMenu()}
                            {/* Configurator */}
                            <IconButton
                                size="large"
                                color="inherit"
                                sx={navbarIconButton}
                                onClick={handleConfiguratorOpen}
                            >
                                <Icon fontSize="large">settings</Icon>
                            </IconButton>
                            {renderMenu()}
                        </SoftBox>
                    </SoftBox>
                )}
            </Toolbar>
        </AppBar>
    );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
    absolute: false,
    light: false,
    isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
    absolute: PropTypes.bool,
    light: PropTypes.bool,
    isMini: PropTypes.bool,
};

export default DashboardNavbar;