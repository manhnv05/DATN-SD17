import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import NumberFormatCustom from "./NumberFormatCustom";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftButton from "components/SoftButton";
import { toast } from "react-toastify";

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

function PaymentModal({ open, onClose, totalAmount, onConfirm, hoaDonId }) {
  const [previousPayments, setPreviousPayments] = useState([]);
  const [newPayments, setNewPayments] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amount, setAmount] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [transactionCodeError, setTransactionCodeError] = useState("");
  const [change, setChange] = useState(0);

  useEffect(() => {
    const fetchPreviousPayments = async () => {
      if (!hoaDonId) {
        setPreviousPayments([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8080/chiTietThanhToan/${hoaDonId}/chi-tiet-thanh-toan`
        );
        setPreviousPayments(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử thanh toán:", error);
        setPreviousPayments([]);
      }
    };

    if (open) {
      fetchPreviousPayments();
      setNewPayments([]);
      setAmount("");
      setTransactionCode("");
      setTransactionCodeError("");
      setChange(0);
    }
  }, [open, hoaDonId]);

  const allPayments = useMemo(
    () => [...previousPayments, ...newPayments],
    [previousPayments, newPayments]
  );

  const totalPaid = useMemo(() => {
    return allPayments.reduce((sum, p) => sum + (p.soTienThanhToan || 0), 0);
  }, [allPayments]);

  const amountOwed = totalAmount - totalPaid;

  const handleAddPayment = () => {
    const paymentAmount = Number(String(amount).replace(/\./g, ""));

    if (!paymentAmount || paymentAmount <= 0) {
      toast.warn("Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    if (paymentMethod === "transfer" && !transactionCode.trim()) {
      setTransactionCodeError("Vui lòng nhập mã giao dịch.");
      return;
    }
    setTransactionCodeError("");

    const currentAmountOwed = totalAmount - totalPaid;
    if (currentAmountOwed <= 0) {
      toast.info("Hóa đơn đã được thanh toán đủ.");
      return;
    }

    let actualPayment = paymentAmount;
    let changeToReturn = 0;

    if (paymentAmount > currentAmountOwed) {
      actualPayment = currentAmountOwed;
      changeToReturn = paymentAmount - currentAmountOwed;
      toast.success(
        `Ghi nhận thanh toán ${formatCurrency(actualPayment)}. Tiền thừa: ${formatCurrency(
          changeToReturn
        )}`
      );
    }

    setChange(changeToReturn);

    const newPayment = {
      idHinhThucThanhToan: paymentMethod === "cash" ? 1 : 2,
      idHoaDon: hoaDonId,
      maGiaoDich: paymentMethod === "transfer" ? transactionCode : null,
      soTienThanhToan: actualPayment,
      trangThaiThanhToan: 1,
    };

    setNewPayments([...newPayments, newPayment]);
    setAmount("");
    setTransactionCode("");
  };

  const handleConfirm = () => {
    if (amountOwed > 0) {
      toast.error(`Còn thiếu ${formatCurrency(amountOwed)}. Vui lòng thanh toán đủ.`);
      return;
    }
    onConfirm(newPayments);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            THANH TOÁN
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Tổng tiền hàng</Typography>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {formatCurrency(totalAmount)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Tiền thiếu</Typography>
          <Typography variant="h6" color="error.main" fontWeight="bold">
            {formatCurrency(amountOwed > 0 ? amountOwed : 0)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6">Tiền thừa trả khách</Typography>
          <Typography variant="h6" color="success.main" fontWeight="bold">
            {formatCurrency(change)}
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box display="flex" gap={2} mb={2}>
            <Button
              variant="outlined"
              size="large"
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
              onClick={() => setPaymentMethod("transfer")}
            >
              Chuyển khoản
            </Button>
            <Button
              variant="outlined"
              size="large"
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
              onClick={() => setPaymentMethod("cash")}
            >
              Tiền mặt
            </Button>
          </Box>
          <Box display="flex" gap={2} alignItems="flex-start">
            <TextField
              label="Tiền khách đưa"
              value={amount}
              // --- SỬA LỖI DỨT ĐIỂM TẠI ĐÂY ---
              onChange={(newValue) => {
                // `newValue` là giá trị chuỗi được truyền trực tiếp từ NumberFormatCustom
                setAmount(newValue);
              }}
              sx={{ flexGrow: 1 }}
              autoFocus
              InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: {
                  onFocus: (event) => {
                    if (amountOwed > 0) {
                      setAmount(amountOwed.toString());
                    }
                    event.target.select();
                  },
                },
              }}
            />
            {paymentMethod === "transfer" && (
              <TextField
                label="Mã giao dịch"
                value={transactionCode}
                onChange={(e) => {
                  setTransactionCode(e.target.value);
                  if (transactionCodeError) {
                    setTransactionCodeError("");
                  }
                }}
                 sx={{ flexGrow: 1 }}
                error={!!transactionCodeError}
                helperText={transactionCodeError}
                
              />
            )}
            <SoftButton onClick={handleAddPayment} variant="outlined"
                size="medium"
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
                }}>
              Thêm
            </SoftButton>
          </Box>
        </Paper>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã giao dịch</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell align="right">Số tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Chưa có thanh toán nào
                  </TableCell>
                </TableRow>
              ) : (
                allPayments.map((p, index) => (
                  <TableRow
                    key={index}
                    sx={{ backgroundColor: newPayments.includes(p) ? "#e8f5e9" : "inherit" }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{p.maGiaoDich || "---"}</TableCell>
                    <TableCell>
                      {p.idHinhThucThanhToan === 1 || p.hinhThucThanhToan?.id === 1
                        ? "Tiền mặt"
                        : "Chuyển khoản"}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(p.soTienThanhToan)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <SoftButton
          variant="gradient"
          color="success"
          size="large"
          onClick={handleConfirm}
          fullWidth
        >
          Xác nhận thanh toán
        </SoftButton>
      </DialogActions>
    </Dialog>
  );
}

PaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  totalAmount: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  hoaDonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PaymentModal;
