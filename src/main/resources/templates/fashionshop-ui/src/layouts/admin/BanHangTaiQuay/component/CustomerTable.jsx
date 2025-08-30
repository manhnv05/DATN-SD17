import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SoftBox from "../../../../components/SoftBox";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../../examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "../../../../examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaTrash } from "react-icons/fa"; // FaTrash and FaEye are still here for other actions, even if not used by default in isSelectionMode
import axios from "axios";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DialogContentText from "@mui/material/DialogContentText";
import Avatar from "@mui/material/Avatar";
import Notifications from "../../Notifications";
import dayjs from "dayjs";
import SoftButton from "../../../../components/SoftButton";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Import component AddCustomerDialog
import AddCustomerDialog from "./AddCustomerDialog"; // Đảm bảo đường dẫn này đúng

// --- Các hàm tiện ích (giữ nguyên) ---
const genderList = ["Tất cả", "Nam", "Nữ", "Khác"];
const statusList = ["Tất cả", "Hoạt Động", "Ngừng hoạt động"];
const viewOptions = [5, 10, 20];

function getGenderText(gender) {
  if (gender === "Nam" || gender === 1) return "Nam";
  if (gender === "Nữ" || gender === 0) return "Nữ";
  return "Khác";
}

function getStatusText(status) {
  if (status === 1 || status === "Online") return "Hoạt Động";
  return "Ngừng hoạt động";
}

function getPaginationItems(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i);
  if (current <= 2) return [0, 1, 2, "...", total - 1];
  if (current >= total - 3) return [0, "...", total - 3, total - 2, total - 1];
  return [0, "...", current - 1, current, current + 1, "...", total - 1];
}

