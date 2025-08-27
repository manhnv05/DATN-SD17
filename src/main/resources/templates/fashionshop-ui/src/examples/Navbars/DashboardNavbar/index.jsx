import { useState, useEffect } from "react";

// react-router components
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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
import SoftTypography from "../../../components/SoftTypography";
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
  const [currentUser, setCurrentUser] = useState(null);
  const route = location.pathname.split("/").filter(Boolean);
  const [notifications, setNotifications] = useState(() => {
    try {
      const savedNotifications = localStorage.getItem("dashboard_notifications");
      return savedNotifications ? JSON.parse(savedNotifications) : [];
    } catch (error) {
      console.error("Lỗi khi đọc thông báo từ localStorage:", error);
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("dashboard_notifications", JSON.stringify(notifications));
    } catch (error) {
      console.error("Lỗi khi lưu thông báo vào localStorage:", error);
    }
  }, [notifications]);
  const handleNotificationClick = (notificationToRemove) => {
    // 1. Chuyển đến trang chi tiết đơn hàng
    navigate(`/QuanLyHoaDon/${notificationToRemove.idHoaDon}`);

    // 2. Xóa thông báo đã click khỏi state
    // Thao tác này sẽ kích hoạt useEffect ở Bước 2 để cập nhật localStorage
    setNotifications((prev) =>
      prev.filter((noti) => noti.idHoaDon !== notificationToRemove.idHoaDon)
    );

    // 3. Đóng menu thông báo
    handleCloseMenu();
  };
  // Giả lập thông tin user
  const user = {
    name: "ADMIN SYSTEM",
    email: "hoangbamamh5x12@gmail.com",
    role: "Quản trị viên",
    avatarText: "A",
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/lay-thong-tin/nguoi-dung-hien-tai",
          {
            withCredentials: true,
          }
        );

        setCurrentUser(response.data);
        console.log(">>> STATE currentUser ĐÃ THAY ĐỔI:", currentUser);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng hoặc phiên đăng nhập hết hạn:", error);
      }
    };

    fetchCurrentUser();
  }, []);

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
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(new Date(), str);
      },
      onConnect: () => {
        const adminTopic = "/topic/admin/order-updates";

        client.subscribe(adminTopic, (message) => {
          try {
            // 1. Nhận dữ liệu gốc từ backend
            const rawNotification = JSON.parse(message.body);
            console.log("Dữ liệu GỐC từ backend:", rawNotification);

            // 2. TẠO RA MỘT OBJECT MỚI CHỈ CHỨA CÁC TRƯỜNG CẦN THIẾT
            const cleanNotification = {
              idHoaDon: rawNotification.idHoaDon,
              maHoaDon: rawNotification.maHoaDon,
              tenKhachHang: rawNotification.tenKhachHang,
              thoiGian: rawNotification.thoiGian,
              type: rawNotification.type,
              // Chỉ lấy những trường này, tuyệt đối không lấy toàn bộ object user/customer
            };

            console.log("Dữ liệu ĐÃ LÀM SẠCH để sử dụng:", cleanNotification);

            // 3. Chỉ xử lý với dữ liệu đã được làm sạch
            if (cleanNotification.type === "NEW_ORDER") {
              // toast.success(...) // Bạn nên thêm lại dòng này để có thông báo popup

              // 4. Cập nhật state bằng object SẠCH
              setNotifications((prev) => [cleanNotification, ...prev]);
            }
          } catch (error) {
            console.error("[DEBUG] Error parsing WebSocket message:", error);
          }
        });
      },
      onStompError: (frame) => {},
    });

    client.activate();

    return () => {
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
            image={
              <Icon fontSize="small" sx={{ color: "white" }}>
                shopping_cart
              </Icon>
            }
            title={[
              `Đơn hàng mới #${noti.maHoaDon}`,
              `${noti.idHoaDon}`,
              `Từ: ${noti.tenKhachHang}`,
            ]}
            date={new Date(noti.thoiGian).toLocaleString("vi-VN")}
            onClick={() => handleNotificationClick(noti)}
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
  const renderAccountMenu = () => {
    // KIỂM TRA QUAN TRỌNG: Nếu chưa có dữ liệu user, hiển thị trạng thái chờ
    if (!currentUser) {
      return (
        <Menu
          anchorEl={openAccountMenu}
          open={Boolean(openAccountMenu)}
          onClose={handleCloseAccountMenu}
          sx={{ mt: 2 }}
        >
          <Box sx={{ p: 2, minWidth: 150 }}>Đang tải...</Box>
        </Menu>
      );
    }

    // Dịch role từ API sang tiếng Việt để hiển thị đẹp hơn
    const vaiTroHienThi = {
      ADMIN: "Quản trị viên",
      NHANVIEN: "Nhân viên",
      KHACHHANG: "Khách hàng",
    };

    // Style chung cho các mục menu để tránh lặp code
    const menuItemStyles = {
      display: "flex",
      alignItems: "center",
      py: 1,
      px: 1,
      borderRadius: 2,
      cursor: "pointer",
      userSelect: "none",
      "&:hover": { background: "#f5f5f5" },
    };

    return (
      <Menu
        anchorEl={openAccountMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={Boolean(openAccountMenu)}
        onClose={handleCloseAccountMenu}
        sx={{ mt: 2, "& .MuiPaper-root": { minWidth: 280, borderRadius: 3, p: 1 } }}
      >
        {/* --- Phần thông tin người dùng --- */}
        <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 2 }}>
          <Avatar src={currentUser.hinhAnh} sx={{ bgcolor: "#f50057", mr: 1.5 }}>
            {currentUser.hoVaTen ? currentUser.hoVaTen[0].toUpperCase() : "U"}
          </Avatar>
          <Box>
            <Box sx={{ fontWeight: 600 }}>{currentUser.hoVaTen}</Box>
            <Box sx={{ fontSize: 13, color: "text.secondary" }}>{currentUser.email}</Box>
            <Box sx={{ fontSize: 12, color: "#d81b60", fontWeight: 500, mt: 0.5 }}>
              {vaiTroHienThi[currentUser.loaiTaiKhoan] || currentUser.loaiTaiKhoan}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* --- BẮT ĐẦU PHẦN MENU CHỨC NĂNG --- */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={menuItemStyles} onClick={handleGoShop}>
            <Icon sx={{ mr: 1, color: "#1976d2" }}>storefront</Icon>
            <span style={{ fontSize: 15 }}>SHOP</span>
          </Box>
          <Box sx={menuItemStyles} onClick={handleCloseAccountMenu}>
            <Icon sx={{ mr: 1, color: "#8e24aa" }}>person</Icon>
            <span style={{ fontSize: 15 }}>TÀI KHOẢN</span>
          </Box>
          <Box sx={menuItemStyles} onClick={handleConfiguratorOpen}>
            <Icon sx={{ mr: 1, color: "#039be5" }}>settings</Icon>
            <span style={{ fontSize: 15 }}>CÀI ĐẶT</span>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            pb: 1.5, // Thêm padding bottom để cân đối
            pt: 0.5,
            cursor: "pointer",
            color: "#d32f2f",
            fontWeight: 600,
            borderRadius: 2,
            userSelect: "none",
            "&:hover": { background: "#fff0f0" },
          }}
          onClick={() => {
            handleCloseAccountMenu();
            // Thêm logic xóa cookie/token nếu cần
            navigate("/authentication/sign-in");
          }}
        >
          <Icon sx={{ mr: 1 }}>logout</Icon>
          <span style={{ fontSize: 15 }}>ĐĂNG XUẤT</span>
        </Box>
        {/* --- KẾT THÚC PHẦN MENU CHỨC NĂNG --- */}
      </Menu>
    );
  };

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {/* Nút menu lớn và có khoảng cách */}
          <IconButton
            size="large"
            color="inherit"
            sx={{ ...navbarMobileMenu, mr: 2 }}
            onClick={handleMiniSidenav}
          >
            <Icon className={light ? "text-white" : "text-dark"} fontSize="large">
              {miniSidenav ? "menu_open" : "menu"}
            </Icon>
          </IconButton>
          {/* Breadcrumbs cách nút menu 1 đoạn */}
          <Breadcrumbs icon="home" title={routeTitle} route={route} light={light} />
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
              <IconButton sx={navbarIconButton} size="large" onClick={handleOpenAccountMenu}>
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
