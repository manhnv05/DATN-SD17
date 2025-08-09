import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const ProductSlideshow = ({ product }) => {
  const images =
    product.listUrlImage && product.listUrlImage.length > 0
      ? product.listUrlImage
      : ["https://dummyimage.com/600x600/cccccc/000000&text=N/A"];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh mỗi 3 giây (tăng thời gian để người dùng kịp xem)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3000ms = 3 giây

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    // Container chính xác định tỷ lệ khung hình
    <Box
      sx={{
        width: "100%",
        aspectRatio: "1 / 1", // Giữ tỷ lệ 1:1 (hình vuông)
        overflow: "hidden",
        position: "relative", // Cần thiết để ảnh con định vị đúng
        borderRadius: "8px", // Bo góc cho container
      }}
    >
      <Box
        component="img"
        src={images[currentIndex]}
        alt={product.tenSanPham}
        sx={{
          // Ảnh sẽ lấp đầy container
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover", // Đảm bảo ảnh lấp đầy mà không bị méo
          transition: "opacity 0.5s ease-in-out", // Giữ hiệu ứng chuyển ảnh
        }}
      />
    </Box>
  );
};

ProductSlideshow.propTypes = {
  product: PropTypes.shape({
    listUrlImage: PropTypes.arrayOf(PropTypes.string),
    tenSanPham: PropTypes.string,
  }).isRequired,
};

export default ProductSlideshow;