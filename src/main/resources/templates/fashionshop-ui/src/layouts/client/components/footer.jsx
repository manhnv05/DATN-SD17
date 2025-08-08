import React from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    InputBase,
    IconButton,
    Stack,
    Divider,
    Link as MuiLink,
} from "@mui/material";
import { Send, Facebook, Instagram, LocationOn, Phone } from "@mui/icons-material";

export default function Footer() {
    return (
        <Box sx={{
            bgcolor: "#f6fafc",
            pt: 6,
            borderTop: "1px solid #e0eaf3"
        }}>
            {/* Newsletter */}
            <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 1, sm: 2 } }}>
                <Paper
                    elevation={1}
                    sx={{
                        maxWidth: 660,
                        mx: "auto",
                        mb: 6,
                        py: 2.2,
                        px: { xs: 2, sm: 4 },
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 3,
                        border: "1.5px solid #bde0fe",
                        background: "#e9f5fc",
                        boxShadow: "0 2px 10px 0 #1769aa12",
                        position: "relative",
                    }}
                >
                    <Send sx={{ mx: 1, color: "#1976d2", fontSize: 22 }} />
                    <InputBase
                        placeholder="Nhận khuyến mãi"
                        sx={{
                            flex: 1.2,
                            fontSize: 15,
                            px: 1.1,
                            background: "#fff",
                            borderRadius: 2,
                            mr: 1.5,
                            border: "1px solid #e3f0fa",
                            color: "#1976d2"
                        }}
                    />
                    <InputBase
                        placeholder="Nhập email của bạn"
                        sx={{
                            flex: 2,
                            pl: 1.5,
                            fontSize: 15,
                            background: "#fff",
                            borderRadius: 2,
                            mr: 1.5,
                            border: "1px solid #e3f0fa",
                            color: "#1976d2"
                        }}
                    />
                    <IconButton sx={{
                        color: "#fff",
                        bgcolor: "#1976d2",
                        borderRadius: 2,
                        ml: 1,
                        px: 2,
                        py: 1,
                        fontWeight: 700,
                        fontSize: 16,
                        boxShadow: "0 2px 8px 0 rgba(25,118,210,0.11)",
                        "&:hover": { bgcolor: "#125ea7" }
                    }}>
                        <Send fontSize="small" />
                    </IconButton>
                </Paper>
            </Box>

            {/* Main Footer Content */}
            <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 1, sm: 2 }, pb: 3 }}>
                <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">
                    {/* About Us */}
                    <Grid item xs={12} sm={6} md={3.3}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={900}
                                        sx={{ mb: 2, color: "#205072", letterSpacing: 1.1, fontSize: 17, textTransform: "uppercase" }}>
                                About Us
                            </Typography>
                            <Typography variant="body2" color="#205072"
                                        sx={{ fontSize: 15.2, lineHeight: 1.7, mb: 2 }}>
                                Được thành lập vào cuối năm 2016 trong bối cảnh thị trường streetstyle dành riêng nhóm nhỏ trẻ trung ở Việt Nam. Sau 8 năm mở triển, SWE - Street Wear Easy và slogan &quot;truyền kids with a mission&quot; đã chiếm được tình cảm của nhiều bạn trẻ yêu thích thời trang đường phố trên khắp cả nước.
                            </Typography>
                            <Stack direction="row" spacing={1.7} sx={{ mt: 1.2 }}>
                                <MuiLink
                                    href="https://facebook.com/streetweareasy"
                                    underline="hover"
                                    color="#1976d2"
                                    fontSize={15}
                                    sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Facebook sx={{ fontSize: 18, mr: 0.5 }} /> Facebook
                                </MuiLink>
                                <MuiLink
                                    href="https://instagram.com"
                                    underline="hover"
                                    color="#1769aa"
                                    fontSize={15}
                                    sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram sx={{ fontSize: 18, mr: 0.5 }} /> Instagram
                                </MuiLink>
                            </Stack>
                        </Box>
                    </Grid>
                    {/* Policies */}
                    <Grid item xs={12} sm={6} md={2.3}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={900}
                                        sx={{ mb: 2, color: "#205072", fontSize: 17, textTransform: "uppercase" }}>
                                Chính sách
                            </Typography>
                            <Stack spacing={1.1}>
                                <MuiLink href="#" color="#205072" underline="hover" fontSize={15.1}>Chính sách bảo mật</MuiLink>
                                <MuiLink href="#" color="#205072" underline="hover" fontSize={15.1}>Hướng dẫn mua</MuiLink>
                                <MuiLink href="#" color="#205072" underline="hover" fontSize={15.1}>Phương thức thanh toán</MuiLink>
                                <MuiLink href="#" color="#205072" underline="hover" fontSize={15.1}>Chính sách giao hàng</MuiLink>
                                <MuiLink href="#" color="#205072" underline="hover" fontSize={15.1}>Chính sách đổi trả</MuiLink>
                            </Stack>
                        </Box>
                    </Grid>
                    {/* Store Info */}
                    <Grid item xs={12} sm={12} md={3.8}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={900}
                                        sx={{ mb: 2, color: "#205072", fontSize: 17, textTransform: "uppercase" }}>
                                Hệ thống cửa hàng SWE
                            </Typography>
                            <Stack spacing={0.6} fontSize={15.5} color="#205072">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOn sx={{ fontSize: 16, color: "#1976d2" }} />
                                    <Typography component="span" sx={{ fontSize: 15.1, fontWeight: 400 }}>
                                        Store 1: 144 Trần Quang Diệu, Quận 3
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOn sx={{ fontSize: 16, color: "#1976d2" }} />
                                    <Typography component="span" sx={{ fontSize: 15.1, fontWeight: 400 }}>
                                        Store 2: TNLT Lý Tự Trọng, Quận 1
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOn sx={{ fontSize: 16, color: "#87bfff" }} />
                                    <Typography component="span" sx={{ fontSize: 15.1, color: "#87bfff" }}>
                                        Store 3: Coming Soon
                                    </Typography>
                                </Stack>
                                <Typography component="div" sx={{ fontSize: 15.1, mt: 1 }}>
                                    Đại lý: Hàng Sỉ N4, Tổ 9, Hoàng Công Chất, P. Mường Thanh, TP. Điện Biên
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                    <Phone sx={{ fontSize: 16, color: "#1976d2" }} />
                                    <Typography component="span" sx={{ fontSize: 15.1, fontWeight: 700 }}>
                                        0357 420 420
                                    </Typography>
                                </Stack>
                                <MuiLink href="mailto:streetweareasy@gmail.com" color="#1976d2" underline="hover" fontSize={15.1} fontWeight={700}>
                                    streetweareasy@gmail.com
                                </MuiLink>
                            </Stack>
                        </Box>
                    </Grid>
                    {/* Fanpage */}
                    <Grid item xs={12} sm={12} md={2.6}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={900}
                                        sx={{ mb: 2, color: "#205072", fontSize: 17, textTransform: "uppercase" }}>
                                Fanpage
                            </Typography>
                            <Box
                                sx={{
                                    width: "100%",
                                    maxWidth: 180,
                                    height: 95,
                                    bgcolor: "#d4eaff",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    mb: 1.5,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 1px 8px 0 #bde0fe"
                                }}
                            >
                                <img
                                    src="https://scontent.xx.fbcdn.net/v/t1.15752-9/434090986_1849507995509672_5221086778541462272_n.png?stp=dst-png_s261x260&_nc_cat=109&ccb=1-7&_nc_sid=510075&_nc_ohc=DYXz2b4J9hsAX9k6m5N&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQYb3IYw4vflGdKZx1e7J4Z6HkXk3nWpJzQwId2U2yFWA&oe=6502A2B0"
                                    alt="Fanpage"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Copyright */}
            <Divider sx={{ mt: 5, mb: 0, borderColor: "#bde0fe" }} />
            <Box
                sx={{
                    bgcolor: "#205072",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 15.2,
                    py: 1.7,
                    mt: 0,
                    position: "relative",
                    letterSpacing: 0.2,
                    fontWeight: 500,
                    boxShadow: "0 -2px 8px 0 #1769aa18"
                }}
            >
                <Box component="span" sx={{ fontWeight: 700 }}>Copyright &copy; 2025 SWE (STREETWEAREASY)</Box>. Powered by Hanxan.
                <Box
                    sx={{
                        position: "absolute",
                        right: { xs: 11, md: 37 },
                        bottom: 13,
                    }}
                >
                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "50%",
                            bgcolor: "#1976d2",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 2px 12px rgba(25,118,210,0.13)",
                            cursor: "pointer",
                            transition: "background 0.2s",
                            "&:hover": { bgcolor: "#125ea7" }
                        }}
                    >
                        <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24">
                            <path d="M12 3C7.031 3 3 6.617 3 11.012c0 2.223 1.07 4.242 2.906 5.703-.16.732-.638 2.244-1.595 3.116a.75.75 0 0 0 .797 1.24c2.049-.65 3.728-1.782 4.474-2.309A11.56 11.56 0 0 0 12 18.025c4.969 0 9-3.617 9-8.013C21 6.617 16.969 3 12 3zm0 15.025c-.699 0-1.378-.055-2.033-.159a.75.75 0 0 0-.555.125c-.537.408-1.737 1.175-3.03 1.655.387-.567.699-1.235.894-1.78a.75.75 0 0 0-.278-.867C5.236 16.176 4 13.715 4 11.012 4 7.188 7.589 4 12 4s8 3.188 8 7.012-3.589 7.013-8 7.013z" />
                        </svg>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}