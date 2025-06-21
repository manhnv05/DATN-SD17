import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { FaQrcode, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

// Helper format giá
const formatPrice = (value) =>
    value !== undefined && value !== null
        ? value.toLocaleString("vi-VN") + " ₫"
        : "";

const getTrangThaiText = (status) =>
    status === 1 || status === "Đang bán" || status === "Hiển thị"
        ? "Đang bán"
        : "Ngừng bán";

const statusList = ["Tất cả", "Đang bán", "Ngừng bán"];
const viewOptions = [5, 10, 20];

// Hàm hiển thị khoảng giá
const getPriceRangeText = (min, max) => {
    if (min === undefined && max === undefined) return "";
    if (min === max || max === undefined) return formatPrice(min);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
};

function ProductTable() {
    const [productsData, setProductsData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // FE filter/search/pagination states
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [viewCount, setViewCount] = useState(5);
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();

    // Fetch products from API (with paging, search, filter)
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            let params = {
                page: page - 1,
                size: viewCount,
                tenSanPham: search,
            };
            if (statusFilter !== "Tất cả") {
                params.trangThai = statusFilter === "Đang bán" ? 1 : 0;
            }

            const response = await axios.get("http://localhost:8080/sanPham", { params });
            const productList = response.data.content || [];

            // Lấy min/max giá từ chiTietSanPham (trường 'gia')
            const results = await Promise.all(
                productList.map(async (sp) => {
                    try {
                        const chiTietRes = await axios.get(
                            `http://localhost:8080/chiTietSanPham/by-san-pham/${sp.id}`
                        );
                        const chiTietList = chiTietRes.data || [];
                        const totalQuantity = chiTietList.reduce(
                            (sum, ct) => sum + (ct.soLuong || 0),
                            0
                        );
                        // Lấy giá min/max từ trường 'gia'
                        let minPrice, maxPrice;
                        const prices = chiTietList
                            .filter((ct) => ct.gia !== undefined && ct.gia !== null)
                            .map((ct) => ct.gia);
                        if (prices.length > 0) {
                            minPrice = Math.min(...prices);
                            maxPrice = Math.max(...prices);
                        }
                        return {
                            id: sp.id,
                            maSanPham: sp.maSanPham,
                            tenSanPham: sp.tenSanPham,
                            giaMin: minPrice,
                            giaMax: maxPrice,
                            trangThai: sp.trangThai,
                            quantity: totalQuantity,
                        };
                    } catch {
                        return {
                            id: sp.id,
                            maSanPham: sp.maSanPham,
                            tenSanPham: sp.tenSanPham,
                            giaMin: undefined,
                            giaMax: undefined,
                            trangThai: sp.trangThai,
                            quantity: 0,
                        };
                    }
                })
            );
            setProductsData({
                ...response.data,
                content: results,
            });
        } catch (error) {
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            setProductsData({
                content: [],
                totalPages: 0,
                number: 0,
                first: true,
                last: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line
    }, [search, statusFilter, viewCount, page]);

    // Pagination change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= productsData.totalPages) setPage(newPage);
    };

    // Menu actions
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Table columns
    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "maSanPham", label: "Mã", align: "left", width: "110px" },
        { name: "tenSanPham", label: "Tên sản phẩm", align: "left", width: "180px" },
        {
            name: "gia",
            label: "Giá",
            align: "center",
            width: "180px",
            render: (value, row) => getPriceRangeText(row.giaMin, row.giaMax),
        },
        {
            name: "quantity",
            label: "Số lượng",
            align: "center",
            width: "100px",
            render: (value) => value ?? 0,
        },
        {
            name: "status",
            label: "Trạng thái",
            align: "center",
            width: "120px",
            render: (value) => (
                <span
                    style={{
                        background: getTrangThaiText(value) === "Đang bán" ? "#e6f4ea" : "#f4f6fb",
                        color: getTrangThaiText(value) === "Đang bán" ? "#219653" : "#bdbdbd",
                        border: `1px solid ${
                            getTrangThaiText(value) === "Đang bán" ? "#219653" : "#bdbdbd"
                        }`,
                        borderRadius: 6,
                        fontWeight: 500,
                        padding: "2px 12px",
                        fontSize: 13,
                        display: "inline-block",
                    }}
                >
          {getTrangThaiText(value)}
        </span>
            ),
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "110px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Chi tiết"
                        onClick={() => navigate(`/SanPham/ChiTiet/${row.id}`)}
                    >
                        <FaEye />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#4acbf2" }} title="Sửa">
                        <FaEdit />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#4acbf2" }} title="Xóa">
                        <FaTrash />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows = productsData.content.map((item, idx) => ({
        stt: (page - 1) * viewCount + idx + 1,
        id: item.id,
        maSanPham: item.maSanPham,
        tenSanPham: item.tenSanPham,
        giaMin: item.giaMin,
        giaMax: item.giaMax,
        status: item.trangThai,
        quantity: item.quantity,
        actions: "",
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                {/* PHẦN 1: Card filter/search/action */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        gap={2}
                    >
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input
                                fullWidth
                                placeholder="Tìm kiếm sản phẩm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                            search
                                        </Icon>
                                    </InputAdornment>
                                }
                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                            />
                            <FormControl sx={{ minWidth: 140 }}>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Trạng thái" }}
                                >
                                    {statusList.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <IconButton onClick={handleMenuOpen} sx={{ color: "#495057" }}>
                                <Icon fontSize="small">menu</Icon>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handleMenuClose} sx={{ color: "#384D6C" }}>
                                    <FaQrcode className="me-2" style={{ color: "#0d6efd" }} /> Quét mã
                                </MenuItem>
                                <MenuItem onClick={handleMenuClose} sx={{ color: "#384D6C" }}>
                                    <span style={{ color: "#27ae60", marginRight: 8 }}>📥</span> Export Excel
                                </MenuItem>
                            </Menu>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaPlus />}
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
                                onClick={() => navigate("/SanPham/ThemMoi")}
                            >
                                Thêm sản phẩm
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>

                {/* PHẦN 2: Card Table/Pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox>
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <Table columns={columns} rows={rows} loading={loading} />
                        )}
                    </SoftBox>
                    <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <SoftBox>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    mr: 1,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                }}
                                aria-haspopup="true"
                                aria-controls="view-count-menu"
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                Xem {viewCount} sản phẩm
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                id="view-count-menu"
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                {viewOptions.map((n) => (
                                    <MenuItem
                                        key={n}
                                        onClick={() => {
                                            setViewCount(n);
                                            setPage(1);
                                            handleMenuClose();
                                        }}
                                        sx={{ color: "#495057" }}
                                    >
                                        Xem {n} sản phẩm
                                    </MenuItem>
                                ))}
                            </Menu>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                sx={{ color: page === 1 ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
                            </Button>
                            {Array.from({ length: productsData.totalPages }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    variant={page === i + 1 ? "contained" : "text"}
                                    color={page === i + 1 ? "info" : "inherit"}
                                    size="small"
                                    onClick={() => handlePageChange(i + 1)}
                                    sx={{
                                        minWidth: 32,
                                        borderRadius: 2,
                                        color: page === i + 1 ? "#fff" : "#495057",
                                        background: page === i + 1 ? "#49a3f1" : "transparent",
                                    }}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="text"
                                size="small"
                                disabled={page === productsData.totalPages || productsData.totalPages === 0}
                                onClick={() => handlePageChange(page + 1)}
                                sx={{ color: page === productsData.totalPages ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ProductTable;