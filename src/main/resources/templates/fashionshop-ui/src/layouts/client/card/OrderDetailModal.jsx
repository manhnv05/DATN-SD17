// OrderDetailModal.js
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// === IMPORT TỪ MUI ===
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// === IMPORT CSS VÀ ẢNH ===
// TẠO MỘT FILE OrderDetailModal.module.css VÀ COPY CSS TỪ FILE CŨ SANG
import styles from "./OrderDetailModal.module.css";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt react-toastify

// Import các ảnh trạng thái (hãy chắc chắn đường dẫn là chính xác)
import tao_hoa_don_img from "../../../assets/images/tao_hoa_don.png";
import cho_xac_nhan from "../../../assets/images/cho_xac_nhan.png";
import DaXacNhan from "../../../assets/images/DaXacNhan.png";
import cho_giao_hang from "../../../assets/images/cho_giao_hang.png";
import check from "../../../assets/images/check.png";
import dang_giao_hang from "../../../assets/images/dang_giao_hang.png";
import hoan_thanh from "../../../assets/images/hoan_thanh.png";
import Huy from "../../../assets/images/Huy.png";
 import ProductSlideshow from "../../admin/BanHangTaiQuay/component/ProductSlideshow";


export default function OrderDetailModal({ open, onClose, orderCode }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  // === CÁC HÀM HELPER (Lấy từ OrderLookup) ===
  const formatDateTime = useCallback((isoString) => {
    if (!isoString) return "Chưa cập nhật";
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")} - ${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  }, []);

  const formatCurrency = useCallback((amount) => {
    if (typeof amount !== "number") return "0 ₫";
    return `${amount.toLocaleString("vi-VN")} ₫`;
  }, []);

  const getStatusDetails = useCallback((status) => {
    const trimmedStatus = status ? status.trim() : "";
    switch (trimmedStatus) {
      case "Tạo đơn hàng":
      case "TAO_DON_HANG":
        return { text: "Tạo đơn hàng", className: "TAO_DON_HANG" };
      case "Chờ xác nhận":
      case "CHO_XAC_NHAN":
        return { text: "Chờ xác nhận", className: "CHO_XAC_NHAN" };
      case "Đã xác nhận":
      case "DA_XAC_NHAN":
        return { text: "Đã xác nhận", className: "DA_XAC_NHAN" };
      case "Chờ giao hàng":
      case "CHO_GIAO_HANG":
        return { text: "Chờ giao hàng", className: "CHO_GIAO_HANG" };
      case "Đang vận chuyển":
      case "DANG_VAN_CHUYEN":
        return { text: "Đang vận chuyển", className: "DANG_VAN_CHUYEN" };
      case "Hoàn thành":
      case "HOAN_THANH":
        return { text: "Hoàn thành", className: "HOAN_THANH" };
      case "Hủy":
      case "HUY":
      case "DA_HUY":
        return { text: "Đã hủy", className: "HUY" };
      default:
        return { text: trimmedStatus, className: "UNKNOWN" };
    }
  }, []);

  const getIconComponent = useCallback((className) => {
    const imgStyle = { width: "100%", height: "100%", objectFit: "contain" };
    switch (className) {
      case "TAO_DON_HANG":
        return <img src={tao_hoa_don_img} alt="Tạo đơn" style={imgStyle} />;
      case "CHO_XAC_NHAN":
        return <img src={cho_xac_nhan} alt="Chờ xác nhận" style={imgStyle} />;
      case "DA_XAC_NHAN":
        return <img src={check} alt="Đã xác nhận" style={imgStyle} />;
      case "CHO_GIAO_HANG":
        return <img src={cho_giao_hang} alt="Chờ giao hàng" style={imgStyle} />;
      case "DANG_VAN_CHUYEN":
        return <img src={dang_giao_hang} alt="Đang giao" style={imgStyle} />;
      case "HOAN_THANH":
        return <img src={hoan_thanh} alt="Hoàn thành" style={imgStyle} />;
      case "HUY":
        return <img src={Huy} alt="Hủy" style={imgStyle} />;
      default:
        return <img src={check} alt="Trạng thái" style={imgStyle} />;
    }
  }, []);

  const getStatusBadgeClassName = (statusEnumName) => {
    switch (statusEnumName) {
      case "HOAN_THANH":
        return styles.badgeSuccess;
      case "DANG_VAN_CHUYEN":
      case "CHO_GIAO_HANG":
      case "CHO_XAC_NHAN":
        return styles.badgeWarning;
      case "HUY":
      case "DA_HUY":
        return styles.badgeDanger;
      case "DA_XAC_NHAN":
      case "TAO_DON_HANG":
        return styles.badgeInfo;
      default:
        return styles.badgeSecondary;
    }
  };

  // === LOGIC GỌI API ===
  useEffect(() => {
    if (open && orderCode) {
      const fetchOrderDetails = async () => {
        setLoading(true);
        setOrderData(null); // Xóa dữ liệu cũ
        try {
          const response = await axios.get(
            `http://localhost:8080/api/hoa-don/tra-cuu-hoa-don/${orderCode}`
          );
          if (response.data) {
            if (response.data.lichSuHoaDon) {
              response.data.lichSuHoaDon.sort(
                (a, b) => new Date(a.thoiGian) - new Date(b.thoiGian)
              );
            }
            setOrderData(response.data);
          } else {
            throw new Error("Không tìm thấy đơn hàng.");
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Không tìm thấy đơn hàng hoặc có lỗi xảy ra.";
          toast.error(errorMessage);
          onClose(); // Đóng modal nếu có lỗi
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [open, orderCode, onClose]);

  // === CÁC HÀM RENDER (Chuyển đổi từ Bootstrap sang MUI Grid và Paper) ===
  const renderTimeline = () => {
    const history = orderData?.lichSuHoaDon || [];
    if (history.length === 0)
      return (
        <Typography sx={{ textAlign: "center", p: 3 }}>Chưa có lịch sử trạng thái.</Typography>
      );

    const transformedData = history.map((item) => ({
      ...getStatusDetails(item.trangThaiHoaDon),
      formattedDate: formatDateTime(item.thoiGian),
    }));
    const totalItems = transformedData.length;
    const activeItems = transformedData.length;

    return (
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box className={styles.timelineWrapper}>
          <Box className={styles.timelineContainer} sx={{ minWidth: `${totalItems * 100}px` }}>
            <Box className={styles.timelineTrack} />
            <Box
              className={styles.timelineTrackActive}
              style={{
                width: totalItems > 1 ? `${((activeItems - 1) / (totalItems - 1)) * 100}%` : "0%",
              }}
            />
            {transformedData.map((item, index) => (
              <Box key={index} className={styles.timelineItem}>
                <Box className={`${styles.timelineIconWrapper} ${styles.active}`}>
                  <Box className={styles.timelineIcon}>{getIconComponent(item.className)}</Box>
                </Box>
                <Box sx={{ mt: 1.5, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {item.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.formattedDate}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    );
  };

  const renderOrderInfo = () => (
    <Paper elevation={2} sx={{ p: 2.5, mb: 3 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1", mb: 2 }}>
        Thông tin hóa đơn
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <b>Mã hóa đơn:</b> {orderData.maHoaDon}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <b>Ngày tạo:</b> {formatDateTime(orderData.ngayTao)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <b>Trạng thái:</b>{" "}
            <span className={`${styles.badge} ${getStatusBadgeClassName(orderData.trangThai)}`}>
              {getStatusDetails(orderData.trangThai).text}
            </span>
          </Typography>
        </Grid>
      </Grid>
      <hr style={{ margin: "16px 0" }} />
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1", mb: 2 }}>
        Thông tin người nhận
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <b>Tên người nhận:</b> {orderData.tenKhachHang}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <b>Số điện thoại:</b> {orderData.sdt}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <b>Địa chỉ:</b> {orderData.diaChi}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderProductList = () => (
    <Paper elevation={2} sx={{ p: 2.5 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1", mb: 2 }}>
        Sản phẩm đã đặt
      </Typography>
      {(orderData.danhSachChiTiet || []).map((product, index) => (
        <Box key={index} className={styles.productItem}>
          <Box className={styles.productImageContainer}>
            <ProductSlideshow
              product={{
                ...product,
                listUrlImage: product.duongDanAnh ? [product.duongDanAnh] : [],
              }}
            />
          </Box>
          <div className={styles.productDetails}>
            <p className={styles.productName}>{product.tenSanPham}</p>
            <p className={styles.productAttrs}>
              Màu: {product.tenMauSac} - Size: {product.tenKichThuoc}
            </p>
            <p className={styles.productPrice}>
              {formatCurrency(product.gia)} x {product.soLuong}
            </p>
          </div>
          <div className={styles.productTotal}>{formatCurrency(product.thanhTien)}</div>
        </Box>
      ))}
    </Paper>
  );

  const renderOrderSummary = () => {
    const tienGiam = (orderData.tongTienBanDau || 0) - (orderData.tongTien || 0);
    return (
      <Paper elevation={2} sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1", mb: 2 }}>
          Tổng kết đơn hàng
        </Typography>
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Tạm tính</Typography>
            <Typography>{formatCurrency(orderData.tongTienBanDau)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Phí vận chuyển</Typography>
            <Typography>{formatCurrency(orderData.phiVanChuyen)}</Typography>
          </Box>
          {tienGiam > 0 && (
            <Box display="flex" justifyContent="space-between" mb={1} color="error.main">
              <Typography color="inherit">Giảm giá</Typography>
              <Typography color="inherit">- {formatCurrency(tienGiam)}</Typography>
            </Box>
          )}
          <hr />
          <Box display="flex" justifyContent="space-between" mt={1.5}>
            <Typography variant="h6" fontWeight="bold">
              Tổng cộng
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#e53935">
              {formatCurrency(orderData.tongHoaDon)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: "bold" }}>
        Chi tiết đơn hàng #{orderCode}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && orderData && (
          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            {renderTimeline()}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                {renderOrderInfo()}
                {renderProductList()}
              </Grid>
              <Grid item xs={12} lg={4}>
                {renderOrderSummary()}
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OrderDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderCode: PropTypes.string,
};