import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

// API endpoint
const khachHangDetailAPI = "http://localhost:8080/khachHang";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    padding: theme.spacing(4),
    position: "relative",
    overflow: "visible",
    width: "100%",
    maxWidth: "1400px", // Giới hạn chiều rộng tối đa
    margin: "0 auto", // Căn giữa
    border: "0px solid rgba(23, 105, 170, 0.1)",
    height: "auto", // Thay đổi từ 100% thành auto
    minHeight: "calc(100vh - 100px)", // Đảm bảo chiều cao tối thiểu
    [theme.breakpoints.up('md')]: {
        maxWidth: "1400px",
        padding: theme.spacing(4)
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
    borderRadius: 16,
    padding: theme.spacing(3),
    textAlign: "center",
    position: "relative",
    height: "fit-content", // Thêm để tránh stretch
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(45deg, rgba(23, 105, 170, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)",
        borderRadius: 16,
        zIndex: 0,
    },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
    background: "linear-gradient(135deg, #ffffff 0%, #fafbff 100%)",
    borderRadius: 12,
    padding: theme.spacing(2.5),
    border: "1px solid rgba(23, 105, 170, 0.08)",
    transition: "all 0.3s ease",
    height: "100%", // Đảm bảo card có chiều cao đồng đều
    display: "flex",
    flexDirection: "column",
    "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(23, 105, 170, 0.15)",
    },
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
    let isActive = false;
    if (typeof status === "number") {
        isActive = status === 1;
    } else if (typeof status === "string") {
        const st = status.trim().toLowerCase();
        isActive = st === "1" || st === "online" || st === "đang hoạt động" || st === "active";
    }
    return {
        fontWeight: 600,
        fontSize: "0.875rem",
        padding: "4px 12px",
        borderRadius: 20,
        backgroundColor: isActive
            ? "rgba(76, 175, 80, 0.1)"
            : "rgba(244, 67, 54, 0.1)",
        color: isActive
            ? theme.palette.success.main
            : theme.palette.error.main,
        border: `1px solid ${isActive
            ? theme.palette.success.main
            : theme.palette.error.main}`,
    };
});

const GenderChip = styled(Chip)(({ gender, theme }) => {
    let isMale = false;
    if (typeof gender === "number") {
        isMale = gender === 1;
    } else if (typeof gender === "string") {
        const gt = gender.trim().toLowerCase();
        isMale = gt === "nam" || gt === "male";
    }
    return {
        fontWeight: 600,
        fontSize: "0.875rem",
        padding: "4px 12px",
        borderRadius: 20,
        backgroundColor: isMale
            ? "rgba(33, 150, 243, 0.1)"
            : "rgba(233, 30, 99, 0.1)",
        color: isMale
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
        border: `1px solid ${isMale
            ? theme.palette.primary.main
            : theme.palette.secondary.main}`,
    };
});

// Utility functions
function formatDate(dateString) {
    if (!dateString) return "Chưa cập nhật";
    try {
        let parts = [];
        if (typeof dateString === 'string' && dateString.includes('-')) {
            parts = dateString.split('-');
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const day = parseInt(parts[2], 10);
                    const date = new Date(year, month, day);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                    }
                }
                if (parts[2].length === 4) {
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    const date = new Date(year, month, day);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                    }
                }
            }
        }
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        return "Chưa cập nhật";
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Chưa cập nhật";
    }
}

function getGenderLabel(gioiTinh) {
    if (gioiTinh === undefined || gioiTinh === null) return "Chưa cập nhật";
    if (typeof gioiTinh === "number") {
        return gioiTinh === 1 ? "Nam" : gioiTinh === 0 ? "Nữ" : "Khác";
    }
    const gt = gioiTinh.trim().toLowerCase();
    if (gt === "nam" || gt === "male") return "Nam";
    if (gt === "nữ" || gt === "nu" || gt === "female") return "Nữ";
    return "Khác";
}

