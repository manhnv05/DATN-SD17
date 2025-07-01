import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

// API base config
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const apiUrl = (path) => `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

// Select style
const selectMenuStyle = {
    menu: (base) => ({
        ...base,
        borderRadius: 12,
        zIndex: 25,
        boxShadow: "0 6px 24px 0 rgba(0,0,0,0.12)",
        fontSize: 16,
    }),
    control: (base, state) => ({
        ...base,
        borderRadius: 12,
        background: state.isDisabled ? "#f4f6fb" : "#fafdff",
        fontSize: 16,
        minHeight: 44,
        borderColor: state.isFocused ? "#1976d2" : "#e3e9f0",
        boxShadow: state.isFocused ? "0 0 0 2px #1976d2" : "none",
        "&:hover": { borderColor: "#1976d2" },
        paddingLeft: 6,
        paddingRight: 6,
    }),
    singleValue: (base) => ({
        ...base,
        fontWeight: 600,
        color: "#1976d2",
    }),
    placeholder: (base) => ({
        ...base,
        color: "#a8b8c3",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "#e3f2fd"
            : state.isFocused
                ? "#f0f7fa"
                : "#fff",
        color: "#263238",
        fontWeight: state.isSelected ? 600 : 500,
        cursor: "pointer",
        fontSize: 16,
        padding: "11px 16px",
    }),
};

const trangThaiList = [
    { value: 1, label: "Đang bán" },
    { value: 0, label: "Ngừng bán" },
];

function getOptionByValue(options, value) {
    if (value === undefined || value === null || value === "") return null;
    return options.find(o => String(o.value) === String(value)) || null;
}

function ProductDetailUpdateModal({
                                      open,
                                      onClose,
                                      onUpdate,
                                      detail
                                  }) {
    const [brandOptions, setBrandOptions] = useState([]);
    const [materialOptions, setMaterialOptions] = useState([]);
    const [collarOptions, setCollarOptions] = useState([]);
    const [sleeveOptions, setSleeveOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    const [form, setForm] = useState({
        idThuongHieu: "",
        idChatLieu: "",
        idCoAo: "",
        idTayAo: "",
        idMauSac: "",
        idKichThuoc: "",
        gia: "",
        soLuong: "",
        trongLuong: "",
        trangThai: 1,
        images: [],
    });

    const [imagePreview, setImagePreview] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const qrRef = useRef();

    useEffect(() => {
        if (!open) return;
        setIsLoadingOptions(true);
        Promise.all([
            fetch(apiUrl("/thuongHieu/all")).then(res => res.json()),
            fetch(apiUrl("/chatLieu/all")).then(res => res.json()),
            fetch(apiUrl("/coAo/all")).then(res => res.json()),
            fetch(apiUrl("/tayAo/all")).then(res => res.json()),
            fetch(apiUrl("/mauSac/all")).then(res => res.json()),
            fetch(apiUrl("/kichThuoc/all")).then(res => res.json()),
        ]).then(([thuongHieu, chatLieu, coAo, tayAo, mauSac, kichThuoc]) => {
            setBrandOptions((thuongHieu || []).map(item => ({
                value: String(item.id), label: item.tenThuongHieu
            })));
            setMaterialOptions((chatLieu || []).map(item => ({
                value: String(item.id), label: item.tenChatLieu
            })));
            setCollarOptions((coAo || []).map(item => ({
                value: String(item.id), label: item.tenCoAo
            })));
            setSleeveOptions((tayAo || []).map(item => ({
                value: String(item.id), label: item.tenTayAo
            })));
            setColorOptions((mauSac || []).map(item => ({
                value: String(item.id), label: item.tenMauSac
            })));
            setSizeOptions((kichThuoc || []).map(item => ({
                value: String(item.id), label: item.tenKichCo || item.tenKichThuoc
            })));
            setIsLoadingOptions(false);
        });
    }, [open]);

    useEffect(() => {
        if (!isLoadingOptions && detail) {
            setForm({
                idThuongHieu: detail?.idThuongHieu !== undefined ? String(detail?.idThuongHieu) : "",
                idChatLieu: detail?.idChatLieu !== undefined ? String(detail?.idChatLieu) : "",
                idCoAo: detail?.idCoAo !== undefined ? String(detail?.idCoAo) : "",
                idTayAo: detail?.idTayAo !== undefined ? String(detail?.idTayAo) : "",
                idMauSac: detail?.idMauSac !== undefined ? String(detail?.idMauSac) : "",
                idKichThuoc: detail?.idKichThuoc !== undefined ? String(detail?.idKichThuoc) : "",
                gia: detail?.gia || "",
                soLuong: detail?.soLuong || "",
                trongLuong: detail?.trongLuong || "",
                trangThai: detail?.trangThai === 1 ? 1 : 0,
                images: detail?.images || [],
            });
            setImagePreview(detail?.images || []);
            setImageFiles([]);
        }
    }, [detail, isLoadingOptions]);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreview((prev) => [...prev, ...previews]);
        setImageFiles((prev) => [...prev, ...files]);
    };

    const handleImageRemove = (img) => {
        setImagePreview((prev) => prev.filter((i) => i !== img));
        setImageFiles((prev) => {
            const idx = imagePreview.indexOf(img);
            if (idx !== -1) {
                const arr = [...prev];
                arr.splice(idx, 1);
                return arr;
            }
            return prev;
        });
    };

    const handleUpdate = () => {
        onUpdate({
            ...form,
            id: detail?.id,
            images: imagePreview,
            imageFiles: imageFiles,
        });
    };

    const handleDownloadQR = () => {
        const canvas = qrRef.current.querySelector("canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `${detail?.maSanPhamChiTiet || "qr-code"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const renderSelectOrLoading = (component) =>
        isLoadingOptions ? <Box display="flex" alignItems="center" justifyContent="center" py={2}><CircularProgress size={22} color="info" /></Box> : component;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 0 } }}>
            <DialogTitle sx={{ fontWeight: 800, fontSize: 26, pb: 1.5, color: "#1976d2", letterSpacing: 0.5 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <span>Cập nhật sản phẩm chi tiết</span>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: "#eb5757",
                            ml: 2,
                            background: "#f5f6fa",
                            "&:hover": { background: "#ffeaea" }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <Divider sx={{ mb: 1 }} />
            <DialogContent dividers sx={{ background: "#f7fbff", pb: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Thương hiệu <span style={{color:"#e74c3c"}}>*</span></Typography>
                                {renderSelectOrLoading(
                                    <CreatableSelect
                                        options={brandOptions}
                                        value={getOptionByValue(brandOptions, form.idThuongHieu)}
                                        onChange={opt => handleChange("idThuongHieu", opt ? opt.value : "")}
                                        styles={selectMenuStyle}
                                        isClearable
                                        placeholder="Chọn thương hiệu"
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Chất liệu <span style={{color:"#e74c3c"}}>*</span></Typography>
                                {renderSelectOrLoading(
                                    <CreatableSelect
                                        options={materialOptions}
                                        value={getOptionByValue(materialOptions, form.idChatLieu)}
                                        onChange={opt => handleChange("idChatLieu", opt ? opt.value : "")}
                                        styles={selectMenuStyle}
                                        isClearable
                                        placeholder="Chọn chất liệu"
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Cổ áo</Typography>
                                {renderSelectOrLoading(
                                    <CreatableSelect
                                        options={collarOptions}
                                        value={getOptionByValue(collarOptions, form.idCoAo)}
                                        onChange={opt => handleChange("idCoAo", opt ? opt.value : "")}
                                        styles={selectMenuStyle}
                                        isClearable
                                        placeholder="Chọn cổ áo"
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Tay áo</Typography>
                                {renderSelectOrLoading(
                                    <CreatableSelect
                                        options={sleeveOptions}
                                        value={getOptionByValue(sleeveOptions, form.idTayAo)}
                                        onChange={opt => handleChange("idTayAo", opt ? opt.value : "")}
                                        styles={selectMenuStyle}
                                        isClearable
                                        placeholder="Chọn tay áo"
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Màu sắc</Typography>
                                {renderSelectOrLoading(
                                    <Select
                                        options={colorOptions}
                                        value={getOptionByValue(colorOptions, form.idMauSac)}
                                        onChange={opt => handleChange("idMauSac", opt ? opt.value : "")}
                                        styles={selectMenuStyle}
                                        isClearable
                                        placeholder="Chọn màu sắc"
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Kích cỡ</Typography>
                                {renderSelectOrLoading(
                                    <Select
                                        options={sizeOptions}
                                        value={getOptionByValue(sizeOptions, form.idKichThuoc)}
                                        onChange={opt => handleChange("idKichThuoc", opt ? opt.value : "")}
                                        styles={selectMenuStyle}
                                        isClearable
                                        placeholder="Chọn kích cỡ"
                                        noOptionsMessage={() => "Không có dữ liệu"}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Giá (₫)"
                                    value={form.gia}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        sx: { background: "#fafdff", borderRadius: 2 }
                                    }}
                                    onChange={(e) => handleChange("gia", e.target.value)}
                                    type="number"
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Số lượng"
                                    value={form.soLuong}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        sx: { background: "#fafdff", borderRadius: 2 }
                                    }}
                                    onChange={(e) => handleChange("soLuong", e.target.value)}
                                    type="number"
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Trọng lượng (g)"
                                    value={form.trongLuong}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        sx: { background: "#fafdff", borderRadius: 2 }
                                    }}
                                    onChange={(e) => handleChange("trongLuong", e.target.value)}
                                    type="number"
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">Trạng thái</Typography>
                                <Select
                                    options={trangThaiList}
                                    value={getOptionByValue(trangThaiList, form.trangThai)}
                                    onChange={opt => handleChange("trangThai", opt ? opt.value : 0)}
                                    styles={selectMenuStyle}
                                    isClearable
                                    placeholder="Chọn trạng thái"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography fontWeight={700} mb={0.5} color="#1769aa">
                                    Mã QR
                                </Typography>
                                <Box mt={2} display="flex" alignItems="center" justifyContent="start" height={100} gap={1}>
                                    <Box
                                        ref={qrRef}
                                        sx={{
                                            background: "#fff",
                                            border: "1.5px solid #e3e9f0",
                                            borderRadius: 3,
                                            p: 1,
                                            boxShadow: 2,
                                            width: 104,
                                            height: 104,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            position: "relative"
                                        }}>
                                        <QRCodeCanvas value={detail?.maSanPhamChiTiet || "QR"} size={90} />
                                    </Box>
                                    <Tooltip title="Tải ảnh QR về">
                                        <IconButton
                                            onClick={handleDownloadQR}
                                            color="info"
                                            sx={{
                                                ml: 1,
                                                background: "#f0f4fa",
                                                borderRadius: 2,
                                                border: "1.5px solid #e3e9f0",
                                                boxShadow: 1,
                                                "&:hover": { background: "#e3f2fd" }
                                            }}
                                        >
                                            <FaDownload />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography fontWeight={700} mb={1} color="#1769aa">Hình ảnh sản phẩm</Typography>
                        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" minHeight={90}>
                            {(imagePreview || []).map((img, idx) => (
                                <Box key={idx} sx={{ position: "relative", mb: 1 }}>
                                    <Tooltip title="Xóa ảnh">
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                top: -10,
                                                right: -10,
                                                background: "#fff",
                                                border: "1px solid #eee",
                                                zIndex: 2
                                            }}
                                            onClick={() => handleImageRemove(img)}
                                        >
                                            <FaTrash color="#e74c3c" />
                                        </IconButton>
                                    </Tooltip>
                                    <img
                                        src={img}
                                        alt="Ảnh sản phẩm"
                                        width={82}
                                        height={82}
                                        style={{
                                            borderRadius: 10,
                                            border: "1.5px solid #e3e9f0",
                                            objectFit: "cover",
                                            background: "#fafbfc",
                                            boxShadow: "0 2px 8px rgba(25,118,210,0.07)"
                                        }}
                                    />
                                </Box>
                            ))}
                            <Tooltip title="Thêm ảnh">
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        borderRadius: 3,
                                        height: 82,
                                        width: 82,
                                        minWidth: 0,
                                        borderStyle: "dashed",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#1976d2",
                                        fontWeight: 600,
                                        fontSize: 29,
                                        background: "#fafdff",
                                        boxShadow: "none"
                                    }}
                                >
                                    <FaPlus />
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Tooltip>
                        </Box>
                        <Typography variant="caption" color="#bdbdbd" mt={1} display="block">
                            Bạn có thể chọn nhiều ảnh, ảnh đầu tiên là ảnh đại diện.
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, background: "#fafdff" }}>
                <Button onClick={onClose} color="inherit" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600 }}>
                    Hủy
                </Button>
                <Button
                    onClick={handleUpdate}
                    variant="contained"
                    color="info"
                    sx={{ borderRadius: 2, minWidth: 120, fontWeight: 700, fontSize: 17, boxShadow: 3 }}
                    disabled={isLoadingOptions}
                >
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ProductDetailUpdateModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    detail: PropTypes.object,
};

ProductDetailUpdateModal.defaultProps = {
    detail: {},
};

export default ProductDetailUpdateModal;