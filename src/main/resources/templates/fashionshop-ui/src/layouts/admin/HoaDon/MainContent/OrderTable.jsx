import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Table from "../../../../examples/Tables/Table";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import SoftBadge from "../../../../components/SoftBadge";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";

// === HÀM HELPER ĐỂ TẠO CÁC NÚT SỐ TRANG ===
const generatePageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const current = currentPage + 1;
  const pages = new Set();
  pages.add(1);
  pages.add(totalPages);
  pages.add(current);
  if (current > 1) pages.add(current - 1);
  if (current < totalPages) pages.add(current + 1);
  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const result = [];
  let lastPage = 0;
  for (const page of sortedPages) {
    if (page > lastPage + 1) {
      result.push("...");
    }
    result.push(page);
    lastPage = page;
  }
  return result;
};

function OrderTable({ filterValues, currentPage, pageSize, setCurrentPage, setPageSize }) {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [filterStatus, setStatusFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/hoa-don/status-counts", { credentials: "include" });
        if (!response.ok) throw new Error("Không thể lấy dữ liệu trạng thái");
        const data = await response.json();
        setStatusCounts(data.data || {});
      } catch (error) {
        console.error("Lỗi fetch status counts:", error);
        setStatusCounts({});
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: currentPage, size: pageSize });
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
        setOrders(rawResponseData.data.content);
        setTotalPages(rawResponseData.data.totalPages);
      } catch (err) {
        setError(err.message);
        setOrders([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, pageSize, filterValues, filterStatus]);

  const handleStatusTabChange = (event, newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(0);
  };

  const baseBadgeStyles = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    border: "1px solid",
    width: "90px",
    whiteSpace: "nowrap",
    textAlign: "center",
    textTransform: "none",
    "& .MuiBadge-badge": {
      textTransform: "none",
    },
  };

  const columns = [
    { label: "STT", name: "stt", width: "5%", align: "center" },
    { label: "Mã", name: "maHoaDon" },
    { label: "Mã nhân viên", name: "maNhanVien", align: "center" },
    { label: "Tên khách hàng", name: "tenKhachHang", align: "center" },
    { label: "SĐT", name: "sdt" },
    { label: "Tổng tiền", name: "tongTien", align: "right" },
    {
      label: "Trạng thái",
      name: "trangThai",
      align: "center",
      render: (value) => {
        let text = "";
        let colorStyles = {};
        switch (value) {
          case "CHO_XAC_NHAN":
            text = "Chờ xác nhận";
            colorStyles = {
              color: "#ffc107",
              backgroundColor: "#fff3cd",
              borderColor: "#ffc107",
            };
            break;
          case "TAO_DON_HANG":
            text = "Tạo đơn hàng";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "CHO_GIAO_HANG":
            text = "Chờ giao hàng";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "DA_XAC_NHAN":
            text = "Đã xác nhận";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "DANG_VAN_CHUYEN":
            text = "Vận chuyển";
            colorStyles = {
              color: "#ffc107",
              backgroundColor: "#fff3cd",
              borderColor: "#ffc107",
            };
            break;
          case "HOAN_THANH":
            text = "Hoàn thành";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "HUY":
            text = "Đã hủy";
            colorStyles = {
              color: "#dc3545",
              backgroundColor: "#f8d7da",
              borderColor: "#dc3545",
            };
            break;
          default:
            text = value;
            colorStyles = {
              color: "#6c757d",
              backgroundColor: "#e2e3e5",
              borderColor: "#6c757d",
            };
        }
        return (
            <SoftBadge
                size="sm"
                badgeContent={text}
                container
                sx={{
                  ...baseBadgeStyles,
                  ...colorStyles,
                }}
            />
        );
      },
    },
    {
      label: "Loại đơn",
      name: "loaiHoaDon",
      align: "center",
      render: (value) => {
        let text = "";
        let colorStyles = {};
        switch (value) {
          case "online":
            text = "Trực tuyến";
            colorStyles = {
              color: "#0d6efd",
              backgroundColor: "#cfe2ff",
              borderColor: "#0d6efd",
            };
            break;
          case "Tại quầy":
            text = "Tại quầy";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
        }
        return (
            <SoftBadge
                size="sm"
                badgeContent={text}
                container
                sx={{
                  ...baseBadgeStyles,
                  ...colorStyles,
                }}
            />
        );
      },
    },
    {
      label: "Ngày tạo",
      name: "ngayTao",
      align: "center",
      render: (value) => {
        const formattedDate = value ? format(new Date(value), "HH:mm:ss dd/MM/yyyy") : "";
        return (
            <SoftTypography
                variant="caption"
                fontWeight="medium"
                sx={{
                  color: "#495057",
                  whiteSpace: "nowrap",
                  fontSize: "1rem",
                  opacity: 0.6,
                }}
            >
              {formattedDate}
            </SoftTypography>
        );
      },
    },
    {
      label: "Hành động",
      name: "actions",
      align: "center",
      render: (value, row) => {
        return (
            <Tooltip title="Xem chi tiết" placement="top">
              <IconButton color="info" onClick={() => navigate(`/QuanLyHoaDon/${row.id}`)}>
                <Icon>visibility</Icon>
              </IconButton>
            </Tooltip>
        );
      },
    },
  ];

  const rows = orders.map((order, index) => {
    const tongSP = order.danhSachChiTiet
        ? order.danhSachChiTiet.reduce((sum, item) => sum + item.soLuong, 0)
        : 0;
    const tongTien = order.danhSachChiTiet
        ? order.danhSachChiTiet.reduce((sum, item) => sum + item.thanhTien, 0)
        : 0;
    return {
      ...order,
      stt: currentPage * pageSize + index + 1,
      tongSP,
      tongTien: `${(order.tongHoaDon || 0).toLocaleString("vi-VN")} đ`,
    };
  });

  return (
      <SoftBox>
        <SoftBox px={3} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={filterStatus} onChange={handleStatusTabChange}>
            {[
              { key: "", label: "Tất cả" },
              { key: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
              { key: "DA_XAC_NHAN", label: "Đã xác nhận" },
              { key: "CHO_GIAO_HANG", label: "Chờ giao hàng" },
              { key: "DANG_VAN_CHUYEN", label: "Đang vận chuyển" },
              { key: "HOAN_THANH", label: "Hoàn thành" },
              { key: "HUY", label: "Đã hủy" },
            ].map(({ key, label }) => (
                <Tab
                    key={key}
                    value={key}
                    label={
                      <SoftBox display="flex" alignItems="center" justifyContent="center">
                        <SoftTypography variant="body2" fontWeight="bold" sx={{ textTransform: "none" }}>
                          {label}
                        </SoftTypography>
                        {(statusCounts[key] || 0) > 0 && (
                            <Box
                                sx={{
                                  ml: 0.5,
                                  backgroundColor: "#dc3545",
                                  color: "#fff",
                                  borderRadius: "50%",
                                  minWidth: "20px",
                                  height: "20px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  padding: "0 4px",
                                  textTransform: "none",
                                }}
                            >
                              {statusCounts[key]}
                            </Box>
                        )}
                      </SoftBox>
                    }
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(73, 163, 241, 0.1)",
                      },
                      "&.Mui-selected": {
                        color: "#ffff !important",
                        backgroundColor: "#49a3f1 !important",
                      },
                      textTransform: "none",
                    }}
                />
            ))}
          </Tabs>
        </SoftBox>

        {error && (
            <Alert severity="error" sx={{ m: 3, mt: 2 }}>
              {error}
            </Alert>
        )}
        <SoftBox p={3} pt={2}>
          {loading ? (
              <SoftBox>
                {[...Array(pageSize)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={40} sx={{ my: 1 }} />
                ))}
              </SoftBox>
          ) : (
              <Table columns={columns} rows={rows} loading={false} />
          )}

          {!loading && !error && orders.length === 0 && (
              <SoftBox display="flex" justifyContent="center" p={3}>
                <SoftTypography>Không có dữ liệu đơn hàng nào.</SoftTypography>
              </SoftBox>
          )}
        </SoftBox>

        <SoftBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={3}
            flexWrap="wrap"
            gap={2}
        >
          <SoftBox display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
            <SoftTypography variant="body2" sx={{ mr: 1, whiteSpace: "nowrap", color: "#49a3f1" }}>
              Hiển thị:
            </SoftTypography>
            <Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                sx={{ height: "35px", minWidth: "70px" }}
                displayEmpty
                renderValue={(selected) => {
                  if (selected === 5) return "5 hóa đơn";
                  if (selected === 10) return "10 hóa đơn";
                  if (selected === 20) return "20 hóa đơn";
                  return String(selected);
                }}
            >
              <MenuItem value={5}>5 hóa đơn</MenuItem>
              <MenuItem value={10}>10 hóa đơn</MenuItem>
              <MenuItem value={20}>20 hóa đơn</MenuItem>
            </Select>
          </SoftBox>

          <SoftBox display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0, ml: "20px" }}>
            <Button
                variant="text"
                size="small"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                sx={{
                  color: currentPage === 0 ? "#bdbdbd" : "#495057",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(73, 163, 241, 0.08)",
                  },
                }}
            >
              Trước
            </Button>
            {totalPages > 0 &&
                generatePageNumbers(currentPage, totalPages).map((pageNumber, index) =>
                    pageNumber === "..." ? (
                        <SoftTypography
                            key={`ellipsis-${index}`}
                            variant="body2"
                            sx={{ mx: 0.5, color: "#495057" }}
                        >
                          ...
                        </SoftTypography>
                    ) : (
                        <Button
                            key={`page-${pageNumber}`}
                            variant={currentPage === pageNumber - 1 ? "contained" : "text"}
                            color={currentPage === pageNumber - 1 ? "info" : "inherit"}
                            size="small"
                            onClick={() => setCurrentPage(pageNumber - 1)}
                            sx={{
                              minWidth: 32,
                              borderRadius: 2,
                              textTransform: "none",
                              background: currentPage === pageNumber - 1 ? "#49a3f1" : "transparent",
                              color: currentPage === pageNumber - 1 ? "#fff" : "#495057",
                              "&:hover": {
                                backgroundColor:
                                    currentPage === pageNumber - 1 ? "#49a3f1" : "rgba(73, 163, 241, 0.08)",
                              },
                            }}
                        >
                          {pageNumber}
                        </Button>
                    )
                )}
            <Button
                variant="text"
                size="small"
                disabled={currentPage >= totalPages - 1 || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                sx={{
                  color: currentPage >= totalPages - 1 || totalPages === 0 ? "#bdbdbd" : "#495057",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(73, 163, 241, 0.08)",
                  },
                }}
            >
              Sau
            </Button>
          </SoftBox>
        </SoftBox>
      </SoftBox>
  );
}
OrderTable.propTypes = {
  filterValues: PropTypes.shape({
    searchTerm: PropTypes.string,
    ngayTaoStart: PropTypes.string,
    ngayTaoEnd: PropTypes.string,
    loaiHoaDon: PropTypes.string,
  }).isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
};

export default OrderTable;