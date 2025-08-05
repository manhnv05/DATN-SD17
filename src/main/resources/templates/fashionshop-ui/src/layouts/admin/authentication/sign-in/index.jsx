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
    InputAdornment,
} from "@mui/material";
import { Google, X, Facebook } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import CoverLayout from "../components/CoverLayout";
import curved9 from "../../../../assets/images/curved-images/backgroundlogin.jpg";

function SignIn() {
    const [rememberMe, setRememberMe] = useState(true);

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    return (
        <CoverLayout image={curved9}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{
                        textShadow: "0 3px 10px rgba(16,137,211,0.12)",
                        color: "#1089d3",
                        mb: 1,
                    }}
                >
                    Chào mừng bạn đến với Fashion Shop
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ textAlign: "center", mb: 2, maxWidth: 360 }}
                >
                    Hãy đăng nhập để khám phá những sản phẩm thời trang mới nhất!
                </Typography>
            </Box>
            <Box
                component={Paper}
                elevation={10}
                sx={{
                    maxWidth: 400,
                    mx: "auto",
                    borderRadius: 5,
                    p: 4,
                    bgcolor: "#fff",
                    boxShadow: "0 12px 32px -8px rgba(16,137,211,0.15)",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={900}
                    color="#1089d3"
                    align="center"
                    gutterBottom
                >
                    Đăng Nhập
                </Typography>
                <Box component="form" mt={2}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5, ml: 0.5 }}>
                        Email
                    </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        placeholder="Nhập email..."
                        name="email"
                        type="email"
                        variant="outlined"
                        autoComplete="username"
                        InputProps={{
                            sx: {
                                borderRadius: 3,
                                bgcolor: "#f7fbff",
                                fontSize: 16,
                                boxShadow: "0 2px 8px -5px #cff0ff",
                            },
                        }}
                    />
                    <Typography variant="subtitle2" sx={{ mb: 0.5, mt: 2, ml: 0.5 }}>
                        Mật khẩu
                    </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        placeholder="Nhập mật khẩu..."
                        name="password"
                        type="password"
                        variant="outlined"
                        autoComplete="current-password"
                        InputProps={{
                            sx: {
                                borderRadius: 3,
                                bgcolor: "#f7fbff",
                                fontSize: 16,
                                boxShadow: "0 2px 8px -5px #cff0ff",
                            },
                        }}
                    />
                    <Box display="flex" alignItems="center" mt={1} mb={2}>
                        <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                        <Typography
                            variant="body2"
                            sx={{ cursor: "pointer", userSelect: "none" }}
                            onClick={handleSetRememberMe}
                        >
                            &nbsp;&nbsp;Ghi nhớ đăng nhập
                        </Typography>
                        <Box flexGrow={1} />
                        <MuiLink
                            component={RouterLink}
                            to="/forgot-password"
                            underline="hover"
                            sx={{ fontSize: 13, color: "#0099ff", fontWeight: 500 }}
                        >
                            Quên mật khẩu?
                        </MuiLink>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 2,
                            mb: 1.8,
                            py: 1.3,
                            fontWeight: "bold",
                            borderRadius: 3,
                            fontSize: 18,
                            background:
                                "linear-gradient(45deg, #1089d3 0%, #12b1d1 100%)",
                            boxShadow: "0px 20px 10px -15px rgba(133,189,215,0.15)",
                            color: "#fff",
                            textTransform: "none",
                            transition: "all 0.2s",
                            "&:hover": {
                                transform: "scale(1.03)",
                                background:
                                    "linear-gradient(45deg, #12b1d1 0%, #1089d3 100%)",
                                boxShadow: "0px 23px 10px -20px rgba(133,189,215,0.17)",
                            },
                            "&:active": {
                                transform: "scale(0.97)",
                                boxShadow:
                                    "0px 15px 10px -10px rgba(133,189,215,0.13)",
                            },
                        }}
                    >
                        Đăng Nhập
                    </Button>
                </Box>
                <Divider sx={{ my: 3, fontSize: 13, color: "#666" }}>
                    Hoặc đăng nhập bằng
                </Divider>
                <Box display="flex" justifyContent="center" gap={2} mb={1}>
                    <IconButton
                        sx={{
                            background: "linear-gradient(45deg, #fff 0%, #eee 100%)",
                            boxShadow: "0px 8px 16px -8px #cde8f6",
                            borderRadius: "50%",
                            width: 46,
                            height: 46,
                            border: "4px solid #fff",
                            transition: "all 0.18s",
                            "&:hover": {
                                transform: "scale(1.13)",
                                background: "#f4f7fb",
                            },
                        }}
                    >
                        <Google style={{ color: "#EA4335", fontSize: 26 }} />
                    </IconButton>
                    <IconButton
                        sx={{
                            background: "linear-gradient(45deg, #1877f3 0%, #0052b1 100%)",
                            boxShadow: "0px 8px 16px -8px #cde8f6",
                            borderRadius: "50%",
                            width: 46,
                            height: 46,
                            border: "4px solid #fff",
                            transition: "all 0.18s",
                            "&:hover": {
                                transform: "scale(1.13)",
                                background: "#1453b0",
                            },
                        }}
                    >
                        <Facebook style={{ color: "#fff", fontSize: 26 }} />
                    </IconButton>
                    <IconButton
                        sx={{
                            background: "linear-gradient(45deg, #000 0%, #444 100%)",
                            boxShadow: "0px 8px 16px -8px #cde8f6",
                            borderRadius: "50%",
                            width: 46,
                            height: 46,
                            border: "4px solid #fff",
                            transition: "all 0.18s",
                            "&:hover": {
                                transform: "scale(1.13)",
                                background: "#222",
                            },
                        }}
                    >
                        <X style={{ color: "#fff", fontSize: 26 }} />
                    </IconButton>
                </Box>
                <Typography align="center" sx={{ mt: 2 }}>
                    <MuiLink href="#" underline="hover" sx={{ color: "#0099ff", fontSize: 12 }}>
                        Xem điều khoản sử dụng
                    </MuiLink>
                </Typography>
                <Box textAlign="center" mt={3}>
                    <Typography variant="body2" color="#888">
                        Chưa có tài khoản?
                        <MuiLink
                            component={RouterLink}
                            to="/authentication/sign-up"
                            sx={{
                                color: "#1091d3",
                                fontWeight: 600,
                                fontSize: 15,
                                textDecoration: "none",
                                ml: 0.5,
                            }}
                        >
                            Đăng ký ngay
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
        </CoverLayout>
    );
}

export default SignIn;