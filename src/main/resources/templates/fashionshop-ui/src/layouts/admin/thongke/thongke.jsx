import React from 'react';
import PropTypes from 'prop-types';
import Button from "@mui/material/Button";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import Alert from "@mui/material/Alert";
import Table from "../../../examples/Tables/Table";
import CustomTable from 'examples/Tables/Table/tableSlideShow';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
    Box,
    Card,
    Typography,
    Grid,
    Container
} from '@mui/material';
import {
    CalendarToday,
    Today,
    DateRange,
    Event,
    TuneOutlined
} from '@mui/icons-material';

import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import SoftBox from "../../../components/SoftBox";
import { useState, useEffect } from 'react';
import { fetchThongKeAlternative, loadThongKe, loadBieuDo } from './thongkeService';
import TrangThaiPieChart from './bieudo';
import * as XLSX from "xlsx";

function getPaginationItems(current, total) {
    if (total <= 7) {
        // Nếu tổng số trang <= 7, hiển thị tất cả
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
        // Nếu trang hiện tại ở đầu (1, 2, 3)
        return [1, 2, 3, 4, "...", total - 1, total];
    }

    if (current >= total - 2) {
        // Nếu trang hiện tại ở cuối
        return [1, 2, "...", total - 3, total - 2, total - 1, total];
    }

    // Nếu trang hiện tại ở giữa
    return [1, 2, "...", current - 1, current, current + 1, "...", total - 1, total];
}

