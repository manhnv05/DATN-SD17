import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import SoftInput from "../../../../components/SoftInput";
import SoftButton from "../../../../components/SoftButton";
import BasicLayout from "../components/BasicLayout";
import Socials from "../components/Socials";
import Separator from "../components/Separator";
import curved6 from "../../../../assets/images/curved-images/backgroundsignup.jpg";
import instanceAPIMain from "../../../../configapi"; // dùng instance axios chung, nên đặt tại src/.../data/instanceAPIMain.js

function SignUp() {
  const [agreement, setAgreement] = useState(true);

  // Các state cho input
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [tenKhachHang, setTenKhachHang] = useState("");
  const [sdt, setSdt] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSetAgreement = () => setAgreement(!agreement);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate
    if (!email || !matKhau || !xacNhanMatKhau || !tenKhachHang || !sdt) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (matKhau !== xacNhanMatKhau) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!agreement) {
      setError("Bạn cần đồng ý với điều khoản và điều kiện.");
      return;
    }

    try {
      // Sử dụng instanceAPIMain để gọi API (giúp đồng bộ baseURL, CORS, credentials)
      const res = await instanceAPIMain.post("/api/auth/register", {
        email,
        matKhau,
        tenKhachHang,
        sdt,
      });
      setSuccess("Đăng ký thành công! Chuyển hướng tới trang đăng nhập...");
      setTimeout(() => navigate("/authentication/sign-in"), 1500);
    } catch (err) {
      // Nếu backend trả về message dạng object hoặc chuỗi
      let message = "Đăng ký thất bại. Vui lòng thử lại!";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          message = err.response.data;
        } else if (typeof err.response.data === "object" && err.response.data.message) {
          message = err.response.data.message;
        }
      }
      setError(message);
    }
  };

  return (
      <BasicLayout
          title="Chào mừng!"
          description="Đăng ký để bắt đầu hành trình mua sắm của bạn"
          image={curved6}
      >
        <Card>
          <SoftBox p={3} mb={1} textAlign="center">
            <SoftTypography variant="h5" fontWeight="medium">
              Đăng ký
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={2}>
            <Socials />
          </SoftBox>
          <Separator />
          <SoftBox pt={2} pb={3} px={3}>
            <SoftBox component="form" role="form" onSubmit={handleSubmit}>
              <SoftBox mb={2}>
                <label>Họ tên</label>
                <SoftInput
                    placeholder="Họ và tên"
                    value={tenKhachHang}
                    onChange={(e) => setTenKhachHang(e.target.value)}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <label>Số điện thoại</label>
                <SoftInput
                    placeholder="Số điện thoại"
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <label>Email</label>
                <SoftInput
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <label>Mật khẩu</label>
                <SoftInput
                    type="password"
                    placeholder="Mật khẩu"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                />
              </SoftBox>
              <SoftBox mb={2}>
                <label>Xác nhận mật khẩu</label>
                <SoftInput
                    type="password"
                    placeholder="Xác nhận lại mật khẩu"
                    value={xacNhanMatKhau}
                    onChange={(e) => setXacNhanMatKhau(e.target.value)}
                />
              </SoftBox>
              <SoftBox display="flex" alignItems="center">
                <Checkbox checked={agreement} onChange={handleSetAgreement} />
                <SoftTypography
                    variant="button"
                    fontWeight="regular"
                    onClick={handleSetAgreement}
                    sx={{ cursor: "pointer", userSelect: "none" }}
                >
                  Tôi đồng ý với&nbsp;
                </SoftTypography>
                <SoftTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="bold"
                    textGradient
                >
                  Điều khoản và điều kiện
                </SoftTypography>
              </SoftBox>
              {error && (
                  <SoftTypography variant="caption" color="error" fontWeight="bold">
                    {error}
                  </SoftTypography>
              )}
              {success && (
                  <SoftTypography variant="caption" color="success" fontWeight="bold">
                    {success}
                  </SoftTypography>
              )}
              <SoftBox mt={4} mb={1}>
                <SoftButton variant="gradient" color="dark" fullWidth type="submit">
                  Đăng ký
                </SoftButton>
              </SoftBox>
              <SoftBox mt={3} textAlign="center">
                <SoftTypography variant="button" color="text" fontWeight="regular">
                  Đã có tài khoản?&nbsp;
                  <SoftTypography
                      component={Link}
                      to="/authentication/sign-in"
                      variant="button"
                      color="dark"
                      fontWeight="bold"
                      textGradient
                  >
                    Đăng nhập
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Card>
      </BasicLayout>
  );
}

export default SignUp;