import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Divider,
    Paper,
    Link as MuiLink,
    Switch,
} from "@mui/material";
import { Google, X, Facebook, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CoverLayout from "../components/CoverLayout";
import curved9 from "../../../../assets/images/curved-images/backgroundlogin.jpg";
import { signIn } from "../data/sign-in";

function SignIn() {
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Hàm xử lý đăng nhập Google
    const handleLoginGoogle = () => {
        // Thay đổi URL bên dưới thành endpoint OAuth2 trên backend của bạn nếu khác
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    // Hàm xử lý đăng nhập Facebook
    const handleLoginFacebook = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
    };

    // Hàm xử lý đăng nhập X (Twitter)
    const handleLoginX = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/twitter";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); // Reset error khi user nhập lại
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate cơ bản
        if (!formData.username.trim() || !formData.password) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            // Gửi API, username thực tế là email
            const data = await signIn({ username: formData.username, password: formData.password });

            // Không còn accessToken nữa, chỉ lưu role và username nếu cần
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);

            // Redirect hoặc navigate
            navigate("/");
        } catch (err) {
            setError("Đăng nhập thất bại! " + (err?.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <CoverLayout image={curved9}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" fontWeight={900} sx={{ color: "#1089d3", textShadow: "0 3px 10px rgba(16,137,211,0.12)", mb: 1 }}>
                    Chào mừng bạn đến với Fashion Shop
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 360, mx: "auto" }}>
                    Hãy đăng nhập để khám phá những sản phẩm thời trang mới nhất!
                </Typography>
            </Box>
            <Paper elevation={10} sx={{ maxWidth: 400, mx: "auto", borderRadius: 5, p: 4, bgcolor: "#fff", boxShadow: "0 12px 32px -8px rgba(16,137,211,0.15)" }}>
                <Typography variant="h4" fontWeight={900} color="#1089d3" align="center" gutterBottom>
                    Đăng Nhập
                </Typography>
                <Box component="form" onSubmit={handleSubmit} mt={2}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Email</Typography>
                    <TextField
                        fullWidth
                        name="username" // <-- phải là "username" để spring security nhận
                        type="email"
                        placeholder="Nhập email..."
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                        margin="dense"
                        variant="outlined"
                        InputProps={{
                            sx: {
                                borderRadius: 3,
                                bgcolor: "#f7fbff",
                                fontSize: 16,
                                boxShadow: "0 2px 8px -5px #cff0ff",
                            },
                        }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 0.5, mt: 2 }}>Mật khẩu</Typography>
                    <Box sx={{ position: "relative" }}>
                        <TextField
                            fullWidth
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu..."
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            margin="dense"
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    borderRadius: 3,
                                    bgcolor: "#f7fbff",
                                    fontSize: 16,
                                    boxShadow: "0 2px 8px -5px #cff0ff",
                                    pr: 6,
                                },
                            }}
                        />
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{
                                position: "absolute",
                                top: "50%",
                                right: 12,
                                transform: "translateY(-50%)",
                                color: "#888",
                                zIndex: 2,
                            }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>

                    <Box display="flex" alignItems="center" mt={1} mb={2}>
                        <Switch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <Typography
                            variant="body2"
                            sx={{ cursor: "pointer", userSelect: "none" }}
                            onClick={() => setRememberMe(!rememberMe)}
                        >
                            &nbsp;&nbsp;Ghi nhớ đăng nhập
                        </Typography>
                        <Box flexGrow={1} />
                        <MuiLink component={RouterLink} to="/forgot-password" underline="hover" sx={{ fontSize: 13, color: "#0099ff", fontWeight: 500 }}>
                            Quên mật khẩu?
                        </MuiLink>
                    </Box>

                    {error && (
                        <Typography color="error" sx={{ mb: 1 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{
                            mt: 2,
                            mb: 1.8,
                            py: 1.3,
                            fontWeight: "bold",
                            borderRadius: 3,
                            fontSize: 18,
                            background: "linear-gradient(45deg, #1089d3 0%, #12b1d1 100%)",
                            boxShadow: "0px 20px 10px -15px rgba(133,189,215,0.15)",
                            color: "#fff",
                            textTransform: "none",
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "scale(1.03)",
                                background: "linear-gradient(45deg, #12b1d1 0%, #1089d3 100%)",
                            },
                            "&:active": {
                                transform: "scale(0.97)",
                            },
                        }}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </Button>
                </Box>

                <Divider sx={{ my: 3, fontSize: 13, color: "#666" }}>
                    Hoặc đăng nhập bằng
                </Divider>

                <Box display="flex" justifyContent="center" gap={2} mb={1}>
                    {[
                        {
                            icon: <Google sx={{ color: "#EA4335", fontSize: 26 }} />,
                            bg: "#fff",
                            onClick: handleLoginGoogle,
                        },
                        {
                            icon: <Facebook sx={{ color: "#fff", fontSize: 26 }} />,
                            bg: "#1877f3",
                            onClick: handleLoginFacebook,
                        },
                        {
                            icon: <X sx={{ color: "#fff", fontSize: 26 }} />,
                            bg: "#000",
                            onClick: handleLoginX,
                        },
                    ].map(({ icon, bg, onClick }, index) => (
                        <IconButton
                            key={index}
                            onClick={onClick}
                            sx={{
                                background: bg,
                                boxShadow: "0px 8px 16px -8px #cde8f6",
                                borderRadius: "50%",
                                width: 46,
                                height: 46,
                                border: "4px solid #fff",
                                transition: "all 0.18s",
                                "&:hover": {
                                    transform: "scale(1.13)",
                                    background: bg === "#fff" ? "#f4f7fb" : bg,
                                },
                            }}
                        >
                            {icon}
                        </IconButton>
                    ))}
                </Box>

                <Typography align="center" sx={{ mt: 2 }}>
                    <MuiLink href="#" underline="hover" sx={{ color: "#0099ff", fontSize: 12 }}>
                        Xem điều khoản sử dụng
                    </MuiLink>
                </Typography>

                <Box textAlign="center" mt={3}>
                    <Typography variant="body2" color="#888">
                        Chưa có tài khoản?
                        <MuiLink component={RouterLink} to="/authentication/sign-up" sx={{ color: "#1091d3", fontWeight: 600, fontSize: 15, textDecoration: "none", ml: 0.5 }}>
                            Đăng ký ngay
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </CoverLayout>
    );
}

export default SignIn;