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
  TextField,
  Paper,
  MenuItem,
  Select
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// === IMPORT CSS VÀ ẢNH ===
// TẠO MỘT FILE OrderDetailModal.module.css VÀ COPY CSS TỪ FILE CŨ SANG
import styles from "./OrderDetailModal.module.css";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt react-toastify
import styles2 from "./ProductList.module.css";

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
import OrderHistoryModal from "../../admin/HoaDon/OrderHistoryModal/OrderHistoryModal"
import { Add, Remove } from "@mui/icons-material";
import EditRecipientModal from "./EditRecipientModal";

import ProductSelectionModalOrderDetail from "layouts/admin/HoaDon/OrderDetail/ProductSelectionModalOrderDetail";

const BASE_SERVER_URL = "http://localhost:8080/";

export default function OrderDetailModal({ open, onClose, orderCode }) {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedPGG, setSelectedPGG] = useState(""); // hoặc null
  const [listPGGKH, setListPGGKH] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading2, setLoading2] = useState(false);
 const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const handleOpenHistoryModal = () => setIsHistoryModalOpen(true);
  const handleCloseHistoryModal = () => setIsHistoryModalOpen(false);
 
  const [productsInOrder, setProductsInOrder] = useState([]);
const [isEditRecipientOpen, setIsEditRecipientOpen] = useState(false);
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
  const fetchAllStock = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_SERVER_URL}api/hoa-don/get-all-so-luong-ton-kho`,
        { withCredentials: true });
      const stockList = response.data?.data || [];
      // Chuyển đổi mảng thành một object để tra cứu nhanh hơn (dạng {id: soLuong})
      const stockMap = stockList.reduce((map, item) => {
        map[item.idChitietSanPham] = item.soLuongTonKho;
        return map;
      }, {});
      setStockData(stockMap);
    } catch (error) {
      console.error("Lỗi khi tải danh sách tồn kho:", error);
      toast.error("Không thể tải dữ liệu tồn kho.");
    }
  }, []);

  const updateOrderDetails = async (updatedProducts) => {
    const subTotal = updatedProducts.reduce(
      (total, product) => total + product.gia * product.soLuong,
      0
    );
    const phiVanChuyen = orderData?.phiVanChuyen || 0;
    const tongTienHoaDon = subTotal;

    let bestCouponId = null;
    if (tongTienHoaDon > 0) {
      try {
        const couponResponse = await axios.post(`${BASE_SERVER_URL}PhieuGiamGiaKhachHang/query`, {
          khachHang: orderData?.khachHang?.id || null,
          tongTienHoaDon: tongTienHoaDon,
        });
        if (couponResponse.data?.data?.content?.length > 0) {
          bestCouponId = couponResponse.data.data.content[0].id;
        }
      } catch (couponError) {
        console.error("Lỗi khi tìm phiếu giảm giá:", couponError);
      }
    }

    const payload = {
      idHoaDon: orderData.id,
      phieuGiamGia: bestCouponId ? String(bestCouponId) : null,
      danhSachSanPham: updatedProducts.map((p) => ({
        id: p.idSanPhamChiTiet,
        soLuong: p.soLuong,
        donGia: p.gia,
      })),
      phiVanChuyen: orderData.phiVanChuyen,
      ghiChu: orderData?.ghiChu,
      tenKhachHang: orderData?.tenKhachHang,
      sdt: orderData?.sdt,
      diaChi: orderData?.diaChi,
      khachHang: orderData?.idKhachHang ? String(orderData.idKhachHang) : null,
      nhanVien: orderData?.idNhanVien ? String(orderData.idNhanVien) : null,
    };

    await axios.put(`${BASE_SERVER_URL}api/hoa-don/update-hoa-don-da-luu`, payload, {
      withCredentials: true,
    });
  };

  const getpggd = (pggd) =>{
    if (pggd.phamTramGiamGia){
      return pggd.maPhieuGiamGia + " - " + pggd.phamTramGiamGia + " %"
    }
    else{
      return pggd.maPhieuGiamGia + " - " + pggd.soTienGiam + " VNĐ"
    }
  }

  // === LOGIC GỌI API ===
  useEffect(() => {
    if (open && orderCode) {
      const fetchOrderDetails = async () => {
        setLoading(true);
        setOrderData(null); // Xóa dữ liệu cũ
        try {
          const response = await axios.get(
            `http://localhost:8080/api/hoa-don/tra-cuu-hoa-don/${orderCode}`
            , { withCredentials: true }
          );
          if (response.data) {
            if (response.data.lichSuHoaDon) {
              response.data.lichSuHoaDon.sort(
                (a, b) => new Date(a.thoiGian) - new Date(b.thoiGian)
              );
            }
            setOrderData(response.data);
            setSelectedPGG(response.data.phieuGiamGia.maPhieu)
            const res = await loadPggKh(response.data.tongTienBanDau)
            console.log(res.data.content)
            setListPGGKH(res.data.content)
          } else {
            throw new Error("Không tìm thấy đơn hàng.");
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Không tìm thấy đơn hàng hoặc có lỗi xảy ra.";
          toast.error(errorMessage);
          console.log(error)
          onClose(); // Đóng modal nếu có lỗi
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [open, orderCode, onClose]);

  const handleChangePGG = (event) => {
    const selectedId = event.target.value;
    setSelectedPGG(selectedId);

    const selectedVoucher = listPGGKH.find((pgg) => pgg.id === selectedId);
    if (selectedVoucher) {
      setTienGiam(selectedVoucher.giaTri); // hoặc cập nhật orderData.giamGia tùy theo logic
    }
  };

  const handleAddProduct = async (productToAdd) => {
    setLoading(true);
    try {
      const { idChiTietSanPham, quantity, soLuongTonKho } = productToAdd;
      if (quantity > soLuongTonKho) {
        toast.warn(`Số lượng tồn kho chỉ còn ${soLuongTonKho}.`);
        return;
      }

      // BƯỚC 1: CẬP NHẬT TỒN KHO
      await axios.put(
        `${BASE_SERVER_URL}api/hoa-don/giam-so-luong-san-pham/${idChiTietSanPham}?soLuong=${quantity}`, {},
        { withCredentials: true }
      );

      // BƯỚC 2: CẬP NHẬT HÓA ĐƠN
      const existingProduct = productsInOrder.find((p) => p.idSanPhamChiTiet === idChiTietSanPham);
      let updatedProducts;

      if (existingProduct) {
        const newQuantity = existingProduct.soLuong + quantity;
        updatedProducts = productsInOrder.map((p) =>
          p.idSanPhamChiTiet === idChiTietSanPham ? { ...p, soLuong: newQuantity } : p
        );
        console.log(newQuantity, idChiTietSanPham)
      } else {
        const price =
          productToAdd.giaTienSauKhiGiam !== null &&
            productToAdd.giaTienSauKhiGiam < productToAdd.gia
            ? productToAdd.giaTienSauKhiGiam
            : productToAdd.gia;
        const newProduct = {
          ...productToAdd,
          id: null,
          idSanPhamChiTiet: idChiTietSanPham,
          soLuong: quantity,
          gia: price,
        };
        updatedProducts = [...productsInOrder, newProduct];
        console.log(quantity, idChiTietSanPham)
      }
      // handleUpdateQuantity(,newQuantity )
      await updateOrderDetails(updatedProducts); // Gọi hàm helper
      toast.success("Thêm sản phẩm thành công!");
      fetchListProductOrder()
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error(error.response?.data?.message || "Thêm sản phẩm thất bại.");
    } finally {
      await fetchListProductOrder();
      await fetchAllStock();
    }
  };

  const fetchListProductOrder = useCallback(async () => {
    if (!orderData) {
      console.log("DEBUG: fetchListProductOrder dừng vì không có orderId.");
      setProductsInOrder([]);
      setOrderData(null);
      return;
    }
    setLoading(true);
    console.log(`DEBUG: Bắt đầu fetchListProductOrder cho orderId: ${orderData.id}`);
    try {
      // API này cần trả về đầy đủ thông tin hóa đơn, bao gồm cả list sản phẩm
      const response = await axios.get(`${BASE_SERVER_URL}api/hoa-don/${orderData.id}`, {
        withCredentials: true,
      });
      const fetchedOrder = response.data || {};
      const fetchedProducts = fetchedOrder.danhSachChiTiet || [];
      setOrderData(fetchedOrder);
      setProductsInOrder(fetchedProducts);


      const initialQuantities = {};
      fetchedProducts.forEach((product) => {
        initialQuantities[product.idSanPhamChiTiet] = product.soLuong;
      });
      setQuantityInput(initialQuantities);

    } catch (error) {
      console.error("Không thể fetch dữ liệu:", error);
      toast.error("Không thể tải dữ liệu hóa đơn.");
    } finally {
      setLoading(false);
    }
  }, [orderData]);

  const loadPggKh = async (tongtien) => {
    const loadKhachHang = await fetch(`http://localhost:8080/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // <-- Thêm dòng này!
    });
    const result = await loadKhachHang.json()
    const data = {
      "khachHang": result.id,
      "tongTienHoaDon": tongtien
    }
    const pggkh = await fetch(`http://localhost:8080/PhieuGiamGiaKhachHang/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // <-- Thêm dòng này!
    });
    const pggkhres = await pggkh.json()
    return pggkhres

  }

  const handleQuantityChange = async (index, value) => {
    setOrderData((prev) => {
      const updated = { ...prev };
      updated.danhSachChiTiet = [...prev.danhSachChiTiet];

      // Cập nhật số lượng cho sản phẩm
      const newSoLuong = value > 0 ? value : 1;
      updated.danhSachChiTiet[index] = {
        ...updated.danhSachChiTiet[index],
        soLuong: newSoLuong,
        thanhTien: updated.danhSachChiTiet[index].gia * newSoLuong,
      };

      // 🔹 Tính lại tổng sau khi đổi số lượng
      const tongTienBanDau = updated.danhSachChiTiet.reduce(
        (sum, item) => sum + item.gia * item.soLuong,
        0
      );
      console.log(updated.giamGia)
      // nếu có giảm giá thì trừ ra, còn không thì giữ nguyên
      const tongTien = tongTienBanDau - (updated.giamGia || 0);

      const tongHoaDon = tongTien + (updated.phiVanChuyen || 0);

      // gán lại vào orderData
      updated.tongTienBanDau = tongTienBanDau;
      updated.tongTien = tongTien;
      updated.tongHoaDon = tongHoaDon;

      return updated;
    });
  };
  // === CÁC HÀM RENDER (Chuyển đổi từ Bootstrap sang MUI Grid và Paper) ===
  const renderTimeline = () => {
    const history = orderData?.lichSuHoaDon || [];
    if (history.length === 0)
      return (
        <Typography sx={{ textAlign: "center", p: 3 }}>Chưa có lịch sử trạng thái.</Typography>
      );

    const uniqueStatusHistory = [];
    const seenStatuses = new Set();

    for (const item of history) {
      const statusDetails = getStatusDetails(item.trangThaiHoaDon);
      const statusText = statusDetails.text; // Lấy ra text chuẩn hóa (ví dụ: "Chờ xác nhận")

      if (!seenStatuses.has(statusText)) {
        uniqueStatusHistory.push(item);
        seenStatuses.add(statusText);
      }
    }

    // Sử dụng mảng đã được lọc để render
    const transformedData = uniqueStatusHistory.map((item) => ({
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


  const [recipient, setRecipient] = useState({
    tenKhachHang: "",
    sdt: "",
    diaChi: "",
  });

  // Khi orderData có giá trị, cập nhật recipient
  useEffect(() => {
    if (orderData) {
      setRecipient({
        tenKhachHang: orderData.tenKhachHang || "",
        sdt: orderData.sdt || "",
        diaChi: orderData.diaChi || "",
      });
    }
  }, [orderData]);

  const handleOpen = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);
// Sửa lại tên hàm cho đúng với state
  const handleOpenEditRecipient = () => setIsEditRecipientOpen(true);
  const handleCloseEditRecipient = () => setIsEditRecipientOpen(false);

  // Hàm này sẽ được truyền vào prop `onSave` của modal con
  const handleSaveRecipient = async (updatedData) => {
    if (!orderData) return;

    // Payload này chỉ chứa những trường cần cập nhật
    const payload = {
      tenKhachHang: updatedData.tenKhachHang,
      sdt: updatedData.sdt,
      diaChi: updatedData.diaChi,
      phiVanChuyen: orderData.phiVanChuyen,  // Modal con đã trả về địa chỉ đầy đủ
    };

    try {
      // API endpoint để cập nhật thông tin người nhận
      const backendApiUrl = `${BASE_SERVER_URL}api/hoa-don/cap-nhat-thong-tin/${orderData.id}`;
      await axios.put(backendApiUrl, payload, { withCredentials: true });

      toast.success("Cập nhật thông tin người nhận thành công!");
      handleCloseEditRecipient(); // Đóng modal
      fetchOrderDetails(orderCode); // Tải lại dữ liệu để hiển thị thông tin mới
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người nhận:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || "Không thể cập nhật thông tin."}`);
    }
  };
  const fetchOrderDetails = useCallback(async (code) => {
    if (!code) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_SERVER_URL}api/hoa-don/tra-cuu-hoa-don/${code}`,
        { withCredentials: true }
      );
      if (response.data) {
        if (response.data.lichSuHoaDon) {
          response.data.lichSuHoaDon.sort((a, b) => new Date(a.thoiGian) - new Date(b.thoiGian));
        }
        setOrderData(response.data);
        // ... (các logic set state khác)
      } else {
        throw new Error("Không tìm thấy đơn hàng.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi tải đơn hàng.";
      toast.error(errorMessage);
      onClose();
    } finally {
      setLoading(false);
    }
  }, [onClose]);
  const handleSave = (updated) => {
    setRecipient(updated);
    console.log(updated, orderData.id)
    // gọi API cập nhật nếu cần
  };

  const renderOrderInfo = () => (
    <Paper elevation={2} sx={{ p: 2.5, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1" }}>
          Thông tin hóa đơn
        </Typography>
        <Button variant="text" size="small" onClick={handleOpenHistoryModal}>
          Xem lịch sử
        </Button>
      </Box>
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
       <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1" }}>
          Thông tin người nhận
        </Typography>
        {orderData && getStatusDetails(orderData.trangThai).text === "Chờ xác nhận" && (
          // SỬA LẠI onClick CHO ĐÚNG HÀM
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenEditRecipient} 
          >
            Sửa
          </Button>
        )}
      </Box>
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
      {/* Modal nằm ở đây nhưng không phá vỡ renderOrderInfo */}
     {isEditRecipientOpen && orderData && (
        <EditRecipientModal
        open={isEditRecipientOpen}
        onClose={handleCloseEditRecipient}
        recipientData={recipient}
        onSave={handleSaveRecipient}
      />
      )}
    </Paper>
  );

  const renderProductList = () => (
    <Paper elevation={2} sx={{ p: 2.5 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#49a3f1", mb: 2 }}>
          Sản phẩm đã đặt
        </Typography>
        {getStatusDetails(orderData.trangThai).text === "Chờ xác nhận" && (
          <button
            className={`${styles2.btn} ${styles2.btnConfirm}`}
            onClick={() => setIsModalOpen(true)}
            disabled={loading2}
          >
            Thêm sản phẩm
          </button>
        )}
      </Box>
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
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(index, product.soLuong - 1)}
              >
                <Remove />
              </IconButton>
              <TextField
                type="number"
                value={product.soLuong}
                onChange={(e) =>
                  handleQuantityChange(index, parseInt(e.target.value) || 1)
                }
                inputProps={{ min: 1, style: { textAlign: "center", width: 60 } }}
                size="small"
              />
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(index, product.soLuong + 1)}
              >
                <Add />
              </IconButton>
            </Box>
          </div>
          <div className={styles.productTotal}>
            {formatCurrency(product.thanhTien)}
          </div>
        </Box>
      ))}
      <ProductSelectionModalOrderDetail
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={handleAddProduct}
      />
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
          {listPGGKH.length > 0 && selectedPGG && (
            <Box mb={1}>
              <Typography mb={0.5}>Chọn phiếu giảm giá:</Typography>
              <Select
                value={selectedPGG}
                onChange={handleChangePGG}
                size="small"
                fullWidth
              >
                {/* Nếu selectedPGG không có trong danh sách, thêm nó vào đầu danh sách */}
                {!listPGGKH.some(pgg => pgg.maPhieuGiamGia === selectedPGG) && (
                  <MenuItem value={selectedPGG} disabled>
                    {selectedPGG} (Đã hết)
                  </MenuItem>
                )}
                {listPGGKH.map((pgg) => (
                  <MenuItem key={pgg.id} value={pgg.maPhieuGiamGia}>
                    {getpggd(pgg)}
                  </MenuItem>
                ))}
              </Select>
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
         {isHistoryModalOpen && orderData?.maHoaDon && (
        <OrderHistoryModal
          maHoaDon={orderData.maHoaDon}
          onClose={handleCloseHistoryModal}
        />
      )}
      {/* --- END: THÊM MỚI --- */}
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