function getStatusLabel(trangThai) {
    if (trangThai === undefined || trangThai === null) return "Chưa cập nhật";
    if (typeof trangThai === "number") {
        return trangThai === 1 ? "Online" : trangThai === 0 ? "Offline" : "Không xác định";
    }
    const st = String(trangThai).trim().toLowerCase();
    if (st === "1" || st === "online" || st === "đang hoạt động" || st === "active") return "Online";
    if (st === "0" || st === "offline" || st === "ngừng hoạt động" || st === "inactive") return "Offline";
    return "Không xác định";
}

function InfoField({ icon, label, value, color = "#1769aa" }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
                sx={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 40, height: 40,
                    borderRadius: "50%", backgroundColor: `${color}15`, color: color,
                    flexShrink: 0, // Ngăn icon bị co lại
                }}
            >
                {icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}> {/* Thêm minWidth: 0 để tránh overflow */}
                <Typography
                    variant="caption"
                    sx={{
                        color: "#666", fontSize: "0.75rem", fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.5px",
                        display: "block", // Đảm bảo xuống dòng
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: "#1a1a1a", fontSize: "0.95rem", fontWeight: 600, mt: 0.5,
                        wordWrap: "break-word", // Cho phép xuống dòng khi text quá dài
                        overflowWrap: "break-word",
                    }}
                >
                    {value || "Chưa cập nhật"}
                </Typography>
            </Box>
        </Box>
    );
}

InfoField.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    color: PropTypes.string,
};

function calculateAge(dateString) {
    if (!dateString) return null;
    let day, month, year;
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            if (parts[0].length === 4) { // yyyy-MM-dd
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                day = parseInt(parts[2], 10);
            } else if (parts[2].length === 4) { // dd-MM-yyyy
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                year = parseInt(parts[2], 10);
            }
        }
    }
    if (year && month >= 0 && day) {
        const today = new Date();
        let age = today.getFullYear() - year;
        if (
            today.getMonth() < month ||
            (today.getMonth() === month && today.getDate() < day)
        ) {
            age--;
        }
        return age;
    }
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        if (
            today.getMonth() < date.getMonth() ||
            (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
        ) {
            age--;
        }
        return age;
    }
    return null;
}

function getDiaChiFormatted(diaChis) {
    if (!Array.isArray(diaChis) || diaChis.length === 0) return "Chưa cập nhật";
    // Lấy bản ghi active nhất hoặc đầu tiên
    const dc = diaChis.find(dc => dc.trangThai === 1) || diaChis[0];
    // Xây chuỗi địa chỉ
    let arr = [];
    if (dc.soNha) arr.push(dc.soNha);
    if (dc.xaPhuong) arr.push(dc.xaPhuong);
    if (dc.quanHuyen) arr.push(dc.quanHuyen);
    if (dc.tinhThanhPho) arr.push(dc.tinhThanhPho);
    return arr.join(", ") || "Chưa cập nhật";
}

