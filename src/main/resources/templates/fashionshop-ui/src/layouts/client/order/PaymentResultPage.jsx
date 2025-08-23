import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography, CircularProgress, Stack, Paper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function PaymentResultPage() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("checking"); // "checking" | "success" | "fail"

    useEffect(() => {
        fetch("http://localhost:8080/api/vnpay/vnpay-payment" + window.location.search)
            .then(res => res.text())
            .then(data => {
                if (data === "ordersuccess") {
                    setStatus("success");
                    toast.success("Thanh toán thành công!");
                    setTimeout(() => navigate("/home"), 2000);
                } else {
                    setStatus("fail");
                    toast.error("Thanh toán thất bại!");
                    setTimeout(() => navigate("/home"), 2500);
                }
            })
            .catch(() => {
                setStatus("fail");
                toast.error("Có lỗi khi kiểm tra kết quả thanh toán!");
                setTimeout(() => navigate("/home"), 2500);
            });
    }, [navigate]);

    return (
        <Box
            minHeight="80vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f9fafb"
        >
            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    borderRadius: 4,
                    minWidth: 340,
                    maxWidth: "90vw",
                    textAlign: "center",
                }}
            >
                <Stack spacing={2} alignItems="center">
                    {status === "checking" && (
                        <>
                            <CircularProgress color="primary" size={60} />
                            <Typography variant="h5" fontWeight={700}>
                                Đang kiểm tra trạng thái thanh toán...
                            </Typography>
                            <Typography color="text.secondary">
                                Vui lòng chờ trong giây lát.
                            </Typography>
                        </>
                    )}
                    {status === "success" && (
                        <>
                            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 72 }} />
                            <Typography variant="h4" color="success.main" fontWeight={800}>
                                Thanh toán thành công!
                            </Typography>
                            <Typography color="text.secondary">
                                Cảm ơn bạn đã mua hàng. Đang chuyển về trang chủ...
                            </Typography>
                        </>
                    )}
                    {status === "fail" && (
                        <>
                            <ErrorOutlineIcon color="error" sx={{ fontSize: 72 }} />
                            <Typography variant="h4" color="error.main" fontWeight={800}>
                                Thanh toán thất bại!
                            </Typography>
                            <Typography color="text.secondary">
                                Có lỗi xảy ra hoặc giao dịch bị huỷ.<br />
                                Đang chuyển về trang chủ...
                            </Typography>
                        </>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}