const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    stats = []
}) => (
    <Card
        sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
            }
        }}
    >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box>
                <Icon sx={{ fontSize: 28, mb: 1, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.9rem' }}>
                    {title}
                </Typography>
            </Box>
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            {value}
        </Typography>

        <Grid container spacing={2}>
            {stats.map((stat, index) => (
                <Grid item xs={3} key={index}>
                    <Box textAlign="center">
                        <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                            {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {stat.value}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Card>
);

// PropTypes validation for StatCard component
StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    )
};

// Hàm format số thành tiền tệ (cải tiến)
function formatCurrency(value) {
    if (!value || value === "0") return "0 VNĐ";
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.toString().replace(/\D/g, "");
    if (!numericValue) return "";

    // Format số với dấu phẩy phân cách hàng nghìn
    const formatted = new Intl.NumberFormat('vi-VN').format(numericValue);
    return formatted + " VNĐ";
}

// Hàm format date thành string ISO
function formatDateToISO(date) {
    if (!date) return null;
    return date.toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
}
// Hàm fetch thống kê với tùy chỉnh ngày
const fetchCustomStats = async (startDate, endDate) => {
    try {
        let url = "http://localhost:8080/thong_ke";
        if (startDate && endDate) {
            const ngayBD = formatDateToISO(startDate);
            const ngayKt = formatDateToISO(endDate);
            url += `?ngayBD=${ngayBD}&ngayKt=${ngayKt}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch thống kê tùy chỉnh:", error);
        throw error;
    }
};

// Hàm fetch dữ liệu sản phẩm sắp hết hàng
const fetchLowStockProducts = async (slQuery = 1000, page = 0, size = 99) => {
    try {

        const response = await fetch(
            `http://localhost:8080/thong_ke/sanPhamSapHet?slQuery=${slQuery}&page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // <-- Thêm dòng này!
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch sản phẩm sắp hết:", error);
        throw error;
    }
};

export default function DashboardStats() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [check, setCheck] = useState(1)
    const error = null;
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewCount, setViewCount] = useState(5);
    const [page, setPage] = useState(1);
    const [statsData, setStatsData] = useState([]);
    const [customStatsData, setCustomStatsData] = useState(null);
    const [dataResponse, setDataResponse] = useState();
    const [search, setSearch] = useState("");

    // States cho sản phẩm sắp hết hàng
    const [lowStockRows, setLowStockRows] = useState([]);
    const [lowStockLoading, setLowStockLoading] = useState(false);
    const [lowStockViewCount, setLowStockViewCount] = useState(5);
    const [lowStockPage, setLowStockPage] = useState(1);
    const [slQuery, setSlQuery] = useState(10); // State cho slQuery
    const [lowStockData, setLowStockData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });

    const [pagination, setPagination] = useState({
        totalPages: 0,
        pageNo: 1,
        pageSize: 5,
        totalElements: 0,
    });

    const [vouchersData, setvouchersData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });

    const paginationItems = getPaginationItems(page, vouchersData.totalPages);
    const lowStockPaginationItems = getPaginationItems(lowStockPage, lowStockData.totalPages);

    const viewOptions = [5, 10, 20];
    const slQueryOptions = [10, 20, 50, 100]; // Options cho slQuery

    const [anchorEl, setAnchorEl] = useState(null);
    const [lowStockAnchorEl, setLowStockAnchorEl] = useState(null);
    const [slQueryAnchorEl, setSlQueryAnchorEl] = useState(null); // AnchorEl cho slQuery menu

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLowStockMenuOpen = (event) => setLowStockAnchorEl(event.currentTarget);
    const handleLowStockMenuClose = () => setLowStockAnchorEl(null);

    const handleSlQueryMenuOpen = (event) => setSlQueryAnchorEl(event.currentTarget);
    const handleSlQueryMenuClose = () => setSlQueryAnchorEl(null);

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= vouchersData.totalPages &&
            newPage !== page &&
            typeof newPage === "number"
        )
            setPage(newPage);
    };

    const handleLowStockPageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= lowStockData.totalPages &&
            newPage !== lowStockPage &&
            typeof newPage === "number"
        )
            setLowStockPage(newPage);
    };

    const columns = [
        { name: "anh", label: "Ảnh", align: "center", width: "60px" },
        { name: "tensp", label: "Tên Sản phẩm", align: "left" },
        { name: "soLuong", label: "Số lượng", align: "left" },
        { name: "giaTien", label: "Giá tiền", align: "left" },
        { name: "kichCo", label: "Kích cơ", align: "left" },
        { name: "mauSac", label: "Màu sắc", align: "left" },
    ];

    // Columns cho bảng sản phẩm sắp hết hàng
    const lowStockColumns = [
        { name: "maspCt", label: "Mã SP", align: "left" },
        { name: "tenSanPham", label: "Tên Sản phẩm", align: "left" },
        { name: "soLuong", label: "Số lượng", align: "center" },
        { name: "giaTien", label: "Giá tiền", align: "right" },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await fetchThongKeAlternative(page - 1, viewCount, search, startDate, endDate);
            const mapped = data.data.content.map((item, idx) => ({
                tensp: item.tenSp,
                soLuong: item.soLuong,
                giaTien: item.giaTien,
                kichCo: item.kichCo,
                anh: item.hinhAnh,
                mauSac: item.mauSac,
            }));
            setPagination({
                totalPages: data.data.totalPages,
                pageNo: data.data.number + 1,
                pageSize: data.data.size,
                totalElements: data.data.totalElements,
            });

            setRows(mapped);
            setvouchersData({
                ...data.data,
                content: mapped,
            });
        } catch (e) {
            console.error("Lỗi khi fetch vouchers", e);
            // Reset dữ liệu khi có lỗi
            setRows([]);
            setvouchersData({
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

    // Hàm fetch dữ liệu sản phẩm sắp hết hàng
    const fetchLowStockData = async () => {
        setLowStockLoading(true);
        try {
            const data = await fetchLowStockProducts(slQuery, lowStockPage - 1, lowStockViewCount);

            if (data && data.data && data.data.content) {
                const mapped = data.data.content.map((item) => ({
                    maspCt: item.maspCt,
                    tenSanPham: item.tenSanPham,
                    soLuong: item.soLuong,
                    giaTien: formatCurrency(item.giaTien),
                }));

                setLowStockRows(mapped);
                setLowStockData({
                    ...data.data,
                    content: mapped,
                });
            }
        } catch (e) {
            console.error("Lỗi khi fetch sản phẩm sắp hết:", e);
            // Reset dữ liệu khi có lỗi
            setLowStockRows([]);
            setLowStockData({
                content: [],
                totalPages: 0,
                number: 0,
                first: true,
                last: true,
            });
        } finally {
            setLowStockLoading(false);
        }
    };

    const handleClickStatus = (event) => {
        setSearch(event.target.value)
        setCheck(Number(event.target.value) + Number(1))
        setStartDate(null)
        setEndDate(null)
    }

    const loadTK = async () => {
        try {
            const data = await loadThongKe()
            setStatsData([
                {
                    title: 'Hôm nay',
                    value: formatCurrency(data.data.homNay.tongTienTatCa),
                    icon: Today,
                    color: '#17a2b8',
                    stats: [
                        { label: 'Sản phẩm', value: data.data.homNay.tongSanPham },
                        { label: 'Đơn thành công', value: data.data.homNay.tongDonHoanThanh },
                        { label: 'Đơn hủy', value: data.data.homNay.tongDonHuy }
                    ]
                },
                {
                    title: 'Tuần này',
                    value: formatCurrency(data.data.tuanNay.tongTienTatCa),
                    icon: CalendarToday,
                    color: '#fd7e14',
                    stats: [
                        { label: 'Sản phẩm', value: data.data.tuanNay.tongSanPham },
                        { label: 'Đơn thành công', value: data.data.tuanNay.tongDonHoanThanh },
                        { label: 'Đơn hủy', value: data.data.tuanNay.tongDonHuy }
                    ]
                },
                {
                    title: 'Tháng này',
                    value: formatCurrency(data.data.thangNay.tongTienTatCa),
                    icon: DateRange,
                    color: '#007bff',
                    stats: [
                        { label: 'Sản phẩm', value: data.data.thangNay.tongSanPham },
                        { label: 'Đơn thành công', value: data.data.thangNay.tongDonHoanThanh },
                        { label: 'Đơn hủy', value: data.data.thangNay.tongDonHuy }
                    ]
                },
                {
                    title: 'Năm này',
                    value: formatCurrency(data.data.namNay.tongTienTatCa),
                    icon: Event,
                    color: '#28a745',
                    stats: [
                        { label: 'Sản phẩm', value: data.data.namNay.tongSanPham },
                        { label: 'Đơn thành công', value: data.data.namNay.tongDonHoanThanh },
                        { label: 'Đơn hủy', value: data.data.namNay.tongDonHuy }
                    ]
                }
            ]);
        }
        catch {
            console.log("nodata")
        }
    }

    // Hàm load thống kê tùy chỉnh
    const loadCustomStats = async () => {
        if (startDate && endDate) {
            try {
                const data = await fetchCustomStats(startDate, endDate);
                setCustomStatsData({
                    title: 'Tùy chỉnh',
                    value: formatCurrency(data.data.tuyChinh.tongTienTatCa),
                    icon: TuneOutlined,
                    color: '#9c27b0',
                    stats: [
                        { label: 'Sản phẩm', value: data.data.tuyChinh.tongSanPham || '0' },
                        { label: 'Đơn thành công', value: data.data.tuyChinh.tongDonHoanThanh || '0' },
                        { label: 'Đơn hủy', value: data.data.tuyChinh.tongDonHuy || '0' }
                    ]
                });
            } catch (error) {
                console.error("Lỗi khi load thống kê tùy chỉnh:", error);
                setCustomStatsData(null);
            }
        } else {
            setCustomStatsData(null);
        }
    };

    const fetchBieuDo = async () => {
        try {
            const data = await loadBieuDo(check, startDate, endDate);
            setDataResponse(data.data);
        } catch (error) {
            console.error('Error loading BieuDo:', error);
        }

    }

    useEffect(() => {
        fetchBieuDo()
    }, [check, startDate, endDate])

    useEffect(() => {
        loadTK()
    }, [])

    // useEffect cho thống kê tùy chỉnh
    useEffect(() => {
        loadCustomStats()
    }, [startDate, endDate])

    useEffect(() => {
        fetchData()
    }, [page, viewCount, startDate, endDate, search, check])

    // useEffect cho sản phẩm sắp hết hàng
    useEffect(() => {
        fetchLowStockData()
    }, [lowStockPage, lowStockViewCount, slQuery])

    // Tạo array statsData để hiển thị, bao gồm customStatsData nếu có
    const displayStatsData = [...statsData];
    if (customStatsData) {
        displayStatsData.push(customStatsData);
    }

    function exportTableData() {
        return rows.map((item, idx) => [
            (pagination.pageNo - 1) * pagination.pageSize + idx + 1,
            item.tensp,
            item.soLuong,
            item.giaTien,
            item.kichCo,
            item.mauSac,
        ]);
    }

    const exportExcel = async () => {
        const sheetData = [
            [
                "STT",
                "Tên sản phẩm",
                "Số lượng",
                "Giá tiền",
                "Kích cỡ",
                "Màu sắc",
            ],
        ].concat(exportTableData());
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "KhachHang");
        XLSX.writeFile(workbook, "SanPhamBanChay.xlsx");
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <Container maxWidth="xl" sx={{ py: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                                Thống kê
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {displayStatsData.map((stat, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={stat.title === 'Tùy chỉnh' ? 12 : (customStatsData ? 6 : 6)}
                                    lg={stat.title === 'Tùy chỉnh' ? 12 : (customStatsData ? 6 : 6)}
                                    key={index}
                                >
                                    <StatCard {...stat} />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Card>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            Bộ lọc
                        </Typography>
                    </Box>
                    <SoftBox
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        gap={3}
                        flexWrap="wrap"
                    >
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Button
                                variant="outlined"
                                size="small"
                                value="0"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",
                                    padding: "5px 12px",
                                    minWidth: "auto",
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Ngày
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="1"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",
                                    padding: "5px 12px",
                                    minWidth: "auto",
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Tuần
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="2"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",
                                    padding: "5px 12px",
                                    minWidth: "auto",
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Tháng
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="3"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",
                                    padding: "5px 12px",
                                    minWidth: "auto",
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Năm
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                value="4"
                                onClick={handleClickStatus}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: "0.75rem",
                                    padding: "5px 12px",
                                    minWidth: "auto",
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Tùy chỉnh
                            </Button>
                        </SoftBox>

                        <SoftBox
                            display="flex"
                            alignItems="center"
                            gap={1}
                            minWidth={Number(search) === 4 ? 550 : 0}
                            sx={{
                                flexShrink: 0,
                            }}
                        >
                            {Number(search) === 4 && (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                        <DateTimePicker
                                            label="Từ ngày"
                                            value={startDate}
                                            inputFormat="DD-MM-YYYY HH:mm"
                                            onChange={(newValue) => setStartDate(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    sx={{ minWidth: 200 }}
                                                />
                                            )}
                                        />
                                        <DateTimePicker
                                            label="Đến ngày"
                                            value={endDate}
                                            inputFormat="DD-MM-YYYY HH:mm"
                                            onChange={(newValue) => setEndDate(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    size="small"
                                                    sx={{ minWidth: 200 }}
                                                />
                                            )}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                setStartDate(null);
                                                setEndDate(null);
                                            }}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontWeight: 400,
                                                fontSize: "0.75rem",
                                                padding: "5px 12px",
                                                minWidth: "auto",
                                                color: "#dc3545",
                                                borderColor: "#dc3545",
                                                boxShadow: "none",
                                                "&:hover": {
                                                    borderColor: "#c82333",
                                                    background: "#fdf2f2",
                                                    color: "#c82333",
                                                },
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    </Box>
                                </LocalizationProvider>
                            )}
                        </SoftBox>

                        <SoftBox
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ flexShrink: 0 }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={exportExcel}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#49a3f1",
                                    borderColor: "#49a3f1",
                                    boxShadow: "none",
                                    minWidth: 120,
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                    },
                                }}
                            >
                                Export To Excel
                            </Button>
                        </SoftBox>
                    </SoftBox>
                    <Box sx={{ mb: 3, paddingTop: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            Danh sách sản phẩm bán chạy
                        </Typography>
                    </Box>
                    <Card sx={{ padding: { xs: 1, md: 3 } }}>
                        <Box display="flex" flexDirection="row">
                            <Box sx={{ width: "70%" }}>
                                <Box display="flex" flexDirection="column">

                                    {error && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {error}
                                        </Alert>
                                    )}
                                    <SoftBox>
                                        <CustomTable columns={columns} rows={rows} loading={loading} />
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
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    color: "#49a3f1",
                                                    borderColor: "#49a3f1",
                                                }}
                                                aria-haspopup="true"
                                                aria-controls="view-count-menu"
                                                onClick={handleMenuOpen}
                                            >
                                                Xem {viewCount} phiếu
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
                                                        Xem {n} phiếu
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
                                                TRƯỚC
                                            </Button>
                                            {paginationItems.map((item, idx) =>
                                                item === "..." ? (
                                                    <Button
                                                        key={`ellipsis-${idx}`}
                                                        variant="text"
                                                        size="small"
                                                        disabled
                                                        sx={{
                                                            minWidth: 32,
                                                            height: 32,
                                                            borderRadius: 2,
                                                            color: "#bdbdbd",
                                                            pointerEvents: "none",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ...
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        key={item}
                                                        variant={page === item ? "contained" : "text"}
                                                        color={page === item ? "primary" : "inherit"}
                                                        size="small"
                                                        onClick={() => handlePageChange(item)}
                                                        sx={{
                                                            minWidth: 32,
                                                            height: 32,
                                                            borderRadius: 2,
                                                            color: page === item ? "#fff" : "#495057",
                                                            background: page === item ? "#1976d2" : "transparent",
                                                            fontWeight: page === item ? 600 : 400,
                                                            "&:hover": {
                                                                background: page === item ? "#1565c0" : "rgba(25, 118, 210, 0.04)",
                                                            },
                                                        }}
                                                    >
                                                        {item}
                                                    </Button>
                                                )
                                            )}
                                            <Button
                                                variant="text"
                                                size="small"
                                                disabled={page === vouchersData.totalPages || vouchersData.totalPages === 0}
                                                onClick={() => handlePageChange(page + 1)}
                                                sx={{ color: page === vouchersData.totalPages ? "#bdbdbd" : "#49a3f1" }}
                                            >
                                                SAU
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>

                                </Box>
                            </Box>
                            <Box sx={{ width: "30%" }}>
                                <Box display="flex" flexDirection="column">
                                    <TrangThaiPieChart dataResponse={dataResponse} />
                                </Box>
                            </Box>
                        </Box>
                    </Card>

                    {/* Phần sản phẩm sắp hết hàng */}
                    <Box sx={{ mb: 3, paddingTop: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#495057', mb: 1 }}>
                            Danh sách sản phẩm sắp hết hàng
                        </Typography>
                    </Box>

                    <Card sx={{ padding: { xs: 1, md: 3 } }}>
                        <Box display="flex" flexDirection="column">
                            {/* Filter cho slQuery */}
                            <SoftBox
                                display="flex"
                                justifyContent="flex-start"
                                alignItems="center"
                                mb={2}
                                gap={2}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 500, color: '#495057' }}>
                                    Hiển thị sản phẩm có số lượng ≤
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        color: "#49a3f1",
                                        borderColor: "#49a3f1",
                                        minWidth: 80,
                                        "&:hover": {
                                            borderColor: "#1769aa",
                                            background: "#f0f6fd",
                                            color: "#1769aa",
                                        },
                                    }}
                                    aria-haspopup="true"
                                    aria-controls="slquery-menu"
                                    onClick={handleSlQueryMenuOpen}
                                >
                                    {slQuery}
                                </Button>
                                <Menu
                                    anchorEl={slQueryAnchorEl}
                                    id="slquery-menu"
                                    open={Boolean(slQueryAnchorEl)}
                                    onClose={handleSlQueryMenuClose}
                                >
                                    {slQueryOptions.map((option) => (
                                        <MenuItem
                                            key={option}
                                            onClick={() => {
                                                setSlQuery(option);
                                                setLowStockPage(1); // Reset về trang 1 khi thay đổi slQuery
                                                handleSlQueryMenuClose();
                                            }}
                                            sx={{
                                                color: "#495057",
                                                backgroundColor: slQuery === option ? "#f0f6fd" : "transparent",
                                                "&:hover": {
                                                    backgroundColor: "#f0f6fd"
                                                }
                                            }}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </SoftBox>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <SoftBox>
                                <Table columns={lowStockColumns} rows={lowStockRows} loading={lowStockLoading} />
                            </SoftBox>

                            <SoftBox
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={2}
                                flexWrap="wrap"
                                gap={2}
                            >
                                {/* View count selector cho sản phẩm sắp hết */}
                                <SoftBox>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: "none",
                                            color: "#49a3f1",
                                            borderColor: "#49a3f1",
                                        }}
                                        aria-haspopup="true"
                                        aria-controls="low-stock-view-count-menu"
                                        onClick={handleLowStockMenuOpen}
                                    >
                                        Xem {lowStockViewCount} sản phẩm
                                    </Button>
                                    <Menu
                                        anchorEl={lowStockAnchorEl}
                                        id="low-stock-view-count-menu"
                                        open={Boolean(lowStockAnchorEl)}
                                        onClose={handleLowStockMenuClose}
                                    >
                                        {viewOptions.map((n) => (
                                            <MenuItem
                                                key={n}
                                                onClick={() => {
                                                    setLowStockViewCount(n);
                                                    setLowStockPage(1);
                                                    handleLowStockMenuClose();
                                                }}
                                                sx={{ color: "#495057" }}
                                            >
                                                Xem {n} sản phẩm
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </SoftBox>

                                {/* Pagination cho sản phẩm sắp hết */}
                                <SoftBox display="flex" alignItems="center" gap={1}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        disabled={lowStockPage === 1}
                                        onClick={() => handleLowStockPageChange(lowStockPage - 1)}
                                        sx={{ color: lowStockPage === 1 ? "#bdbdbd" : "#49a3f1" }}
                                    >
                                        TRƯỚC
                                    </Button>
                                    {lowStockPaginationItems.map((item, idx) =>
                                        item === "..." ? (
                                            <Button
                                                key={`low-stock-ellipsis-${idx}`}
                                                variant="text"
                                                size="small"
                                                disabled
                                                sx={{
                                                    minWidth: 32,
                                                    height: 32,
                                                    borderRadius: 2,
                                                    color: "#bdbdbd",
                                                    pointerEvents: "none",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ...
                                            </Button>
                                        ) : (
                                            <Button
                                                key={`low-stock-${item}`}
                                                variant={lowStockPage === item ? "contained" : "text"}
                                                color={lowStockPage === item ? "primary" : "inherit"}
                                                size="small"
                                                onClick={() => handleLowStockPageChange(item)}
                                                sx={{
                                                    minWidth: 32,
                                                    height: 32,
                                                    borderRadius: 2,
                                                    color: lowStockPage === item ? "#fff" : "#495057",
                                                    background: lowStockPage === item ? "#1976d2" : "transparent",
                                                    fontWeight: lowStockPage === item ? 600 : 400,
                                                    "&:hover": {
                                                        background: lowStockPage === item ? "#1565c0" : "rgba(25, 118, 210, 0.04)",
                                                    },
                                                }}
                                            >
                                                {item}
                                            </Button>
                                        )
                                    )}
                                    <Button
                                        variant="text"
                                        size="small"
                                        disabled={lowStockPage === lowStockData.totalPages || lowStockData.totalPages === 0}
                                        onClick={() => handleLowStockPageChange(lowStockPage + 1)}
                                        sx={{ color: lowStockPage === lowStockData.totalPages ? "#bdbdbd" : "#49a3f1" }}
                                    >
                                        SAU
                                    </Button>
                                </SoftBox>
                            </SoftBox>
                        </Box>
                    </Card>

                </Card>
            </SoftBox>
        </DashboardLayout>
    );
};