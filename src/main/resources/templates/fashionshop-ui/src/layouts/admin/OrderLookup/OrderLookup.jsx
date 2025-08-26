import React, { useState, useCallback } from "react";
import axios from "axios";

// === IMPORT TỪ MUI ===
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// === IMPORT CSS VÀ ẢNH ===
import { toast } from "react-toastify";
import styles from "./OrderLookup.module.css";

// Import các ảnh trạng thái của bạn
import tao_hoa_don_img from "../../../assets/images/tao_hoa_don.png";
import cho_xac_nhan from "../../../assets/images/cho_xac_nhan.png";
import DaXacNhan from "../../../assets/images/DaXacNhan.png";
import cho_giao_hang from "../../../assets/images/cho_giao_hang.png";
import check from "../../../assets/images/check.png";
import dang_giao_hang from "../../../assets/images/dang_giao_hang.png";
import hoan_thanh from "../../../assets/images/hoan_thanh.png";
import Huy from "../../../assets/images/Huy.png";
import Header from "../../client/components/header";
import Footer from "../../client/components/footer";
// Import component ProductSlideshow thật của bạn
import ProductSlideshow from "../BanHangTaiQuay/component/ProductSlideshow.jsx";

// ===================================================================
// === COMPONENT CHÍNH - GỘP TẤT CẢ TRONG MỘT ===
// ===================================================================
const OrderLookup = () => {
  // === STATE MANAGEMENT ===
  const [maHoaDon, setMaHoaDon] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  // === CÁC HÀM HELPER ===
  const formatDateTime = useCallback((isoString) => {
    if (!isoString) return "Chưa cập nhật";
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const pad = (num) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)} - ${pad(day)}/${pad(month)}/${year}`;
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
        return <img src={check} alt="Đã xác nhận" style={imgStyle} />;
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
        return styles.badgeDanger;
      case "DA_XAC_NHAN":
      case "TAO_DON_HANG":
        return styles.badgeInfo;
      default:
        return styles.badgeSecondary;
    }
  };

  // [ĐÃ SỬA] Chuyển tên enum sang Tiếng Việt
  const formatStatusName = (statusEnumName) => {
    if (!statusEnumName) return "";
    return (
      statusEnumName.replace(/_/g, " ").charAt(0).toUpperCase() +
      statusEnumName.replace(/_/g, " ").slice(1).toLowerCase()
    );
  };

  // === LOGIC GỌI API ===
  const handleLookup = useCallback(
    async (e) => {
      e.preventDefault();
      if (!maHoaDon.trim()) {
        toast.warn("Vui lòng nhập mã đơn hàng!");
        return;
      }
      setLoading(true);
      setOrderData(null);
      try {
        // [ĐÃ SỬA] Thêm dấu "/" vào URL
        const response = await axios.get(
          `http://localhost:8080/api/hoa-don/tra-cuu-hoa-don/${maHoaDon.trim()}`,{ credentials: "include" }


        );
        if (response.data) {
          if (response.data.lichSuHoaDon) {
            response.data.lichSuHoaDon.sort((a, b) => new Date(a.thoiGian) - new Date(b.thoiGian));
          }
          setOrderData(response.data);
          toast.success("Tìm thấy đơn hàng!");
        } else {
          throw new Error("Không tìm thấy đơn hàng.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Không tìm thấy đơn hàng hoặc có lỗi xảy ra.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [maHoaDon]
  );

  // === LOGIC RENDER CÁC PHẦN CỦA GIAO DIỆN ===

  const renderTimeline = () => {
    const history = orderData?.lichSuHoaDon || [];
    if (history.length === 0)
      return (
        <Typography sx={{ textAlign: "center", p: 3 }}>Chưa có lịch sử trạng thái.</Typography>
      );

    // Tạo mảng dữ liệu đã được xử lý
    const transformedData = history.map((item) => {
      const details = getStatusDetails(item.trangThaiHoaDon);
      return {
        ...details, // Bao gồm 'text' và 'className'
        formattedDate: formatDateTime(item.thoiGian),
      };
    });
    const totalItems = transformedData.length;
    const actualLastActiveIndex = totalItems - 1;
    const activeItems = transformedData.length;
    return (
      // [ĐÃ SỬA] Container ngoài cùng cho phép cuộn
      <Box className={styles.timelineWrapper}>
        {/* Container bên trong có chiều rộng tối thiểu để kích hoạt cuộn */}
        <Box
          className={styles.timelineContainer}
          sx={{ minWidth: `${totalItems * 100}px` }} // Mỗi item chiếm khoảng 160px
        >
          {/* Đường kẻ sẽ nằm bên trong container này để cuộn cùng */}
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
    );
  };

  const renderOrderInfo = () => (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3" style={{ color: "#49a3f1" }}>
          Thông tin hóa đơn
        </h6>
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>Mã hóa đơn:</strong> {orderData.maHoaDon}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Ngày tạo:</strong> {formatDateTime(orderData.ngayTao)}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Nhân viên:</strong> {orderData.nhanVien?.tenNhanVien || "N/A"}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Trạng thái:</strong>
            <span className={`${styles.badge} ${getStatusBadgeClassName(orderData.trangThai)}`}>
              {/* [ĐÃ SỬA] Sử dụng hàm helper mới */}
              {getStatusDetails(orderData.trangThai).text}
            </span>
          </div>
        </div>
        <hr />
        <h6 className="fw-bold mb-3" style={{ color: "#49a3f1" }}>
          Thông tin người nhận
        </h6>
        <div className="row">
          <div className="col-md-6 mb-2">
            <strong>Tên người nhận:</strong> {orderData.tenKhachHang}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Số điện thoại:</strong> {orderData.sdt}
          </div>
          <div className="col-12">
            <strong>Địa chỉ:</strong> {orderData.diaChi}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductList = () => (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title fw-bold mb-3" style={{ color: "#49a3f1" }}>
          Sản phẩm đã đặt
        </h5>
        {(orderData.danhSachChiTiet || []).map((product, index) => (
          <div key={index} className={styles.productItem}>
            {/* [ĐÃ SỬA] Sử dụng component ProductSlideshow thật */}
            <div className={styles.productImageContainer}>
              <ProductSlideshow
                product={{
                  ...product,
                  listUrlImage: product.duongDanAnh ? [product.duongDanAnh] : [],
                }}
              />
            </div>
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
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrderSummary = () => {
    const tienGiam = (orderData.tongTienBanDau || 0) - (orderData.tongTien || 0);
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-3" style={{ color: "#49a3f1" }}>
            Tổng kết đơn hàng
          </h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              Tạm tính <span>{formatCurrency(orderData.tongTienBanDau)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Phí vận chuyển <span>{formatCurrency(orderData.phiVanChuyen)}</span>
            </li>
            {tienGiam > 0 && (
              <li className="list-group-item d-flex justify-content-between text-danger">
                Giảm giá <span>- {formatCurrency(tienGiam)}</span>
              </li>
            )}
            <li
              className={`list-group-item d-flex justify-content-between fw-bold fs-5 mt-2 ${styles.grandTotal}`}
            >
              Tổng cộng <span>{formatCurrency(orderData.tongHoaDon)}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // === RENDER CHÍNH CỦA COMPONENT ===
  return (
    // Bọc tất cả trong React Fragment
    <>
      <Header />

      <div className={`container my-4 ${styles.pageContainer}`}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4" style={{ color: "#49a3f1" }}>
              Tra Cứu Đơn Hàng
            </h2>
            <form onSubmit={handleLookup} className="row g-3 justify-content-center">
              <div className="col-sm-6 col-md-5">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Nhập mã đơn hàng (ví dụ: HD-94227146)"
                  value={maHoaDon}
                  onChange={(e) => setMaHoaDon(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button
                  type="submit"
                  className={`btn btn-lg ${styles.lookupButton}`}
                  disabled={loading}
                >
                  {loading ? "Đang tìm..." : "Tra cứu"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {orderData && (
          <div className="mt-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">{renderTimeline()}</div>
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                {renderOrderInfo()}
                {renderProductList()}
              </div>
              <div className="col-lg-4">{renderOrderSummary()}</div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default OrderLookup;
