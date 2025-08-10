import React from "react";
import { Box } from "@mui/material";
import styles from "./ProductList.module.css";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import ProductSlideshow from "../../BanHangTaiQuay/component/ProductSlideshow.jsx";
import ProductSelectionModal from "../../BanHangTaiQuay/component/ProductSelectionModal.jsx"
const BASE_SERVER_URL = "http://localhost:8080/";
const ProductList = ({ orderId, orderStatus }) => {
  const [orderData, setOrderData] = useState(null);
  const [productsInOrder, setProductsInOrder] = useState([]);
    // 1. Thêm state để quản lý việc hiển thị modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!orderId) {
      setProducts([]);
      return;
    }
    const fetchListProductOrder = async () => {
      try {
        // Gọi API bằng fetch, 'await' sẽ đợi cho đến khi có phản hồi
        const response = await fetch(
          `http://localhost:8080/api/hoa-don/${orderId}/san-pham`,
          { credentials: "include" } // <-- SỬA ở đây
        );

        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
        }

        // Chuyển đổi phản hồi sang định dạng JSON, 'await' cũng sẽ đợi quá trình này
        const data = await response.json();

        setOrderData(data);
        if (data && Array.isArray(data.data)) {
          setProductsInOrder(data.data); // LƯU MẢNG NÀY VÀO state riêng
        } else {
          setProductsInOrder([]); // Đảm bảo luôn là mảng rỗng
        }
      } catch (error) {
        console.error("Không thể fetch dữ liệu:", error);

        return null;
      }
    };
    fetchListProductOrder();
  }, [orderId]);

  return (
    <div className={styles["product-list"]}>
      {orderStatus === "CHO_XAC_NHAN" && (
        <div className={styles["product-list-header"]}>
          <button className={`${styles.btn} ${styles.btnConfirm}`}>Thêm sản phẩm</button>
        </div>
      )}

      {/* Kiểm tra nếu không có sản phẩm nào */}
      {productsInOrder.length === 0 ? (
        <div>Không có sản phẩm nào trong đơn hàng này.</div>
      ) : (
        // Map dữ liệu từ state 'products' đã được fetch ở trên
        productsInOrder.map((product) => (
          <div key={product.id || product.maSanPhamChiTiet} className={styles["product-item"]}>
            <Box sx={{ position: "relative", width: 150, height: 150, ml: 2 }}>
            <ProductSlideshow product={{
    ...product,
    listUrlImage: product.hinhAnhctsp
}} />
            </Box>
            <div className={styles["product-details"]}>
              <p className={styles["product-name"]}>
                {product.tenSanPham} ({product.maSanPhamChiTiet}) 
              </p>
              <p className={styles["product-price"]}>
                {(product.thanhTien || 0).toLocaleString("vi-VN")} VND
              </p>
               <p className={styles["product-info"]}>{product.tenMauSac}</p>
              <p className={styles["product-info"]}>Size: {product.tenKichThuoc}</p>
              <p className={styles["product-info"]}>x{product.soLuong}</p>
            </div>
            <div className={styles["product-quantity-control"]}>
              <button>-</button>
              <span>{product.soLuong}</span>
              <button>+</button>
            </div>
            <div className={styles["product-total-price"]}>
              {((product.gia || 0) * (product.soLuong || 0)).toLocaleString("vi-VN")} VND
            </div>
          </div>
        ))
      )}
    </div>
  );
};
ProductList.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderStatus: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProductList;
