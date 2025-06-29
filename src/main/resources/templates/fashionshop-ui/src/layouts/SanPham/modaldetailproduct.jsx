import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { QRCodeCanvas } from "qrcode.react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

function ProductDetailInfoModal({ open, onClose, detail }) {
    function handleDownloadQR() {
        const canvas = document.getElementById("qr-code-info-canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "ma-qr-san-pham.png";
            a.click();
        }
    }

    const infoBoxStyle = {
        bgcolor: "#f9fafc",
        borderRadius: 3,
        px: 2,
        py: 1,
        mb: 1.5,
        boxShadow: "0 2px 16px 0 #1976d225",
        border: "1px solid #e5eaf1",
        minHeight: 56,
        display: "flex",
        alignItems: "center",
    };

    const labelStyle = {
        fontWeight: 700,
        color: "#4a5a7b",
        fontSize: 15,
        mb: 0.5,
        letterSpacing: 0.2,
    };

    const chipStyle = {
        fontWeight: 700,
        fontSize: 15,
        px: 1.5,
        py: 1,
        letterSpacing: 0.4,
        bgcolor: "#e6f0fb",
        color: "#1976d2",
        borderRadius: 2,
        boxShadow: "0 1px 4px 0 #1976d211",
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 5,
                        p: 0,
                        bgcolor: "#f6faff",
                        boxShadow: "0 8px 32px 0 #1976d255",
                        overflow: "visible"
                    }
                }}>
            <Box sx={{ position: "absolute", right: 16, top: 18, zIndex: 1 }}>
                <IconButton onClick={onClose} size="large" sx={{
                    background: "#fff",
                    boxShadow: "0 1px 6px #1976d222",
                    "&:hover": { background: "#f3f6fd" }
                }}>
                    <CloseIcon fontSize="large" />
                </IconButton>
            </Box>
            <DialogTitle
                sx={{
                    fontWeight: 900,
                    fontSize: 32,
                    color: "#1565c0",
                    mb: 2,
                    letterSpacing: 1,
                    textShadow: "0 2px 10px #1976d244"
                }}
            >
                Thông tin sản phẩm chi tiết
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Thương hiệu</Typography>
                                    <Chip label={detail?.tenThuongHieu || "--"} color="primary" variant="outlined" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Chất liệu</Typography>
                                    <Chip label={detail?.tenChatLieu || "--"} color="primary" variant="outlined" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Cổ áo</Typography>
                                    <Chip label={detail?.tenCoAo || "--"} color="primary" variant="outlined" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Tay áo</Typography>
                                    <Chip label={detail?.tenTayAo || "--"} color="primary" variant="outlined" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Màu sắc</Typography>
                                    <Chip label={detail?.tenMauSac || "--"} color="primary" variant="outlined" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Kích cỡ</Typography>
                                    <Chip label={detail?.tenKichThuoc || "--"} color="primary" variant="outlined" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ ...infoBoxStyle, minHeight: 92, flexDirection: "column", alignItems: "flex-start", bgcolor: "#e9f4fb" }}>
                                <Typography sx={{ ...labelStyle, color: "#1976d2", fontSize: 16, fontWeight: 800, mb: 1 }}>
                                    Hình ảnh sản phẩm
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                                    {detail?.hinhAnh && Array.isArray(detail.hinhAnh) && detail.hinhAnh.length > 0 ? (
                                        <Box display="flex" gap={1}>
                                            {detail.hinhAnh.map((img, idx) => (
                                                <Avatar
                                                    key={idx}
                                                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        border: idx === 0 ? "2.5px solid #1976d2" : "1.5px solid #b0bec5",
                                                        boxShadow: idx === 0 ? "0 2px 8px #1976d288" : "none",
                                                        transition: "all 0.25s"
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                border: "2px dashed #4acbf2",
                                                borderRadius: 3,
                                                width: 70,
                                                height: 70,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#bbb",
                                                background: "#f7fbfd"
                                            }}
                                        >
                                            Không có ảnh
                                        </Box>
                                    )}
                                </Box>
                                <Typography fontSize={13} color="#888" mt={1.5}>
                                    Ảnh đầu tiên là ảnh đại diện.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Giá (đ)</Typography>
                                    <Chip label={detail?.gia !== undefined ? detail.gia.toLocaleString("vi-VN") + " ₫" : "--"} color="info" sx={{ ...chipStyle, color: "#009556", bgcolor: "#e6fbe6" }} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Số lượng</Typography>
                                    <Chip label={detail?.soLuong !== undefined ? detail.soLuong : "--"} color="info" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Trọng lượng (g)</Typography>
                                    <Chip label={detail?.trongLuong !== undefined ? detail.trongLuong : "--"} color="info" sx={chipStyle} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2} alignItems="center" mt={1}>
                        <Grid item xs={12} md={3}>
                            <Box sx={infoBoxStyle}>
                                <Box>
                                    <Typography sx={labelStyle}>Trạng thái</Typography>
                                    <Chip
                                        label={
                                            detail?.trangThai === 1 || detail?.trangThai === "Đang bán"
                                                ? "Đang bán"
                                                : detail?.trangThai === 0 || detail?.trangThai === "Ngừng bán"
                                                    ? "Ngừng bán"
                                                    : "--"
                                        }
                                        color={detail?.trangThai === 1 || detail?.trangThai === "Đang bán" ? "success" : "default"}
                                        sx={{
                                            ...chipStyle,
                                            color: detail?.trangThai === 1 || detail?.trangThai === "Đang bán" ? "#219653" : "#888",
                                            bgcolor: detail?.trangThai === 1 || detail?.trangThai === "Đang bán" ? "#e6fbe6" : "#f2f2f2"
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ ...infoBoxStyle, flexDirection: "column", alignItems: "flex-start", minHeight: 110 }}>
                                <Typography sx={labelStyle} mb={1}>
                                    Mã QR
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                        sx={{
                                            border: "2.5px solid #fff",
                                            borderRadius: 2,
                                            p: 0.5,
                                            background: "#fff",
                                            boxShadow: "0 2px 10px #1976d244",
                                            display: "inline-flex",
                                        }}
                                    >
                                        <QRCodeCanvas
                                            id="qr-code-info-canvas"
                                            value={detail?.maSanPhamChiTiet || "QR"}
                                            size={80}
                                            level="H"
                                            includeMargin={false}
                                            style={{ background: "#fff" }}
                                        />
                                    </Box>
                                    <IconButton color="primary" onClick={handleDownloadQR} sx={{
                                        border: "2px solid #1976d2",
                                        bgcolor: "#e3f2fd",
                                        ml: 1,
                                        "&:hover": { bgcolor: "#bbdefb" }
                                    }}>
                                        <DownloadIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pr: 3.5, pb: 2.5, bgcolor: "#f6faff" }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        minWidth: 130,
                        fontWeight: 800,
                        fontSize: 20,
                        boxShadow: "0px 4px 18px #1976d244",
                        background: "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                        color: "#fff",
                        borderRadius: 30,
                        letterSpacing: 1
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ProductDetailInfoModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    detail: PropTypes.shape({
        tenThuongHieu: PropTypes.string,
        tenChatLieu: PropTypes.string,
        tenCoAo: PropTypes.string,
        tenTayAo: PropTypes.string,
        tenMauSac: PropTypes.string,
        tenKichThuoc: PropTypes.string,
        hinhAnh: PropTypes.array,
        gia: PropTypes.number,
        soLuong: PropTypes.number,
        trongLuong: PropTypes.number,
        trangThai: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maSanPhamChiTiet: PropTypes.string
    })
};

export default ProductDetailInfoModal;