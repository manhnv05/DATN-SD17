// src/components/LoadingOverlay.jsx
import React from "react";
import PropTypes from "prop-types";
import { Backdrop, CircularProgress, Typography, Stack } from "@mui/material";

const LoadingOverlay = ({ open, message = "Đang xử lí vui lòng đợi trong giây lát ..." }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        // Thêm hiệu ứng mờ cho nền phía sau
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
      }}
      open={open}
    >
      {/* Sử dụng Stack để căn giữa và tạo khoảng cách */}
      <Stack gap={2} alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="h6">{message}</Typography>
      </Stack>
    </Backdrop>
  );
};

LoadingOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  // Thêm prop 'message' để component linh hoạt hơn
  message: PropTypes.string,
};

export default LoadingOverlay;