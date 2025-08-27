import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // FIX 1: Import PropTypes
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Stack,
    Link,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from '@mui/material';
import {
    AccountCircleOutlined,
    PersonOutline,
    LocationOnOutlined,
    ListAltOutlined,
    ConfirmationNumberOutlined,
    LockOutlined,
    EditOutlined,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

import Header from "../components/header";
import Footer from "../components/footer";

import KhachHangDetail from './componentDetailKhachHang';
import AddressManager from './componentDiaChi';
import VoucherTabs from "./componentPgg";
import { toast } from 'react-toastify';
import axios from 'axios';

// --- Component Form Đổi Mật Khẩu (Nội dung chính) ---
const ChangePasswordForm = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [formData, setFormData] = useState({
        email: '', // Nếu email không cố định
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.warning("Mật khẩu mới không khớp!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/change-password', {
                email: formData.email,
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }, {
                withCredentials: true // <-- Thêm dòng này để gửi cookie, session
            });

            toast.success(response.data); // Hiển thị thông báo thành công

            setFormData({
                email: '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Nếu có các state showPassword cũng reset luôn nếu muốn
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data || 'Đổi mật khẩu thất bại');
        }
    };


    return (
        <Box
            sx={{
                width: '100%',
                p: { xs: 3, sm: 6 }, // tăng padding
            }}
        >
            <Stack spacing={2} mb={5}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Đổi mật khẩu
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                </Typography>
            </Stack>
            <form onSubmit={handleSubmit}>
                <Stack spacing={4} maxWidth="650px">
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        required
                        fullWidth
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={handleChange}
                        sx={{ '& .MuiInputBase-root': { height: 55, fontSize: '1rem' } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        name="newPassword"
                        label="Mật khẩu mới"
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleChange}
                        sx={{ '& .MuiInputBase-root': { height: 55, fontSize: '1rem' } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Nhập lại mật khẩu mới"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        sx={{ '& .MuiInputBase-root': { height: 55, fontSize: '1rem' } }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button type="submit" variant="contained" color="primary">
                        Đổi mật khẩu
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

// --- Component Placeholder cho các mục khác ---
const PlaceholderContent = ({ title }) => (
    <Box sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4">{title}</Typography>
        {/* FIX 2: Sửa lỗi unescaped-entities */}
        <Typography>Nội dung cho mục &apos;{title}&apos; sẽ được hiển thị ở đây.</Typography>
    </Box>
);

// FIX 1: Thêm prop validation cho PlaceholderContent
PlaceholderContent.propTypes = {
    title: PropTypes.string.isRequired,
};


// --- Component Sidebar ---
const Sidebar = ({ selectedItem, onSelectItem, nameUser }) => {
    const menuItems = [
        { key: 'profile', text: 'Hồ sơ', icon: <PersonOutline /> },
        { key: 'address', text: 'Địa chỉ', icon: <LocationOnOutlined /> },
        { key: 'vouchers', text: 'Phiếu giảm giá', icon: <ConfirmationNumberOutlined /> },
        { key: 'change-password', text: 'Đổi mật khẩu', icon: <LockOutlined /> },
    ];

    return (
        <Box
            sx={{
                width: { xs: '100%', md: '300px' }, // rộng hơn
                flexShrink: 0,
                borderRight: { md: '1px solid #E0E0E0' },
                py: 3
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', p: 3, gap: 2, borderBottom: '1px solid #E0E0E0' }}>
                <Avatar alt={nameUser} src="/static/images/avatar/1.jpg" sx={{ width: 60, height: 60 }} />
                <Stack>
                    <Typography fontWeight="bold" variant="h6">{nameUser}</Typography>
                    <Link href="#" underline="none" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.9rem' }}>
                        <EditOutlined sx={{ fontSize: '1rem' }} /> Sửa hồ sơ
                    </Link>
                </Stack>
            </Box>

            <List>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon><AccountCircleOutlined /></ListItemIcon>
                        <ListItemText primary="Tài khoản của tôi" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
                    </ListItemButton>
                </ListItem>
                <Box sx={{ pl: 3 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={selectedItem === item.key}
                                onClick={() => onSelectItem(item.key)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: selectedItem === item.key ? "#49a3f1" : "inherit",
                                    border: selectedItem === item.key ? "1px solid #49a3f1" : "1px solid transparent",
                                    boxShadow: "none",
                                    py: 1.5,
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#f0f6fd",
                                        color: "#1769aa",
                                        "& .MuiListItemIcon-root": {
                                            color: "#1769aa",
                                        },
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: "transparent !important", // chắc chắn bỏ màu nền mặc định
                                        color: "#49a3f1",
                                        "& .MuiListItemIcon-root": {
                                            color: "#49a3f1",
                                        },
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#f0f6fd !important", // hover khi đang selected
                                    },
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: "1rem" }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </Box>
            </List>
        </Box>
    );
};

// FIX 1: Thêm prop validation cho Sidebar
Sidebar.propTypes = {
    selectedItem: PropTypes.string.isRequired,
    onSelectItem: PropTypes.func.isRequired,
    nameUser: PropTypes.string.isRequired,
};


// --- Component Layout chính ---
const ProfileLayout = () => {
    const [selectedContent, setSelectedContent] = useState('change-password');
    const [user, setUser] = useState(null)

    const loadUser = async () => {
        const res = await fetch(`http://localhost:8080/api/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // <-- Thêm dòng này!
        });
        const result = await res.json()
        console.log(result)
        setUser(result)
    }

    useEffect(() => {
        loadUser()
    }, [])

    const renderContent = () => {
        switch (selectedContent) {
            case 'profile':
                return user ? <KhachHangDetail id={user.id} /> : <Typography>Đang tải...</Typography>;
            case 'address':
                return user ? <AddressManager customerId={user.id} /> : <Typography>Đang tải...</Typography>;
            case 'vouchers':
                return user ? <VoucherTabs idCustomer={user.id} /> : <Typography>Đang tải...</Typography>;
            case 'change-password':
                return <ChangePasswordForm />;
            default:
                return <PlaceholderContent title="Chào mừng" />;
        }
    };

    return (
        <Box sx={{ bgcolor: "linear-gradient(180deg,#f9fbfc 70%,#f5f4ee 100%)" }}>
            <Header />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                {user && (<Sidebar selectedItem={selectedContent} onSelectItem={setSelectedContent} nameUser={user.tenKh} />)}
                <Box component="main" sx={{ flexGrow: 1, p: 5, backgroundColor: '#fff' }}>
                    {renderContent()}
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default ProfileLayout;