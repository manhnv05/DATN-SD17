import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import {
    Card,
    FormControl,
    Select,
    MenuItem,
    Button,
    Checkbox,
    Menu,
    IconButton,
    InputAdornment,
    Icon,
    TextField,
    Box,
} from "@mui/material";
import SoftBox from "components/SoftBox";
import Table from "examples/Tables/Table";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { addVouchers, sendMail } from "./service/PhieuGiamService";
import { toast } from 'react-toastify';
import { fetchKhachHang } from "./service/KhachHangService";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { addPDDKH } from "./service/PhieuGiamGiaKhachHangService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { ToastContainer } from 'react-toastify';

// Pagination logic function
function getPaginationItems(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
        return [1, 2, 3, 4, "...", total - 1, total];
    }

    if (current >= total - 2) {
        return [1, 2, "...", total - 3, total - 2, total - 1, total];
    }

    return [1, 2, "...", current - 1, current, current + 1, "...", total - 1, total];
}

export default function AddPhieuGiam() {
    const [statusPhieu, setStatusPhieu] = useState(0)
    const [valueInput, setvalueInput] = useState("")
    const [statusLoaiPhieu, setStatusLoaiPhieu] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [khachHangs, setKhachHang] = useState([])
    const [allKhachHang, setAllKhachHang] = useState([])
    const [page, setPage] = useState(1)
    const [viewCount, setViewCount] = useState(5)
    const [selectedRows, setSelectedRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchKH, setSearchKH] = useState("");
    // const [rows, setRows] = useState([]);

    const navigate = useNavigate();

    // Sửa logic kiểm tra allChecked
    const allChecked = khachHangs?.length > 0 &&
        khachHangs.every(kh => selectedRows.includes(kh.id));

    const viewOptions = [5, 10, 20];

    // Menu actions
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Sửa hàm handleSelectAll
    const handleSelectAll = () => {
        if (allChecked) {
            // Bỏ chọn tất cả khách hàng trên trang hiện tại
            const currentPageIds = khachHangs.map(kh => kh.id);
            setSelectedRows(selectedRows.filter(id => !currentPageIds.includes(id)));
        } else {
            // Chọn tất cả khách hàng trên trang hiện tại (thêm vào selectedRows)
            const currentPageIds = khachHangs.map(kh => kh.id);
            const newSelected = [...selectedRows];

            currentPageIds.forEach(id => {
                if (!newSelected.includes(id)) {
                    newSelected.push(id);
                }
            });

            setSelectedRows(newSelected);
        }
    };

    // Thêm hàm chọn tất cả khách hàng (toàn bộ database)
    const handleSelectAllCustomers = () => {
        if (selectedRows.length === allKhachHang.length) {
            setSelectedRows([]);
        } else {
            const allIds = allKhachHang.map(kh => kh.id);
            setSelectedRows(allIds);
        }
    };

    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(i => i !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const handlePageChange = (newPage) => {
        if (
            newPage >= 1 &&
            newPage <= totalPage &&
            newPage !== page &&
            typeof newPage === "number"
        ) {
            setPage(newPage);
            loadKhachHang(newPage - 1);
        }
    };

    const {
        register,
        handleSubmit,
        control,
        setValue,
    } = useForm();

    const onSubmit = async (data) => {
        const requiredFields = [
            { field: "maPhieuGiamGia", message: "Mã phiếu không để trống" },
            { field: "tenPhieu", message: "Tên phiếu không để trống" },
            { field: "dieuKienGiam", message: "Điều kiện giảm không để trống" },
            { field: "soLuong", message: "Số lượng không để trống" },
        ];
        data.ngayBatDau = dayjs(data.ngayBatDau).format('YYYY-MM-DDTHH:mm:ss');
        data.ngayKetThuc = dayjs(data.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss');
        data.trangThai = 2

        const listKachHang = []
        allKhachHang.filter((khachhang) => selectedRows.includes(khachhang.id)).map((khachhang) => (
            listKachHang.push(khachhang.email)
        ))
        const datasendMail = {
            phieuGiamGiaRequest: data,
            emails: listKachHang
        }
        for (const item of requiredFields) {
            if (!data[item.field]) {
                toast.error(item.message);
                return;
            }
        }
        if (!data.soTienGiam && !data.phamTramGiamGia) {
            toast.error("Giá trị không để trống")
            return
        }
        // const result = await addVouchers(data);
        toast.success("Thêm voucher thành công!");
        if (result) {
            sendMail(datasendMail)
            const dataPDDKH = selectedRows.flatMap((data) => [
                {
                    phieuGiamGia: result.data.id,
                    khachHang: data,
                    trangThai: 1
                }]);
            if (dataPDDKH.length !== 0) {
                await addPDDKH(dataPDDKH)
            }
            navigate("/PhieuGiam");
        } else {
            toast.error("Thêm voucher thất bại");
        }
    };

    const loadKhachHang = async (pageIndex) => {
        setLoading(true);
        try {
            const data = await fetchKhachHang(pageIndex, viewCount, searchKH);
            setKhachHang(data.data.content);
            setTotalPage(data.data.totalPages);
            const all = await fetchKhachHang(0, 999);
            setAllKhachHang(all.data.content);
        } catch (error) {
            console.error("Error loading customers:", error);
            toast.error("Lỗi khi tải danh sách khách hàng");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        loadKhachHang(page - 1);

    }, [page, viewCount, searchKH]);

    function changeInput(value) {
        setStatusPhieu(value.target.value)
        setvalueInput("")
        if (value.target.value == 0) {
            setValue('phamTramGiamGia', "");
        }
        else {
            setValue('soTienGiam', "")
        }
    }

    function changeInputValue(e) {
        let newValue = e.target.value;

        if (statusPhieu === 1) {
            let numericValue = Number(newValue);
            if (numericValue > 100) {
                newValue = 100;
            }
        }

        setvalueInput(newValue)
    }

    const handleChangeRadio = (event) => {
        const value = event.target.value;
        setStatusPhieu(value === "0" ? 0 : 1);
    };

    // Function để render checkbox
    const renderCheckbox = (row) => {
        return (
            <Checkbox
                checked={row.selected}
                onChange={() => handleSelectRow(row.id)}
                size="small"
            />
        );
    };

    // Prepare table data với checkbox được render sẵn
    const rows = khachHangs?.map((khachHang, index) => ({
        id: khachHang.id,
        checkbox: renderCheckbox({
            id: khachHang.id,
            selected: selectedRows.includes(khachHang.id)
        }),
        stt: (page - 1) * viewCount + index + 1,
        tenKhachHang: khachHang.tenKhachHang,
        email: khachHang.email,
        selected: selectedRows.includes(khachHang.id)
    })) || [];

    // Table columns
    const columns = [
        {
            name: "checkbox",
            label: "",
            align: "center",
            width: "50px",
        },
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "tenKhachHang", label: "Tên khách hàng", align: "left" },
        { name: "email", label: "Email", align: "left" },
    ];

    // Pagination rendering
    const paginationItems = getPaginationItems(page, totalPage);

    // Thêm biến để hiển thị số lượng đã chọn
    const selectedCount = selectedRows.length;
    const totalCustomers = allKhachHang.length;

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <SoftBox sx={{ fontSize: "14px", fontWeight: "bold", mb: 2, px: 3 }}>
                    Phiếu giảm giá / Thêm mới
                </SoftBox>

                <Card sx={{ p: { xs: 2, md: 3 }, mx: 3 }}>
                    <Box display="flex" flexDirection="row">
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "40%" }}>
                            <Box display="flex" flexDirection="column">
                                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Mã phiếu giảm giá
                                        </Box>
                                        <Input
                                            fullWidth
                                            type="text"
                                            {...register("maPhieuGiamGia")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                pl: 1,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Tên phiếu
                                        </Box>
                                        <Input
                                            fullWidth
                                            type="text"
                                            {...register("tenPhieu")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                pl: 1,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Điều kiện giảm
                                        </Box>
                                        <Input
                                            fullWidth
                                            type="number"
                                            {...register("dieuKienGiam")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                pl: 1,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Loại phiếu
                                        </Box>
                                        <Controller
                                            name="loaiPhieu"
                                            control={control}
                                            defaultValue="0"
                                            render={({ field }) => (
                                                <FormControl>
                                                    <RadioGroup
                                                        row
                                                        {...field}
                                                        name="loaiPhieu"
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value);
                                                            field.onChange(value);
                                                            setStatusLoaiPhieu(value);
                                                            setSelectedRows([]);
                                                            setPage(1);
                                                        }}
                                                        sx={{ pl: 1 }
                                                        }
                                                    >
                                                        <FormControlLabel sx={{ mr: 3 }} value={0} control={<Radio />} label="Công khai" />
                                                        <FormControlLabel value={1} control={<Radio />} label="Cá nhân" />
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </Box>
                                </Box>

                                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Giá trị
                                        </Box>
                                        <Input
                                            fullWidth
                                            {...register(statusPhieu ? "phamTramGiamGia" : "soTienGiam")}
                                            type="number"
                                            value={valueInput}
                                            onChange={changeInputValue}
                                            placeholder={statusPhieu ? "Giảm theo phần trăm" : "Giảm theo số tiền"}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                pl: 1,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Loại Giảm giá
                                        </Box>
                                        <FormControl>
                                            <RadioGroup
                                                value={statusPhieu === 0 ? "0" : "1"}
                                                onChange={handleChangeRadio}
                                                onClick={changeInput}
                                                row
                                                sx={{ pl: 1 }}
                                            >
                                                <FormControlLabel sx={{ mr: 4 }} value="0" control={<Radio />} label="Giá tiền" />
                                                <FormControlLabel value="1" control={<Radio />} label="Phần trăm" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </Box>

                                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Giảm tối đa
                                        </Box>
                                        <Input
                                            fullWidth
                                            {...register("giamToiDa")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                pl: 1,
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Số lượng
                                        </Box>
                                        <Input
                                            fullWidth
                                            type="number"
                                            {...register("soLuong")}
                                            sx={{
                                                fontWeight: 700,
                                                color: "#1769aa",
                                                background: "#f2f6fa",
                                                borderRadius: 2,
                                                pl: 1,
                                            }}
                                        />
                                    </Box>
                                </Box>

                                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                                    <Box sx={{ flex: 1, maxWidth: 210 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Ngày bắt đầu
                                        </Box>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Controller
                                                name="ngayBatDau"
                                                control={control}
                                                defaultValue={null}
                                                render={({ field }) => (
                                                    <DateTimePicker

                                                        renderInput={(props) => (
                                                            <TextField
                                                                {...props}
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontWeight: 700,
                                                                        color: "#1769aa",
                                                                        background: "#f2f6fa",
                                                                        borderRadius: 2,
                                                                        height: '56px',
                                                                        fontSize: '16px',
                                                                    },
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '16.5px 14px',
                                                                    },
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        border: 'none',
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        value={field.value}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{ flex: 1, maxWidth: 210 }}>
                                        <Box component="label" sx={{ display: "block", mb: 1, fontSize: "14px" }}>
                                            Ngày kết thúc
                                        </Box>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Controller
                                                name="ngayKetThuc"
                                                control={control}
                                                defaultValue={null}
                                                render={({ field }) => (
                                                    <DateTimePicker

                                                        renderInput={(props) => (
                                                            <TextField
                                                                {...props}
                                                                fullWidth
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        fontWeight: 700,
                                                                        color: "#1769aa",
                                                                        background: "#f2f6fa",
                                                                        borderRadius: 2,
                                                                        height: '56px',
                                                                        fontSize: '16px',
                                                                    },
                                                                    '& .MuiInputBase-input': {
                                                                        padding: '16.5px 14px',
                                                                    },
                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                        border: 'none',
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                        value={field.value}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>

                                <Box mt={2}>
                                    <Button type="submit" variant="outlined">Thêm</Button>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ width: "60%", ml: 2 }}>
                            {statusLoaiPhieu === 1 && (
                                <Card sx={{ p: { xs: 2, md: 3 } }}>
                                    <SoftBox
                                        display="flex"
                                        flexDirection={{ xs: "column", md: "row" }}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        gap={2}
                                        mb={2}
                                    >
                                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={400}>
                                            <Input
                                                fullWidth
                                                placeholder="Tìm kiếm theo tên"
                                                value={searchKH}
                                                onChange={(e) => setSearchKH(e.target.value)}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                                            search
                                                        </Icon>
                                                    </InputAdornment>
                                                }
                                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                                            />
                                        </SoftBox>

                                        {/* Hiển thị thông tin số lượng đã chọn */}
                                        <SoftBox display="flex" alignItems="center" gap={2}>
                                            <Box component="span" sx={{ fontSize: "14px", color: "#666" }}>
                                                Đã chọn: {selectedCount}/{totalCustomers}
                                            </Box>

                                            {/* Checkbox chọn trang hiện tại */}
                                            <SoftBox display="flex" alignItems="center" gap={1}>
                                                <Checkbox
                                                    checked={allChecked}
                                                    onChange={handleSelectAll}
                                                    size="small"
                                                />
                                                <Box component="span" sx={{ fontSize: "14px" }}>
                                                    Chọn trang này ({khachHangs.length})
                                                </Box>
                                            </SoftBox>

                                            {/* Nút chọn tất cả khách hàng */}
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={handleSelectAllCustomers}
                                                sx={{
                                                    textTransform: "none",
                                                    fontSize: "14px",
                                                    minWidth: "auto",
                                                    padding: "4px 8px"
                                                }}
                                            >
                                                {selectedRows.length === allKhachHang.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>

                                    <SoftBox>
                                        <Table columns={columns} rows={rows} loading={loading} />
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
                                                onClick={handleMenuOpen}
                                            >
                                                Xem {viewCount} khách hàng
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
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
                                                        Xem {n} khách hàng
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
                                                disabled={page === totalPage || totalPage === 0}
                                                onClick={() => handlePageChange(page + 1)}
                                                sx={{ color: page === totalPage ? "#bdbdbd" : "#49a3f1" }}
                                            >
                                                SAU
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>
                                </Card>
                            )}
                        </Box>
                    </Box>
                </Card>
            </SoftBox>
            <Footer />
            <ToastContainer />
        </DashboardLayout>
    )
}