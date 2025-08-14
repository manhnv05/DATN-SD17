import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    TextField,
    IconButton,
    Modal,
    InputAdornment,
    CircularProgress,
    Alert
} from "@mui/material";
import { Email, Close, Visibility, VisibilityOff, Lock } from "@mui/icons-material";

// Main component: quản lý cả hai modal Forgot (gửi OTP) và Reset Password (nhập OTP)
export default function ForgotPasswordFlow({ open, onClose }) {
    // State quản lý flow
    const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp+pw
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Step 2: Nhập OTP và password mới
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");

    // API gọi forgot password
    async function forgotPasswordApi(email) {
        const resp = await fetch("http://localhost:8080/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
            credentials: "include",
        });
        let data = {};
        try { data = await resp.json(); } catch {}
        if (!resp.ok) throw new Error(data.message || "Không gửi được email!");
        return data;
    }

    // API gọi reset password
    async function resetPasswordApi({ email, code, matKhauMoi, xacNhanMatKhauMoi }) {
        const resp = await fetch("http://localhost:8080/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code, matKhauMoi, xacNhanMatKhauMoi }),
            credentials: "include",
        });
        let data = {};
        try { data = await resp.json(); } catch {}
        if (!resp.ok) throw new Error(data.message || "Đổi mật khẩu thất bại!");
        return data;
    }

    // Xử lý gửi email
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
            setSent(true);
            setTimeout(() => {
                setStep(2);
                setSuccess(""); setError(""); setSending(false);
            }, 1000);
        } catch (err) {
            setError(err?.message || "Có lỗi xảy ra.");
        } finally {
            setSending(false);
        }
    };

    // Xử lý xác nhận OTP + đổi mật khẩu
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

    // Đóng tất cả
    const handleClose = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setPassword("");
        setConfirm("");
        setError("");
        setSuccess("");
        setSent(false);
        setResetError("");
        setResetSuccess("");
        setResetLoading(false);
        setSending(false);
        setShowPassword(false);
        setShowConfirm(false);
        if (onClose) onClose();
    };

    // Modal thân thiện: giữ modal khi open=true, hiển thị step 1 hoặc 2
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