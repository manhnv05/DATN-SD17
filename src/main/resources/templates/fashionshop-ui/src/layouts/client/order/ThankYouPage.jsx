import React from "react";
import { Box, Typography, Button, Paper, Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Header from "../components/header"; 
import Footer from "../components/footer";
export default function ThankYouPage() {
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        navigate("/home"); // Điều hướng về trang chủ hoặc trang cửa hàng
    };

    return (
         <>
       <Header />
        <Box
            sx={{
                display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // THAY ĐỔI QUAN TRỌNG Ở ĐÂY
                    minHeight: 'calc(1vh - 140px)',
                    maxWidth: '100%', // Lấy 100% chiều cao màn hình trừ đi chiều cao của Header & Footer
                    backgroundColor: '#f4f6f8',
                    p: 3,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 4,
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
                }}
            >
           <CheckCircleOutlineIcon sx={{ width: 150, height: 150, color: 'success.main', mb: 2 }} />


                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#29b6f6'
                    }}
                >
                  Đặt hàng thành công!
                </Typography>

                <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ mb: 4 }}
                >
                    Cảm ơn bạn đã mua hàng!
                </Typography>

                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ mb: 4 }}
                >
                    Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất. 
                    Bạn có thể theo dõi trạng thái đơn hàng trong trang tài khoản hoặc phần tra cứu đơn hàng.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinueShopping}
                    sx={{
     backgroundColor: "#4fc3f7",
    
    // 2. Cập nhật màu bóng đổ theo màu nền mới (RGB của #4fc3f7 là 79, 195, 247)
    boxShadow: "0 2px 10px 0 rgba(79, 195, 247, 0.25)",
    
    // 3. Đảm bảo chữ luôn màu trắng (quan trọng vì nền nhạt hơn)
    color: "#fff", 
    fontWeight: 800,
    borderRadius: 3,
    px: 3.5,
    fontSize: 16.5,
    transition: "all 0.3s ease-in-out",
    // 2. Định nghĩa các thay đổi khi hover
    "&:hover": {

       backgroundColor: "#e3f2fd", // light blue A100 (MUI)
     backgroundColor: "#29b6f6", 
       // Giữ chữ trắng khi hover
      // Nâng nút lên một chút
      transform: "translateY(-3px)",
      
      // Tăng độ đậm và lan tỏa của bóng
      boxShadow: "0 4px 14px 0 rgba(151, 131, 240, 0.35)",
      
      // (Tùy chọn) Làm màu nền đậm hơn một chút
    
    },
    
    // --- KẾT THÚC CODE MỚI ---
  }}
                >
                    Tiếp tục mua sắm
                </Button>
            </Paper>
        </Box>

            <Footer />
        </>
    );
}