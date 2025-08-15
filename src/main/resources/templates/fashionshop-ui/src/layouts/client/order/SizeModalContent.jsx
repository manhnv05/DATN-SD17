import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button, Avatar, Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    cartItem,
    SIZE_OPTIONS,
    WHITE,
    SIZE_MODAL_BTN_BG,
    SIZE_MODAL_BTN_ACTIVE_BG,
    SIZE_MODAL_BTN_BORDER,
    SIZE_MODAL_BTN_COLOR,
    SIZE_MODAL_BTN_ACTIVE_COLOR,
    SIZE_MODAL_BTN_HEIGHT
} from "./constants";

export default function SizeModalContent({ selectedSize, setSelectedSize, onClose }) {
    return (
        <Box
            sx={{
                bgcolor: WHITE,
                borderRadius: '20px',
                width: 440,
                maxWidth: "95vw",
                mx: "auto",
                mt: 7,
                p: 0,
                boxShadow: 8,
                outline: "none",
                overflow: "hidden",
                minHeight: "520px",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", borderBottom: "1px solid #f0f1ee", p: 2, pb: 1.5 }}>
                <IconButton size="small" sx={{ mr: 1, bgcolor: "#f5f7f2", borderRadius: 2 }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ fontWeight: 700, flex: 1, textAlign: "center", fontSize: 18, color: "#23351e" }}>
                    Chọn phân loại
                </Typography>
                <Box width={36} />
            </Box>
            <Box sx={{ p: 3, pt: 2, pb: 2, display: "flex", alignItems: "center", borderBottom: "1px solid #f0f1ee" }}>
                <Avatar
                    src={cartItem.img}
                    alt={cartItem.name}
                    variant="rounded"
                    sx={{ width: 64, height: 64, borderRadius: 2, flexShrink: 0, mr: 2 }}
                />
                <Typography fontWeight={700} fontSize={20} color="#23351e">
                    {cartItem.price.toLocaleString()}₫
                </Typography>
            </Box>
            <Box sx={{ p: 3, pt: 2, bgcolor: "#fafbfa", borderBottom: "1px solid #f0f1ee" }}>
                <Typography fontWeight={600} fontSize={16} sx={{ mb: 2 }} color="#23351e">
                    Kích thước
                </Typography>
                <Stack direction="row" spacing={2}>
                    {SIZE_OPTIONS.map((size) => (
                        <Button
                            key={size}
                            variant="outlined"
                            sx={{
                                minWidth: 56,
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: 15,
                                bgcolor: selectedSize === size ? SIZE_MODAL_BTN_ACTIVE_BG : SIZE_MODAL_BTN_BG,
                                borderColor: selectedSize === size ? SIZE_MODAL_BTN_BORDER : "#e0e0e0",
                                color: selectedSize === size ? SIZE_MODAL_BTN_ACTIVE_COLOR : SIZE_MODAL_BTN_COLOR,
                                boxShadow: "none",
                                textTransform: "none",
                                height: SIZE_MODAL_BTN_HEIGHT,
                                px: 3
                            }}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </Button>
                    ))}
                </Stack>
            </Box>
            <Box sx={{ flex: 1, bgcolor: "#f3f4f3" }} />
            <Box sx={{ p: 2.5, bgcolor: "#f3f4f3" }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        bgcolor: "#6e8c74",
                        color: "#fff",
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: 17,
                        textTransform: "none",
                        py: 1.2,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#4f6f56" }
                    }}
                >
                    Xác nhận
                </Button>
            </Box>
        </Box>
    );
}

SizeModalContent.propTypes = {
    selectedSize: PropTypes.string.isRequired,
    setSelectedSize: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};