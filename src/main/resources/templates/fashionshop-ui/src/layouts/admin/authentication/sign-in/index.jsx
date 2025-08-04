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
import { Google, X, Twitter , Facebook} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import CoverLayout from "../components/CoverLayout";
import curved9 from "../../../../assets/images/curved-images/backgroundlogin.jpg";

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
      <CoverLayout image={curved9}>
          <Box sx={{ ml: 5 }}>
              <Typography variant="h3" fontWeight="bold">
                  Chào mừng bạn đến với Fashion Shop
              </Typography>
              <Typography variant="body1" color="textSecondary">
                    Hãy đăng nhập để khám phá những sản phẩm thời trang mới nhất!
              </Typography>
          </Box>
        <Box
            component={Paper}
            elevation={8}
            sx={{
              maxWidth: 380,
              mx: "auto",
              borderRadius: 5,
              p: 4,
              bgcolor: "linear-gradient(0deg, #fff 0%, #f4f7fb 100%)",
              boxShadow: "0px 30px 30px -20px rgba(133,189,215,0.88)",
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
          <Box component="form" mt={3}>
          <label style={{ marginTop: 6 }}>
            Email
          </label>
            <TextField
                fullWidth
                margin="normal"
                placeholder="E-mail"
                name="email"
                type="email"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    bgcolor: "#fff",
                    boxShadow: "0 10px 10px -5px #cff0ff",
                    fontSize: 16,
                  },
                }}
            />
            <label style={{ marginTop: 6 }}>
                Mật khẩu
            </label>
            <TextField
                fullWidth
                margin="normal"
                placeholder="Password"
                name="password"
                type="password"
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    bgcolor: "#fff",
                    boxShadow: "0 10px 10px -5px #cff0ff",
                    fontSize: 16,
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
                &nbsp;&nbsp;Remember me
              </Typography>
              <Box flexGrow={1} />
              <MuiLink
                  component={RouterLink}
                  to="/forgot-password"
                  underline="none"
                  sx={{ fontSize: 12, color: "#0099ff" }}
              >
                Quên mật khẩu?
              </MuiLink>
            </Box>
            <Button
                type="submit"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 1.5,
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: 3,
                  fontSize: 18,
                  background:
                      "linear-gradient(45deg, #1089d3 0%, #12b1d1 100%)",
                  boxShadow: "0px 20px 10px -15px rgba(133,189,215,0.88)",
                  color: "#fff",
                  textTransform: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    background:
                        "linear-gradient(45deg, #12b1d1 0%, #1089d3 100%)",
                    boxShadow: "0px 23px 10px -20px rgba(133,189,215,0.88)",
                  },
                  "&:active": {
                    transform: "scale(0.97)",
                    boxShadow:
                        "0px 15px 10px -10px rgba(133,189,215,0.88)",
                  },
                }}
            >
                Đăng Nhập
            </Button>
          </Box>
          <Divider sx={{ my: 3, fontSize: 12, color: "#0a0a0a" }}>
            Hoặc đăng nhập bằng
          </Divider>
          <Box display="flex" justifyContent="center" gap={2} mb={1}>
            <IconButton
                sx={{
                  background:
                      "linear-gradient(45deg, #fff 0%, #eee 100%)",
                  boxShadow: "0px 12px 10px -8px rgba(133,189,215,0.88)",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  border: "4px solid #fff",
                  "&:hover": {
                    transform: "scale(1.18)",
                    background: "#f4f7fb",
                  },
                }}
            >
              <Google style={{ color: "#EA4335", fontSize: 26 }} />
            </IconButton>
              <IconButton
                  sx={{
                      background: "linear-gradient(45deg, #1877f3 0%, #0052b1 100%)",
                      boxShadow: "0px 12px 10px -8px rgba(133,189,215,0.88)",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      border: "4px solid #fff",
                      "&:hover": {
                          transform: "scale(1.18)",
                          background: "#1453b0",
                      },
                  }}
              >
              <Facebook style={{ color: "#fff", fontSize: 26 }} />
            </IconButton>
              <IconButton
                  sx={{
                      background:
                          "linear-gradient(45deg, #000 0%, #444 100%)",
                      boxShadow: "0px 12px 10px -8px rgba(133,189,215,0.88)",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      border: "4px solid #fff",
                      "&:hover": {
                          transform: "scale(1.18)",
                          background: "#222",
                      },
                  }}
              >
              <X style={{ color: "#fff", fontSize: 26 }} />
            </IconButton>
          </Box>
          <Typography align="center" sx={{ mt: 2 }}>
            <MuiLink href="#" underline="none" sx={{ color: "#0099ff", fontSize: 10 }}>
              Learn user licence agreement
            </MuiLink>
          </Typography>
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="#888">
              Chưa có tài khoản?{" "}
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