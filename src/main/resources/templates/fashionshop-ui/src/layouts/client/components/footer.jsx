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
import { Send, Facebook, Instagram } from "@mui/icons-material";

export default function Footer() {
    return (
        <Box sx={{
            bgcolor: "linear-gradient(180deg, #fafbfc 60%, #f2ede8 100%)",
            pt: 6,
            borderTop: "1px solid #eee"
        }}>
            {/* Newsletter */}
            <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, sm: 2 } }}>
                <Paper
                    elevation={6}
                    sx={{
                        maxWidth: 800,
                        mx: "auto",
                        mb: 5,
                        py: 2.2,
                        px: { xs: 2, sm: 4 },
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 4,
                        border: "1.5px solid #ffe5b4",
                        background: "linear-gradient(90deg, #fffbe6 0%, #ffe6fa 100%)",
                        boxShadow: "0 5px 18px 0 rgba(255,214,82,0.09)",
                        position: "relative",
                    }}
                >
                    <Send sx={{ mx: 1, color: "#ff6600", fontSize: 30 }} />
                    <InputBase
                        placeholder="Nhận khuyến mãi"
                        sx={{
                            flex: 1,
                            fontSize: 16,
                            px: 1.1,
                            background: "#fff",
                            borderRadius: 2,
                            mr: 1.5,
                            border: "1px solid #ffe2b7"
                        }}
                    />
                    <InputBase
                        placeholder="Nhập email của bạn"
                        sx={{
                            flex: 2,
                            pl: 1.5,
                            fontSize: 16,
                            background: "#fff",
                            borderRadius: 2,
                            mr: 1.5,
                            border: "1px solid #ffe2b7"
                        }}
                    />
                    <IconButton sx={{
                        color: "#fff",
                        bgcolor: "#ffa000",
                        borderRadius: 2,
                        ml: 1,
                        px: 2.3,
                        py: 1.1,
                        fontWeight: 700,
                        fontSize: 17,
                        boxShadow: "0 2px 8px 0 rgba(255,160,0,0.13)",
                        "&:hover": { bgcolor: "#ffbe48" }
                    }}>
                        <Send fontSize="small" />
                    </IconButton>
                </Paper>
            </Box>

            {/* Main Footer Content */}
            <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, sm: 2 }, pb: 3 }}>
                <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">
                    {/* About Us */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 2, color: "#222", letterSpacing: 1.1, fontSize: 18 }}>
                            VỀ CHÚNG TÔI
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.2 }}>
                            <img
                                src="https://i.imgur.com/9l6gT9e.png"
                                alt="SWE Logo"
                                style={{
                                    width: 54, height: 54, borderRadius: 14, objectFit: "cover",
                                    boxShadow: "0 2px 10px 0 #ffe60044"
                                }}
                            />
                            <Typography variant="body1" color="#222" sx={{ fontWeight: 900, fontSize: 19 }}>
                                SWE - Street Wear Easy
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="#666" sx={{ fontSize: 15.5, lineHeight: 1.7, mb: 1 }}>
                            Được thành lập cuối 2016, truyền cảm hứng thời trang đường phố cho giới trẻ Việt Nam.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#ff6600", fontWeight: 700, fontSize: 15.5, mb: 2 }}>
                            &quot;Truyền cảm hứng và mission&quot;
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <MuiLink
                                href="https://facebook.com/streetweareasy"
                                underline="hover"
                                color="#1976d2"
                                fontSize={16}
                                sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Facebook sx={{ fontSize: 20, mr: 1 }} /> Facebook
                            </MuiLink>
                            <MuiLink
                                href="https://instagram.com"
                                underline="hover"
                                color="#d6249f"
                                fontSize={16}
                                sx={{ display: "flex", alignItems: "center", fontWeight: 700 }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram sx={{ fontSize: 20, mr: 1 }} /> Instagram
                            </MuiLink>
                        </Stack>
                    </Grid>
                    {/* Policies */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 2, color: "#222", fontSize: 18 }}>
                            CHÍNH SÁCH
                        </Typography>
                        <Stack spacing={1}>
                            <MuiLink href="#" color="#555" underline="hover" fontSize={15}>Chính sách bảo mật</MuiLink>
                            <MuiLink href="#" color="#555" underline="hover" fontSize={15}>Hướng dẫn mua</MuiLink>
                            <MuiLink href="#" color="#555" underline="hover" fontSize={15}>Phương thức thanh toán</MuiLink>
                            <MuiLink href="#" color="#555" underline="hover" fontSize={15}>Chính sách giao hàng</MuiLink>
                            <MuiLink href="#" color="#555" underline="hover" fontSize={15}>Chính sách đổi trả</MuiLink>
                        </Stack>
                    </Grid>
                    {/* Store Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 2, color: "#222", fontSize: 18 }}>
                            HỆ THỐNG CỬA HÀNG
                        </Typography>
                        <Stack spacing={0.5} fontSize={15.5} color="#555">
                            <Typography component="div" sx={{ fontWeight: 700, color: "#111" }}>Store 1: <span style={{ fontWeight: 400, color: "#555" }}>144 Trần Quang Diệu, Q3</span></Typography>
                            <Typography component="div" sx={{ fontWeight: 700, color: "#111" }}>Store 2: <span style={{ fontWeight: 400, color: "#555" }}>TNLT Lý Tự Trọng, Q1</span></Typography>
                            <Typography component="div" sx={{ color: "#bbb" }}>Store 3: Coming Soon</Typography>
                            <Typography component="div">
                                Đại lý: Hàng Sỉ N4, Tổ 9, Hoàng Công Chất, P. Mường Thanh, TP. Điện Biên
                            </Typography>
                            <Typography component="div" sx={{ fontWeight: 700, color: "#ff6600", mt: 1 }}>
                                0357 420 420
                            </Typography>
                            <MuiLink href="mailto:streetweareasy@gmail.com" color="#1976d2" underline="hover" fontSize={15}>
                                streetweareasy@gmail.com
                            </MuiLink>
                        </Stack>
                    </Grid>
                    {/* Fanpage */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 2, color: "#222", fontSize: 18 }}>
                            FANPAGE
                        </Typography>
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: 180,
                                height: 95,
                                bgcolor: "#dedede",
                                borderRadius: 3,
                                overflow: "hidden",
                                mb: 1.2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 1px 8px 0 #ffe60022"
                            }}
                        >
                            <img
                                src="https://scontent.xx.fbcdn.net/v/t1.15752-9/434090986_1849507995509672_5221086778541462272_n.png?stp=dst-png_s261x260&_nc_cat=109&ccb=1-7&_nc_sid=510075&_nc_ohc=DYXz2b4J9hsAX9k6m5N&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQYb3IYw4vflGdKZx1e7J4Z6HkXk3nWpJzQwId2U2yFWA&oe=6502A2B0"
                                alt="Fanpage"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                        <MuiLink
                            href="https://facebook.com/streetweareasy"
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            color="#1976d2"
                            fontSize={16}
                            sx={{ display: "flex", alignItems: "center", fontWeight: 700, mt: 2 }}
                        >
                            <Facebook fontSize="small" sx={{ mr: 0.7 }} /> Facebook SWE
                        </MuiLink>
                    </Grid>
                </Grid>
            </Box>

            {/* Copyright */}
            <Divider sx={{ mt: 5, mb: 0, borderColor: "#ffe6b3" }} />
            <Box
                sx={{
                    bgcolor: "linear-gradient(90deg, #1d2227 0%, #262626 100%)",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 15,
                    py: 1.7,
                    mt: 0,
                    position: "relative",
                    letterSpacing: 0.2,
                    fontWeight: 500,
                    boxShadow: "0 -2px 8px 0 #ff660022"
                }}
            >
                Copyright &copy; 2025
                <span style={{ color: "#ffe600", fontWeight: 800, marginLeft: 8, marginRight: 4 }}>
                    SWE (STREETWEAREASY)
                </span>
                . Powered by Hanxan.
                <Box
                    sx={{
                        position: "absolute",
                        right: { xs: 11, md: 37 },
                        bottom: 13,
                    }}
                >
                    {/* Chat Icon/Button */}
                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "50%",
                            bgcolor: "#ff6600",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 2px 12px rgba(255,102,0,0.18)",
                            cursor: "pointer",
                            transition: "background 0.2s",
                            "&:hover": { bgcolor: "#fa7a1b" }
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