export default function KhachHangDetail({ id }) {
    const navigate = useNavigate();
    const [khachHang, setKhachHang] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchCustomerData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${khachHangDetailAPI}/${id}`, { withCredentials: true });
                await new Promise(resolve => setTimeout(resolve, 500));
                setKhachHang(response.data.data || response.data);
            } catch (err) {
                console.error("Error fetching customer data:", err);
                setError("Không thể tải thông tin khách hàng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [id]);

    const handleGoBack = () => {
        navigate("/customer-management");
    };

    const handleEdit = () => {
        navigate(`/khachhang/update/${id}`);
    };

    if (loading) {
        return (

            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box textAlign="center">
                    <CircularProgress size={60} sx={{ color: "#1769aa", mb: 2 }} />
                    <Typography variant="h6" color="#1769aa" fontWeight={600}>
                        Đang tải thông tin khách hàng...
                    </Typography>
                </Box>
            </Box>

        );
    }

    if (error) {
        return (

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box textAlign="center">
                    <Typography variant="h6" color="error" fontWeight={600} mb={2}>
                        {error}
                    </Typography>

                </Box>
            </Box>
        );
    }

    if (!khachHang) {
        return (

            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box textAlign="center">
                    <Typography variant="h6" color="error" fontWeight={600} mb={2}>
                        Không tìm thấy thông tin khách hàng
                    </Typography>
                </Box>
            </Box>

        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh", // Thay đổi từ height thành minHeight
                py: 4,
                px: { xs: 1, md: 2 }, // Thêm padding horizontal responsive
                borderRadius: "0 0 20px 20px",
            }}
        >
            <StyledCard>
                {/* Header section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 4,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "#1769aa",
                            textAlign: "center",
                            flex: 1,
                            fontSize: { xs: "1.5rem", md: "2rem" },
                            order: { xs: 3, md: 2 }, // Đặt title xuống dưới trên mobile
                            width: { xs: "100%", md: "auto" }, // Full width trên mobile
                        }}
                    >
                        Hồ Sơ
                    </Typography>

                </Box>

                {/* Content Grid */}
                <Grid container spacing={4} sx={{ alignItems: "flex-start" }}> {/* Thêm alignItems: flex-start */}
                    {/* Profile Section */}
                    <Grid item xs={12} md={4}>
                        <ProfileSection>
                            <Avatar
                                src={khachHang.hinhAnh}
                                alt={khachHang.tenKhachHang || "Khách hàng"}
                                sx={{
                                    width: { xs: 120, md: 180 }, // Responsive avatar size
                                    height: { xs: 120, md: 180 },
                                    mx: "auto",
                                    mb: 2,
                                    border: "4px solid white",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                    fontSize: { xs: "2rem", md: "3rem" },
                                    backgroundColor: "#1769aa",
                                }}
                            >
                                {khachHang.tenKhachHang ? khachHang.tenKhachHang.charAt(0).toUpperCase() : "K"}
                            </Avatar>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: "#1769aa",
                                    mb: 1,
                                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                                    wordWrap: "break-word", // Tránh text overflow
                                }}
                            >
                                {khachHang.tenKhachHang || "Chưa cập nhật"}
                            </Typography>
                            <Divider sx={{ my: 2, opacity: 0.3 }} />
                            <Box sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                                mb: 2,
                                flexWrap: "wrap", // Cho phép wrap trên mobile
                            }}>
                                <StatusChip
                                    label={getStatusLabel(khachHang.trangThai)}
                                    status={khachHang.trangThai}
                                    size="small"
                                />
                                <GenderChip
                                    label={getGenderLabel(khachHang.gioiTinh)}
                                    gender={khachHang.gioiTinh}
                                    size="small"
                                />
                            </Box>
                        </ProfileSection>
                    </Grid>

                    {/* Info Section */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3} sx={{ height: "100%" }}>
                            {/* Personal Information Card */}
                            <Grid item xs={12}>
                                <InfoCard>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#1769aa",
                                            mb: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <PersonIcon />
                                        Thông Tin Cá Nhân
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <InfoField
                                                icon={<PersonIcon />}
                                                label="Họ và tên"
                                                value={khachHang.tenKhachHang}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoField
                                                icon={<BadgeIcon />}
                                                label="Mã khách hàng"
                                                value={khachHang.maKhachHang}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoField
                                                icon={<CalendarTodayIcon />}
                                                label={
                                                    (() => {
                                                        const age = calculateAge(khachHang.ngaySinh);
                                                        return age !== null && !isNaN(age)
                                                            ? `Ngày sinh (${age} tuổi)`
                                                            : "Ngày sinh";
                                                    })()
                                                }
                                                value={formatDate(khachHang.ngaySinh)}
                                            />
                                        </Grid>
                                    </Grid>
                                </InfoCard>
                            </Grid>

                            {/* Contact Information Card */}
                            <Grid item xs={12}>
                                <InfoCard>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#1769aa",
                                            mb: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <EmailIcon />
                                        Thông Tin Liên Hệ
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <InfoField
                                                icon={<EmailIcon />}
                                                label="Email"
                                                value={khachHang.email}
                                                color="#e91e63"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InfoField
                                                icon={<PhoneIcon />}
                                                label="Số điện thoại"
                                                value={khachHang.sdt}
                                                color="#ff9800"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InfoField
                                                icon={<LocationOnIcon />}
                                                label="Địa chỉ"
                                                value={getDiaChiFormatted(khachHang.diaChis)}
                                                color="#4caf50"
                                            />
                                        </Grid>
                                    </Grid>
                                </InfoCard>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </StyledCard>
        </Box>

    );
}

KhachHangDetail.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
};