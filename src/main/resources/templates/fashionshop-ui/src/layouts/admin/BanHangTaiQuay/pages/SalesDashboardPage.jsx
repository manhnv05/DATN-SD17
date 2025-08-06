// src/layouts/sales/SalesDashboardPage.jsx

import React, { useState, useCallback, useMemo ,useEffect,useRef  } from "react";
// Import các component layout chuẩn
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../../examples/Footer";
import SoftBox from "../../../../components/SoftBox";
import Grid from "@mui/material/Grid";
import Pay from "../component/Pay"; // Giả sử bạn đã tạo component Pay
import axios from "axios";
import { toast } from "react-toastify";
import SalesCounter from "../component/SalesCounter";

function SalesDashboardPage() {

  const [completedOrderId, setCompletedOrderId] = useState(null);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
const [ordersData, setOrdersData] = useState(() => {
    try {
      const savedOrdersData = localStorage.getItem("allInvoicesData");
      return savedOrdersData ? JSON.parse(savedOrdersData) : {}; // Nếu có thì dùng, không thì là object rỗng
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu hóa đơn từ localStorage:", error);
      return {};
    }
  });
    // THAY ĐỔI 2: Thêm useEffect để TỰ ĐỘNG LƯU DỮ LIỆU vào localStorage mỗi khi `ordersData` thay đổi.
  useEffect(() => {
    try {
      localStorage.setItem("allInvoicesData", JSON.stringify(ordersData));
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu hóa đơn vào localStorage:", error);
    }
  }, [ordersData])
  const handleInvoiceIdChange = useCallback((invoiceId) => {
    setSelectedInvoiceId((prevId) => (prevId !== invoiceId ? invoiceId : prevId));
    
  }, []);

  const handleProductsChange = useCallback((products) => {
    setCurrentProducts(products);
  }, []);

  const handlePaymentDataChange = useCallback((data) => {
    setPaymentData(data);
  }, []);
  // src/layouts/sales/SalesDashboardPage.jsx

  const handleTotalChange = useCallback((newTotal) => {
    setCartTotal(newTotal);
  }, []);

  const handleSaveOrder = useCallback(
    async (latestPaymentData) => {
      if (!selectedInvoiceId || !latestPaymentData) {
        toast.error("Vui lòng kiểm tra lại thông tin hóa đơn và thanh toán.");
        return;
      }

      try {
        // Chuẩn bị các phần chung của payload
        const danhSachSanPham = currentProducts.map((p) => {
          // Xác định giá cuối cùng để gửi đi
          const finalPrice = p.giaTienSauKhiGiam > 0 ? p.giaTienSauKhiGiam : p.gia;

          return {
            id: p.idChiTietSanPham,
            soLuong: p.quantity,
            donGia: finalPrice, // Sử dụng giá cuối cùng đã được tính toán
          };
        });
        const phieuGiamGiaId = latestPaymentData.phieuGiamGia
          ? String(latestPaymentData.phieuGiamGia.id)
          : null;

        // Khai báo biến payload mà không khởi tạo
        let finalPayload;

        // Xây dựng payload hoàn chỉnh trong từng trường hợp
        if (latestPaymentData.customer && latestPaymentData.customer.id) {
          const { shippingInfo, customer } = latestPaymentData;
          const addressParts = [
            shippingInfo?.detailedAddress,
            shippingInfo?.ward,
            shippingInfo?.district,
            shippingInfo?.province,
          ].filter(Boolean);

          // Tạo payload cho trường hợp CÓ khách hàng
          finalPayload = {
            idHoaDon: selectedInvoiceId,
            phieuGiamGia: phieuGiamGiaId,
            danhSachSanPham: danhSachSanPham,
            phiVanChuyen: latestPaymentData.shippingFee || 0,
            khachHang: customer.id || 115,
            tenKhachHang: shippingInfo?.name || customer.tenKhachHang,
            sdt: shippingInfo?.phone || customer.sdt || null,
            diaChi: addressParts.join(", "),
          };
        } else {
          // Tạo payload cho trường hợp KHÁCH LẺ
          finalPayload = {
            idHoaDon: selectedInvoiceId,
            phieuGiamGia: phieuGiamGiaId,
            danhSachSanPham: danhSachSanPham,
            phiVanChuyen: latestPaymentData.shippingFee || 0,
            tenKhachHang: "Khách lẻ",
          };
        }

        // In ra "ảnh chụp" chính xác của payload bằng JSON.stringify
        console.log("Gửi payload cuối cùng lên backend:", JSON.stringify(finalPayload, null, 2));

        await axios.put("http://localhost:8080/api/hoa-don/update_hoadon", finalPayload, {
          withCredentials: true // <-- SỬA ở đây, thêm option này để gửi cookie/session khi gọi API
        });
        toast.success("Xác nhận thành công");
        setCompletedOrderId(selectedInvoiceId);
      } catch (error) {
        console.error("Đã có lỗi xảy ra:", error);
        toast.error("Xác nhận thất bại" + "," + error.response.data.message);
      }
    },
    [selectedInvoiceId, currentProducts]
  );
   
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesCounter
              onProductsChange={handleProductsChange}
              onInvoiceIdChange={handleInvoiceIdChange}
              onTotalChange={handleTotalChange}
              completedOrderId={completedOrderId}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Component SalesCounter được gọi ở đây */}
            <Pay
              totalAmount={cartTotal}
              hoaDonId={selectedInvoiceId}
              onSaveOrder={handleSaveOrder}
              onDataChange={handlePaymentDataChange}
             ordersData={ordersData} 
              setOrdersData={setOrdersData}

            />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SalesDashboardPage;