// === BẮT ĐẦU COMPONENT ===
function CustomerTable({ isSelectionMode = false, onSelectCustomer = () => {} ,idHoaDon = null }) {
  const [customersData, setCustomersData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    first: true,
    last: true,
  });
  const [assigningId, setAssigningId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [viewCount, setViewCount] = useState(5);
  const [page, setPage] = useState(0);

  // States cho các dialog sửa/xóa (giữ nguyên nếu bạn đang dùng)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  // State to control the AddCustomerDialog
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);

  // Function to open the Add Customer Dialog
  const handleOpenAddCustomerDialog = () => {
    console.log("Button clicked! Opening AddCustomerDialog.");
    setAddCustomerDialogOpen(true);
  };

  // Function to close the Add Customer Dialog
  const handleCloseAddCustomerDialog = () => {
    setAddCustomerDialogOpen(false);
  };

 const handleSelectAndAssignCustomer = async (customer) => {
  if (!idHoaDon) {
    toast.error("Lỗi: Không tìm thấy mã hóa đơn để cập nhật.");
    return;
  }

  setAssigningId(customer.id);

  try {
    // === BƯỚC 1: LẤY DANH SÁCH ĐỊA CHỈ CỦA KHÁCH HÀNG ===
    const diaChiResponse = await axios.get(`http://localhost:8080/diaChi/khachhang/${customer.id}`, {
      withCredentials: true,
    });
    const addresses = diaChiResponse.data || [];

    // === BƯỚC 2: GỌI API CẬP NHẬT KHÁCH HÀNG VÀO HÓA ĐƠN ===
    const payload = {
      idHoaDon: idHoaDon,
      idKhachHang: customer.id,
    };
    await axios.put("http://localhost:8080/api/hoa-don/cap-nhat-khach-hang", payload, {
      withCredentials: true,
    });

    toast.success(`Đã chọn khách hàng: ${customer.tenKhachHang}`);

    // === BƯỚC 3: GỬI CẢ KHÁCH HÀNG VÀ DANH SÁCH ĐỊA CHỈ VỀ CHO COMPONENT CHA ===
    onSelectCustomer(customer, addresses);

  } catch (err) {
    console.error("Failed to assign customer:", err);
    toast.error("Thêm khách hàng vào hóa đơn thất bại!");
  } finally {
    setAssigningId(null);
  }
};
  // Callback function to refresh customer list after a new customer is added
  const handleCustomerAdded = () => {
    handleCloseAddCustomerDialog(); // Close the add customer dialog
    fetchCustomers(); // Re-fetch the customer data to show the newly added customer
  };

  async function fetchCustomers() {
    setLoading(true);
    setError(null);
    try {
      const getGenderParam = () => {
        if (genderFilter === "Nam") return 1;
        if (genderFilter === "Nữ") return 0;
        return undefined;
      };

      const params = {
        page: page,
        size: viewCount,
        tenKhachHang: search || undefined,
        gioiTinh: getGenderParam(),
     trangThai:
          statusFilter !== "Tất cả" ? (statusFilter === "Hoạt Động" ? 1 : 0) : undefined,
      };

      const response = await axios.get("http://localhost:8080/khachHang", {
        params,
        withCredentials: true // <-- Thêm dòng này!
      });
      setCustomersData({ ...response.data, content: response.data.content || [] });
    } catch (error) {
      setError("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, [search, genderFilter, statusFilter, viewCount, page]);

  // --- Các hàm xử lý (giữ nguyên) ---
  // ...

  const columns = [
    { name: "stt", label: "STT", align: "center" },
    {
      name: "tenKhachHang",
      label: "Khách hàng",
      align: "left",
      render: (value, row) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar src={row.anh} alt={value} />
         <Typography variant="body2" sx={{ textTransform: 'none' }}>{value}</Typography>
        </Box>
      ),
    },
   {
  name: "email",
  label: "Email",
  align: "left",
  render: (value) => (
    <Typography variant="body2" sx={{ textTransform: 'none' }}>
     
      {value ? value.toLowerCase() : ''}
    </Typography>
  )
},
    {
      name: "ngaySinh",
      label: "Ngày sinh",
      align: "center",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : ""),
    },
    {
      name: "gioiTinh",
      label: "Giới tính",
      align: "center",
      render: (value) => getGenderText(value),
    },
{
  name: "trangThai",
  label: "Trạng thái",
  align: "center",
  render: (value) => (
    <Typography
      component="span"
      variant="caption"
     sx={{
  // Các thuộc tính cũ giữ nguyên
  background: getStatusText(value) === "Hoạt Động" ? "#e6f4ea" : "#f4f6fb",
  color: getStatusText(value) === "Hoạt Động" ? "#2e7d32" : "#5f6368",
  border: `1px solid ${getStatusText(value) === "Hoạt Động" ? "#2e7d32" : "#e0e0e0"}`,
  borderRadius: "6px",
  fontWeight: 600,
  padding: "4px 8px",
  whiteSpace: "nowrap",

  // === THAY ĐỔI VÀ BỔ SUNG TẠI ĐÂY ===
  display: 'inline-block', // Đảm bảo width hoạt động đúng
  width: '120px',          // Đặt ĐỘ RỘNG CỐ ĐỊNH (thay cho minWidth)
  textAlign: 'center',     // Căn giữa chữ trong ô cho đẹp
}}
    >
      {getStatusText(value)}
    </Typography>
  ),
},
    {
      name: "actions",
      label: "Thao tác",
      align: "center",
      render: (_, row) => {
        // If in selection mode, only show the "Chọn" button
        if (isSelectionMode) {
          const isAssigning = assigningId === row.id;
          return (
              <SoftButton
                 variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 400,
                            color: "#49a3f1",
                            borderColor: "#49a3f1",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#1769aa",
                              background: "#f0f6fd",
                              color: "#1769aa",
                            },
                          }}
                  onClick={() => handleSelectAndAssignCustomer(row)}
                  disabled={assigningId !== null}
              >
                {isAssigning ? <CircularProgress size={16} color="inherit" /> : "Chọn"}
              </SoftButton>
          )
        }
        // Otherwise, show normal actions (detail, delete)
        return (
          <SoftBox display="flex" gap={0.5} justifyContent="center">
            <IconButton
              size="small"
              title="Chi tiết"
              onClick={() => navigate(`/KhachHang/ChiTiet/${row.id}`)}
            >
              <FaEye color="#49a3f1" />
            </IconButton>
            <IconButton
              size="small"
              title="Xóa"
              onClick={() => {
                /* handleDeleteOpen(row) */
              }}
            >
              <FaTrash color="#e74c3c" />
            </IconButton>
          </SoftBox>
        );
      },
    },
  ];

  const rows = customersData.content.map((item, idx) => ({
    stt: page * viewCount + idx + 1,
    ...item,
  }));

  const paginationItems = getPaginationItems(customersData.number, customersData.totalPages);

  // --- Tách JSX thành các phần con để tái sử dụng ---
  const renderFilters = (
    <Card sx={{ padding: { xs: 2, md: 3 }, marginBottom: 2 }}>
      <SoftBox
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Input
          fullWidth
          placeholder="Tìm kiếm khách hàng"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          startAdornment={
            <InputAdornment position="start">
              <Icon fontSize="small">search</Icon>
            </InputAdornment>
          }
        />
       
        <Button
          variant="outlined"
          size="small"
          startIcon={<FaPlus />}
          sx={{ borderColor: "#49a3f1", color: "#49a3f1" }}
          onClick={handleOpenAddCustomerDialog}
        >
          Thêm khách hàng
        </Button>
      </SoftBox>
    </Card>
  );

  const renderTable = (
    <Card sx={{ padding: { xs: 2, md: 3 } }}>
      <SoftBox>
        {error && <Typography color="error">{error}</Typography>}
        <Table columns={columns} rows={rows} loading={loading} />
      </SoftBox>
      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={2}
        flexWrap="wrap"
        gap={2}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            size="small"
            value={viewCount}
            onChange={(e) => setViewCount(Number(e.target.value))}
          >
            {viewOptions.map((n) => (
              <MenuItem key={n} value={n}>
                Xem {n}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <SoftBox display="flex" alignItems="center" gap={1}>
          <Button size="small" disabled={customersData.first} onClick={() => setPage(page - 1)}>
            Trước
          </Button>
          {paginationItems.map((item, idx) =>
            item === "..." ? (
              <span key={`ellipsis-${idx}`}>...</span>
            ) : (
              <Button
                key={item}
                variant={customersData.number === item ? "contained" : "text"}
                color="info"
                size="small"
                onClick={() => setPage(item)}
                sx={{ minWidth: 36 }}
              >
                {item + 1}
              </Button>
            )
          )}
          <Button size="small" disabled={customersData.last} onClick={() => setPage(page + 1)}>
            Sau
          </Button>
        </SoftBox>
      </SoftBox>
    </Card>
  );

  return (
    <>
      <Notifications
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        severity={notification.severity}
         sx={{ zIndex: 9999 }} 
      />
      <SoftBox py={3}>
        {renderFilters}
        {renderTable}
      </SoftBox>

      {/* AddCustomerDialog luôn được render và sẵn sàng để mở */}
      <AddCustomerDialog
        open={addCustomerDialogOpen}
        onClose={handleCloseAddCustomerDialog}
        onCustomerAdded={handleCustomerAdded}
        showNotification={setNotification}
      />

      {/* ... Các Dialog sửa/xóa của bạn nếu có ... */}

      <Footer />
    </>
  );
}

CustomerTable.propTypes = {
  isSelectionMode: PropTypes.bool,
  onSelectCustomer: PropTypes.func,
  idHoaDon: PropTypes.number,
};

export default CustomerTable;
