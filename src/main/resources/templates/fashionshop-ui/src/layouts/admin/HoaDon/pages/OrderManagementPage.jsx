// src/component/MainContent/OrderManagementPage.jsx

import React, { useState } from "react";

// Import các component layout chuẩn
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../../examples/Footer";
import SoftBox from "../../../../components/SoftBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftTypography from "../../../../components/SoftTypography";
import { format } from "date-fns";
import * as XLSX from "xlsx";
// Import 2 component con
import OrderFilter from "../MainContent/OrderFilter";
import OrderTable from "../MainContent/OrderTable";
function OrderManagementPage() {
  // State để lưu trữ tất cả các giá trị lọc
  const [filterValues, setFilterValues] = useState({
    searchTerm: "",
    ngayTaoStart: "",
    ngayTaoEnd: "",
    loaiHoaDon: "",
  });
  const [orders, setOrders] = useState([]);
  // State cho phân trang, quản lý ở component cha
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  // Hàm được truyền xuống OrderFilter để cập nhật bộ lọc và reset trang
  const handleFilterChange = (newFilters) => {
    setFilterValues(newFilters);
    setCurrentPage(0); // Reset về trang đầu tiên khi có bộ lọc mới
  };

  // Hàm để xóa tất cả các bộ lọc và tải lại trang đầu tiên
  const handleClearFilters = () => {
    setFilterValues({
      searchTerm: "",
      ngayTaoStart: "",
      ngayTaoEnd: "",
      loaiHoaDon: "",
    });
    setCurrentPage(0);
  };
  // Thêm các hàm helper để format dữ liệu
  function getStatusLabel(status) {
    switch (status) {
      case "CHO_XAC_NHAN":
        return "Chờ xác nhận";
      case "TAO_DON_HANG":
        return "Tạo đơn hàng";
      case "CHO_GIAO_HANG":
        return "Chờ giao hàng";
      case "DA_XAC_NHAN":
        return "Đã xác nhận";
      case "DANG_VAN_CHUYEN":
        return "Vận chuyển";
      case "HOAN_THANH":
        return "Hoàn thành";
      case "HUY":
        return "Đã hủy";
      default:
        return status;
    }
  }

  function getOrderTypeLabel(type) {
    switch (type) {
      case "online":
        return "Trực tuyến";
      case "Tại quầy":
        return "Tại quầy";
      default:
        return type;
    }
  }

  // Hàm xuất dữ liệu bảng
  function exportTableData(orders, currentPage, pageSize) {
    return orders.map((order, index) => [
      currentPage * pageSize + index + 1, // STT
      order.maHoaDon || "", // Mã hóa đơn
      order.maNhanVien || "", // Mã nhân viên
      order.tenKhachHang || "", // Tên khách hàng
      order.sdt || "", // Số điện thoại
      order.tongHoaDon ? `${order.tongHoaDon.toLocaleString("vi-VN")} đ` : "0 đ", // Tổng tiền
      getStatusLabel(order.trangThai), // Trạng thái
      getOrderTypeLabel(order.loaiHoaDon), // Loại đơn
      order.ngayTao ? format(new Date(order.ngayTao), "dd/MM/yyyy HH:mm:ss") : "", // Ngày tạo
    ]);
  }

  // Hàm xuất Excel trang hiện tại
  const handleExportExcel = (orders, currentPage, pageSize) => {
    if (!orders || orders.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const sheetData = [
      [
        "STT",
        "Mã hóa đơn",
        "Mã nhân viên",
        "Tên khách hàng",
        "Số điện thoại",
        "Tổng tiền",
        "Trạng thái",
        "Loại đơn",
        "Ngày tạo",
      ],
    ].concat(exportTableData(orders, currentPage, pageSize));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Thiết lập độ rộng cột
    const wscols = [
      { wch: 5 }, // STT
      { wch: 15 }, // Mã hóa đơn
      { wch: 15 }, // Mã nhân viên
      { wch: 20 }, // Tên khách hàng
      { wch: 15 }, // Số điện thoại
      { wch: 15 }, // Tổng tiền
      { wch: 15 }, // Trạng thái
      { wch: 12 }, // Loại đơn
      { wch: 20 }, // Ngày tạo
    ];
    worksheet["!cols"] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, "HoaDon");

    // Tạo tên file với timestamp
    const now = new Date();
    const timestamp = format(now, "yyyyMMdd_HHmmss");
    XLSX.writeFile(workbook, `danh_sach_hoa_don_${timestamp}.xlsx`);
  };

  // Hàm xuất tất cả dữ liệu Excel
  const handleExportAllExcel = async (filterValues, filterStatus) => {
    try {
      setLoading(true);

      // Gọi API để lấy tất cả dữ liệu
      const params = new URLSearchParams({
        page: 0,
        size: 10000, // Lấy số lượng lớn để đảm bảo lấy hết
      });

      if (filterValues.searchTerm) params.append("searchTerm", filterValues.searchTerm);
      if (filterValues.ngayTaoStart) params.append("ngayTaoStart", filterValues.ngayTaoStart);
      if (filterValues.ngayTaoEnd) params.append("ngayTaoEnd", filterValues.ngayTaoEnd);
      if (filterValues.loaiHoaDon) params.append("loaiHoaDon", filterValues.loaiHoaDon);
      if (filterStatus) {
        params.append("trangThai", filterStatus);
      }

      const apiUrl = `http://localhost:8080/api/hoa-don?${params.toString()}`;
      const response = await fetch(apiUrl, { credentials: "include" });

      if (!response.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);

      const rawResponseData = await response.json();
      const allOrders = rawResponseData.data.content;

      if (!allOrders || allOrders.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
      }

      const sheetData = [
        [
          "STT",
          "Mã hóa đơn",
          "Mã nhân viên",
          "Tên khách hàng",
          "Số điện thoại",
          "Tổng tiền",
          "Trạng thái",
          "Loại đơn",
          "Ngày tạo",
        ],
      ].concat(exportTableData(allOrders, 0, allOrders.length));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Thiết lập độ rộng cột
      const wscols = [
        { wch: 5 }, // STT
        { wch: 15 }, // Mã hóa đơn
        { wch: 15 }, // Mã nhân viên
        { wch: 20 }, // Tên khách hàng
        { wch: 15 }, // Số điện thoại
        { wch: 15 }, // Tổng tiền
        { wch: 15 }, // Trạng thái
        { wch: 12 }, // Loại đơn
        { wch: 20 }, // Ngày tạo
      ];
      worksheet["!cols"] = wscols;

      XLSX.utils.book_append_sheet(workbook, worksheet, "HoaDon");

      // Tạo tên file với timestamp
      const now = new Date();
      const timestamp = format(now, "yyyyMMdd_HHmmss");
      XLSX.writeFile(workbook, `tat_ca_hoa_don_${timestamp}.xlsx`);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      alert("Có lỗi xảy ra khi xuất file Excel!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          {/* KHỐI BỘ LỌC */}
          <Grid item xs={12}>
            <OrderFilter
              onFilterChange={handleFilterChange}
              filterValues={filterValues}
              onClearFilters={handleClearFilters}
              onExportExcel={() => handleExportExcel(orders, currentPage, pageSize)}
              onExportAllExcel={() => handleExportAllExcel(filterValues, filterStatus)}
              loading={loading}
              hasData={orders && orders.length > 0}
            />
          </Grid>

          {/* KHỐI BẢNG DỮ LIỆU */}
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3} pb={1}>
                <SoftTypography variant="h6" fontWeight="medium" color="info">
                  Danh sách Đơn hàng
                </SoftTypography>
              </SoftBox>
              <OrderTable
                filterValues={filterValues}
                currentPage={currentPage}
                pageSize={pageSize}
                setCurrentPage={setCurrentPage}
                setPageSize={setPageSize}
                onOrdersUpdate={setOrders} // Callback để cập nhật orders
                onFilterStatusUpdate={setFilterStatus} // Callback để cập nhật filterStatus
              />
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default OrderManagementPage;
