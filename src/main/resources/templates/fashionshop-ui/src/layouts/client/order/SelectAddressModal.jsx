import React from "react";
import PropTypes from "prop-types";
import {
    Modal,
    Paper,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

export default function SelectAddressModal({
    open,
    onClose,
    addresses = [],
    onSelect,
    onAddNew,
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="select-address-modal"
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Paper
                elevation={2}
                sx={{
                    width: { xs: "98vw", sm: 650 },
                    maxWidth: "98vw",
                    borderRadius: 2,
                    px: 3,
                    pt: 2.5,
                    pb: 2.5,
                    outline: "none",
                    boxShadow: "0 4px 24px #0002",
                    position: "relative"
                }}
            >
                {/* Modal Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                        id="select-address-modal"
                        fontWeight={700}
                        fontSize={22}
                        color="#365486"
                        flex={1}
                    >
                        Chọn địa chỉ giao hàng
                    </Typography>
                    <IconButton onClick={onClose} sx={{ ml: 1 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {/* Table */}
                <TableContainer sx={{ borderRadius: 2, boxShadow: "none", bgcolor: "#fafcff" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tỉnh/Thành phố</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Quận/Huyện</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Xã/Phường</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addresses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ color: "#888", py: 3 }}>
                                        Không có địa chỉ nào.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                addresses.map((addr, idx) => (
                                    <TableRow key={addr.id || idx}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>{addr.province?.ProvinceName || ""}</TableCell>
                                        <TableCell>{addr.district?.DistrictName || ""}</TableCell>
                                        <TableCell>{addr.ward?.WardName || ""}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 600,
                                                    borderColor: "#29b6f6",
                                                    color: "#1976d2",
                                                    px: 2,
                                                    minWidth: 0,
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        borderColor: "#1976d2",
                                                        color: "#0d47a1"
                                                    }
                                                }}
                                                onClick={() => onSelect && onSelect(addr)}
                                            >
                                                Chọn
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Add New Address Button */}
                <Box sx={{ mt: 2, textAlign: "left" }}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: "none",
                            color: "#1976d2",
                            borderColor: "#29b6f6",
                            px: 2,
                            "&:hover": {
                                borderColor: "#1976d2",
                                color: "#0d47a1",
                                bgcolor: "#e3f2fd"
                            }
                        }}
                        onClick={onAddNew}
                    >
                        Thêm địa chỉ mới
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
}

SelectAddressModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
    onAddNew: PropTypes.func,
};