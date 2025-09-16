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
                                    href="https://facebook.com/streetweareazy"
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
                                    href="https://instagram.com/streetweareazy"
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
                                <MuiLink href="mailto:streetweareazy@gmail.com" color="#1976d2" underline="hover" fontSize={15.1} fontWeight={700}>
                                    streetweareazy@gmail.com
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
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 1px 8px 0 #bde0fe"
                                }}
                            >
                                {/* Ảnh đại diện Fanpage và nút dẫn */}
                                <Box
                                    sx={{
                                        width: 54,
                                        height: 54,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 8px #1769aa30",
                                        mb: 1,
                                    }}
                                >
                                    <img
                                        src="https://scontent.xx.fbcdn.net/v/t39.30808-6/453189382_478499491593956_2197418138307732318_n.jpg?stp=dst-jpg_p370x247_tt6&_nc_cat=1&ccb=1-7&_nc_sid=d0a8c7&_nc_ohc=Z4OYmcHf4uUQ7kNvwHq3jjw&_nc_oc=AdkeNzTdX9VpzQnuNLUvcVFh-yDVvLzL2z52880YpIO0xdoAoJfbVrqeX5Ar2eklAx4&_nc_zt=23&_nc_ht=scontent.xx&edm=AN6CN6oEAAAA&_nc_gid=ZBTa8zTBrdAuGZsaeL1awA&oh=00_AfYFRAiYFwy3VWaMC1nQqkGaGacid7s3TZtf4K4txGfZdA&oe=68C8E54A"
                                        alt="Fanpage SWE"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                </Box>
                                <Box
                                    component="a"
                                    href="https://facebook.com/streetweareazy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: "#1976d2",
                                        textDecoration: "none",
                                        bgcolor: "#fff",
                                        px: 2,
                                        py: 0.7,
                                        borderRadius: 2,
                                        boxShadow: "0 1px 6px #bde0fe70",
                                        transition: "0.2s",
                                        "&:hover": {
                                            bgcolor: "#1976d2",
                                            color: "#fff"
                                        }
                                    }}
                                >
                                    Xem Fanpage SWE
                                </Box>
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
                <Box component="span" sx={{ fontWeight: 700 }}>Copyright &copy; 2025 SWETER (FASHIONSHOP)</Box>. Powered by SD-17.
            </Box>
        </Box>
    );
}