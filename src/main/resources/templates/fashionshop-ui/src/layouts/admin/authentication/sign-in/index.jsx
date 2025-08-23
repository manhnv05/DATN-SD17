import { useState } from "react";
import PropTypes from "prop-types";
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
    Modal,
    InputAdornment,
    CircularProgress,
    Alert
} from "@mui/material";
import {
    Google,
    X,
    Facebook,
    Visibility,
    VisibilityOff,
    Close,
    Email,
    Lock
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CoverLayout from "../components/CoverLayout";
import curved9 from "../../../../assets/images/curved-images/backgroundlogin.jpg";
import { signIn } from "../data/sign-in";

// Forgot Password & OTP Flow in 1 file, đầy đủ chi tiết
function ForgotPasswordFlow({ open, onClose }) {
    const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp+password
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Step 2: Nhập OTP & mật khẩu mới
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");

    // Gửi email OTP
    async function forgotPasswordApi(email) {
        const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            credentials: "include",
        });
        let data = {};
        try { data = await response.json(); } catch {}
        if (!response.ok) throw new Error(data.message || "Không gửi được email!");
        return data;
    }

    // Đổi mật khẩu với OTP
    async function resetPasswordApi({ email, code, matKhauMoi, xacNhanMatKhauMoi }) {
        const response = await fetch("http://localhost:8080/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, matKhauMoi, xacNhanMatKhauMoi }),
            credentials: "include",
        });
        let data = {};
        try { data = await response.json(); } catch {}
        if (!response.ok) throw new Error(data.message || "Đổi mật khẩu thất bại!");
        return data;
    }

    // Xử lý gửi email OTP
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!email.trim()) {
            setError("Vui lòng nhập email.");
            return;
        }
        setSending(true);
        try {
            await forgotPasswordApi(email);
            setSuccess("Vui lòng kiểm tra email để nhận mã xác nhận.");
            setTimeout(() => {
                setStep(2);
                setSuccess(""); setError(""); setSending(false);
            }, 1300);
        } catch (err) {
            setError(err?.message || "Có lỗi xảy ra.");
        } finally {
            setSending(false);
        }
    };

    // Xử lý nhập OTP + mật khẩu mới
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetError(""); setResetSuccess("");
        if (!otp.trim() || !password || !confirm) {
            setResetError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if (password.length < 6) {
            setResetError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        if (password !== confirm) {
            setResetError("Xác nhận mật khẩu không khớp.");
            return;
        }
        setResetLoading(true);
        try {
            await resetPasswordApi({ email, code: otp, matKhauMoi: password, xacNhanMatKhauMoi: confirm });
            setResetSuccess("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.");
            setTimeout(() => {
                handleClose();
            }, 1800);
        } catch (err) {
            setResetError(err?.message || "Có lỗi xảy ra.");
        } finally {
            setResetLoading(false);
        }
    };

    // Đóng & reset state
    const handleClose = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirm("");
        setError("");
        setSuccess("");
        setResetError("");
        setResetSuccess("");
        setResetLoading(false);
        setSending(false);
        setShowPassword(false);
        setShowConfirm(false);
        if (onClose) onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: 410, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={700}>
                        {step === 1 ? "Quên mật khẩu" : "Nhập mã xác nhận"}
                    </Typography>
                    <IconButton size="small" onClick={handleClose}><Close /></IconButton>
                </Box>
                {step === 1 ? (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Nhập email đã đăng ký để nhận mã xác nhận đặt lại mật khẩu.
                        </Typography>
                        <form onSubmit={handleSendEmail}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                                margin="normal"
                                disabled={sending}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, py: 1.2, fontWeight: 700, fontSize: 16, borderRadius: 2.5 }}
                                disabled={sending}
                            >
                                {sending ? <CircularProgress size={22} color="inherit" /> : "Gửi mã xác nhận"}
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Vui lòng kiểm tra email <b>{email}</b> và nhập mã xác nhận cùng mật khẩu mới.
                        </Typography>
                        <form onSubmit={handleResetPassword}>
                            <TextField
                                fullWidth
                                label="Mã xác nhận (OTP)"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                margin="normal"
                                disabled={resetLoading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu mới"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                margin="normal"
                                disabled={resetLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(v => !v)}
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Xác nhận mật khẩu mới"
                                type={showConfirm ? "text" : "password"}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                margin="normal"
                                disabled={resetLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirm(v => !v)}
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {showConfirm ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {resetError && <Alert severity="error" sx={{ mt: 1 }}>{resetError}</Alert>}
                            {resetSuccess && <Alert severity="success" sx={{ mt: 1 }}>{resetSuccess}</Alert>}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, py: 1.2, fontWeight: 700, fontSize: 16, borderRadius: 2.5 }}
                                disabled={resetLoading}
                            >
                                {resetLoading ? <CircularProgress size={22} color="inherit" /> : "Đổi mật khẩu"}
                            </Button>
                        </form>
                    </>
                )}
            </Box>
        </Modal>
    );
}

ForgotPasswordFlow.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

function SignIn() {
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [openForgot, setOpenForgot] = useState(false);
    const navigate = useNavigate();

    // Hàm xử lý đăng nhập Google
    const handleLoginGoogle = () => {
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
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.username.trim() || !formData.password) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            // Gửi API, username thực tế là email
            const data = await signIn({ username: formData.username, password: formData.password });

            // Lưu role và username
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);

            // Lưu accessToken nếu backend trả về
            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
            } else {
                localStorage.removeItem("accessToken");
            }

            // Lưu cả tên đầy đủ và email nếu backend trả về
            if (data.fullName) {
                localStorage.setItem("name", data.fullName);
            } else {
                localStorage.removeItem("name");
            }

            if (data.email) {
                localStorage.setItem("email", data.email);
            } else {
                localStorage.removeItem("email");
            }

            // Lưu id user (dùng cho giỏ hàng, phân quyền, v.v)
            if (data.id) {
                localStorage.setItem("userId", data.id);
            } else {
                localStorage.removeItem("userId");
            }

            // Lưu avatar nếu có
            if (data.avatar) {
                localStorage.setItem("avatar", data.avatar);
            } else {
                localStorage.removeItem("avatar");
            }

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
            {/* Khi bấm "Quên mật khẩu?" sẽ mở modal này */}
            <ForgotPasswordFlow open={openForgot} onClose={() => setOpenForgot(false)} />
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
                        name="username"
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
                        <MuiLink
                            component="button"
                            type="button"
                            underline="hover"
                            sx={{
                                fontSize: 13,
                                color: "#0099ff",
                                fontWeight: 500,
                                background: "none",
                                border: 0,
                                p: 0,
                                m: 0,
                                cursor: "pointer"
                            }}
                            onClick={() => setOpenForgot(true)}
                        >
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