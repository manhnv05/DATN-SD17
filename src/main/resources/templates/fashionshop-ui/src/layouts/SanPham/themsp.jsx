import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { FaTrash } from "react-icons/fa";
import { Alert, CircularProgress, Grid, Tooltip } from "@mui/material";
import CreatableSelect from "react-select/creatable";
import MuiSelect from "react-select";

// Helper chuẩn hóa đường dẫn ảnh (luôn trả về link từ backend, không phải FE)
const normalizeUrl = (url) =>
    url && url.startsWith("http")
        ? url
        : `http://localhost:8080${url?.startsWith("/") ? "" : "/"}${url || ""}`;

// Helper sinh mã sản phẩm tự động theo quy tắc SP + thời gian
const generateProductCode = () => {
    const now = new Date();
    const yyyy = now.getFullYear().toString().slice(-2);
    const MM = (now.getMonth() + 1).toString().padStart(2, "0");
    const dd = now.getDate().toString().padStart(2, "0");
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    const ss = now.getSeconds().toString().padStart(2, "0");
    return `SP${yyyy}${MM}${dd}${hh}${mm}${ss}`;
};

// Sinh danh sách sản phẩm động theo màu và size
function getProductVariantsByColors(colors, sizes, productName) {
    const selectedColors = colors.filter(Boolean);
    const selectedSizes = sizes.filter(Boolean);
    if (!selectedColors.length || !selectedSizes.length) return [];
    return selectedColors.map((colorId) => ({
        colorId,
        products: selectedSizes.map((sizeId) => ({
            name: productName,
            sizeId,
            weight: "",
            qty: "",
            price: "",
            unit: "g",
            image: "",
        })),
    }));
}

// Helper lấy label từ id
const getLabelById = (options, id) =>
    options.find((opt) => `${opt.value}` === `${id}`)?.label || id;

function ProductForm() {
    // Form states
    const [productCode, setProductCode] = useState(generateProductCode());
    const [productName, setProductName] = useState("");
    const [productNameOptions, setProductNameOptions] = useState([]);
    const [productDesc, setProductDesc] = useState("");

    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [collars, setCollars] = useState([""]);
    const [sleeves, setSleeves] = useState([""]);

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [brandOptions, setBrandOptions] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);

    const [colorOptions, setColorOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");

    const [materialOptions, setMaterialOptions] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const [sizeOptions, setSizeOptions] = useState([]);
    const [collarOptions, setCollarOptions] = useState([]);
    const [sleeveOptions, setSleeveOptions] = useState([]);

    const [showImageModal, setShowImageModal] = useState(false);
    const [modalColor, setModalColor] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageOptions, setImageOptions] = useState([]);

    const [showAttributes, setShowAttributes] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [addSuccess, setAddSuccess] = useState("");
    const [productVariants, setProductVariants] = useState([]);
    const [createdSanPhamId, setCreatedSanPhamId] = useState(null);

    const closeImageModal = () => setShowImageModal(false);

    useEffect(() => {
        fetch("http://localhost:8080/danhMuc/all")
            .then((res) => res.json())
            .then((data) =>
                setCategoryOptions(
                    Array.isArray(data)
                        ? data.map((item) => ({
                            value: item.id,
                            label: item.tenDanhMuc,
                        }))
                        : []
                )
            )
            .catch(() => setCategoryOptions([]));

        fetch("http://localhost:8080/thuongHieu/all")
            .then((res) => res.json())
            .then((data) =>
                setBrandOptions(
                    Array.isArray(data)
                        ? data.map((item) => ({
                            value: item.id,
                            label: item.tenThuongHieu,
                        }))
                        : []
                )
            )
            .catch(() => setBrandOptions([]));

        fetch("http://localhost:8080/mauSac/all")
            .then((res) => res.json())
            .then((data) =>
                setColorOptions(
                    Array.isArray(data)
                        ? data.map((item) => ({
                            value: item.id,
                            label: item.tenMauSac,
                        }))
                        : []
                )
            )
            .catch(() => setColorOptions([]));

        fetch("http://localhost:8080/xuatXu/quocGia")
            .then((res) => res.json())
            .then((data) =>
                setCountryOptions(
                    Array.isArray(data)
                        ? data.map((item) => ({
                            value: item.name ?? item,
                            label: item.name ?? item,
                        }))
                        : []
                )
            )
            .catch(() => setCountryOptions([]));

        fetch("http://localhost:8080/chatLieu/all")
            .then((res) => res.json())
            .then((data) =>
                setMaterialOptions(
                    Array.isArray(data)
                        ? typeof data[0] === "string"
                            ? data.map((name) => ({ value: name, label: name }))
                            : data.map((item) => ({
                                value: item.id,
                                label: item.tenChatLieu,
                            }))
                        : []
                )
            )
            .catch(() => setMaterialOptions([]));

        fetch("http://localhost:8080/kichThuoc/all")
            .then((res) => res.json())
            .then((data) =>
                setSizeOptions(
                    Array.isArray(data)
                        ? data.map((item) =>
                            typeof item === "string"
                                ? { value: item, label: item }
                                : {
                                    value: item.id,
                                    label: item.tenKichCo || item.label || item,
                                }
                        )
                        : []
                )
            )
            .catch(() => setSizeOptions([]));

        fetch("http://localhost:8080/coAo/all")
            .then((res) => res.json())
            .then((data) =>
                setCollarOptions(
                    Array.isArray(data)
                        ? data.map((item) =>
                            typeof item === "string"
                                ? { value: item, label: item }
                                : {
                                    value: item.id,
                                    label: item.tenCoAo || item.label || item,
                                }
                        )
                        : []
                )
            )
            .catch(() => setCollarOptions([]));

        fetch("http://localhost:8080/tayAo/all")
            .then((res) => res.json())
            .then((data) =>
                setSleeveOptions(
                    Array.isArray(data)
                        ? data.map((item) =>
                            typeof item === "string"
                                ? { value: item, label: item }
                                : {
                                    value: item.id,
                                    label: item.tenTayAo || item.label || item,
                                }
                        )
                        : []
                )
            )
            .catch(() => setSleeveOptions([]));

        fetch("http://localhost:8080/hinhAnh/all")
            .then((res) => res.json())
            .then((data) =>
                setImageOptions(
                    Array.isArray(data)
                        ? data.map((item) => ({
                            value: item.id,
                            label: item.moTa || `Ảnh ${item.id}`,
                            url: normalizeUrl(item.duongDanAnh),
                        }))
                        : []
                )
            )
            .catch(() => setImageOptions([]));

        // Fetch tên sản phẩm đã có sẵn
        fetch("http://localhost:8080/sanPham/all-ten")
            .then((res) => res.json())
            .then((data) =>
                setProductNameOptions(
                    Array.isArray(data)
                        ? data.map((name) => ({
                            value: name,
                            label: name,
                        }))
                        : []
                )
            )
            .catch(() => setProductNameOptions([]));
    }, []);

    useEffect(() => {
        setProductVariants(getProductVariantsByColors(colors, sizes, productName));
        // eslint-disable-next-line
    }, [JSON.stringify(colors), JSON.stringify(sizes), productName]);

    useEffect(() => {
        setProductCode(generateProductCode());
    }, []);

    const isAllFieldsSelected =
        colors.length > 0 &&
        sizes.length > 0 &&
        collars.length > 0 &&
        collars.every((c) => !!c) &&
        sleeves.length > 0 &&
        sleeves.every((s) => !!s);

    const handleVariantValueChange = (colorIdx, prodIdx, field, value) => {
        setProductVariants((prev) => {
            const newArr = [...prev];
            newArr[colorIdx] = {
                ...newArr[colorIdx],
                products: newArr[colorIdx].products.map((p, idx) =>
                    idx === prodIdx ? { ...p, [field]: value } : p
                ),
            };
            return newArr;
        });
    };

    const openImageModal = (color) => {
        setModalColor(color);
        setShowImageModal(true);
        setSelectedImages([]);
    };

    const findId = (arr, value) => {
        const item = arr.find(
            (x) => `${x.value}` === `${value}` || x.label === value
        );
        return item ? item.value : null;
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setAddError("");
        setAddSuccess("");
        setAddLoading(true);

        const chiTietSanPhams = [];
        productVariants.forEach((variant) => {
            variant.products.forEach((prod) => {
                chiTietSanPhams.push({
                    idMauSac: findId(colorOptions, variant.colorId),
                    idKichThuoc: findId(sizeOptions, prod.sizeId),
                    idCoAo: findId(collarOptions, collars[0]),
                    idTayAo: findId(sleeveOptions, sleeves[0]),
                    gia: Number(prod.price),
                    soLuong: Number(prod.qty),
                    trongLuong: Number(prod.weight),
                    maSanPhamChiTiet: `${productCode}-${findId(
                        colorOptions,
                        variant.colorId
                    )}-${findId(sizeOptions, prod.sizeId)}`,
                    moTa: "",
                    trangThai: 1,
                });
            });
        });

        const data = {
            idChatLieu: selectedMaterial,
            idThuongHieu: selectedBrand,
            xuatXu: selectedCountry,
            idDanhMuc: selectedCategory,
            maSanPham: productCode,
            tenSanPham: productName,
            trangThai: 1,
            chiTietSanPhams,
        };

        try {
            const res = await fetch("http://localhost:8080/sanPham", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Lỗi khi thêm sản phẩm");
            const result = await res.json();
            setCreatedSanPhamId(result.id || result);
            setAddSuccess("Thêm sản phẩm và các biến thể thành công!");
            setShowAttributes(true);
        } catch (err) {
            setAddError("Thêm sản phẩm thất bại!");
        }
        setAddLoading(false);
    };

    const handleAddProductDetail = async () => {
        setAddError("");
        setAddSuccess("");
        setAddLoading(true);

        const chiTietSanPhams = [];
        productVariants.forEach((variant) => {
            variant.products.forEach((prod) => {
                chiTietSanPhams.push({
                    idSanPham: createdSanPhamId,
                    idMauSac: findId(colorOptions, variant.colorId),
                    idKichThuoc: findId(sizeOptions, prod.sizeId),
                    idCoAo: findId(collarOptions, collars[0]),
                    idTayAo: findId(sleeveOptions, sleeves[0]),
                    gia: Number(prod.price),
                    soLuong: Number(prod.qty),
                    trongLuong: Number(prod.weight),
                    maSanPhamChiTiet: `${productCode}-${findId(
                        colorOptions,
                        variant.colorId
                    )}-${findId(sizeOptions, prod.sizeId)}`,
                    moTa: "",
                    trangThai: 1,
                });
            });
        });

        try {
            const promises = chiTietSanPhams.map((ctsp) =>
                fetch("http://localhost:8080/chiTietSanPham", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ctsp),
                }).then((res) => {
                    if (!res.ok) throw new Error("Lỗi khi thêm chi tiết sản phẩm");
                    return res.json();
                })
            );
            await Promise.all(promises);
            setAddSuccess("Thêm chi tiết sản phẩm thành công!");
        } catch (err) {
            setAddError("Thêm chi tiết sản phẩm thất bại!");
        }
        setAddLoading(false);
    };

    const handleChangeSelect = (setter, arr, idx, value) => {
        const newArr = [...arr];
        newArr[idx] = value;
        setter(newArr);
    };

    // Table render giữ nguyên, có thể thêm tooltip như ví dụ trước

    const renderProductColorTable = (variant, colorIdx) => (
        <Card
            key={colorIdx}
            sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: 1,
                p: 2,
                background: "#fff",
                userSelect: "none",
            }}
        >
            <SoftBox fontWeight="bold" mb={2} sx={{ color: "#1976d2", fontSize: 16 }}>
                Danh sách sản phẩm màu {getLabelById(colorOptions, variant.colorId)}
            </SoftBox>
            <Table
                columns={[
                    { name: "check", label: "", align: "center", width: 40 },
                    { name: "name", label: "Sản phẩm", align: "left" },
                    { name: "size", label: "Kích cỡ", align: "center" },
                    { name: "weight", label: "Trọng lượng", align: "right" },
                    { name: "qty", label: "Số lượng", align: "right" },
                    { name: "price", label: "Giá", align: "right" },
                    { name: "image", label: "Ảnh", align: "center" },
                    { name: "action", label: "", align: "center", width: 40 },
                ]}
                rows={variant.products.map((p, prodIdx) => ({
                    check: <input type="checkbox" />,
                    name: (
                        <Tooltip title={p.name || ""}>
                            <Input value={p.name} size="small" readOnly sx={{ minWidth: 90 }} />
                        </Tooltip>
                    ),
                    size: (
                        <Tooltip title={getLabelById(sizeOptions, p.sizeId) || ""}>
                            <Input
                                value={getLabelById(sizeOptions, p.sizeId)}
                                size="small"
                                readOnly
                                sx={{ minWidth: 60 }}
                            />
                        </Tooltip>
                    ),
                    weight: (
                        <SoftBox display="flex" alignItems="center" justifyContent="flex-end">
                            <Input
                                type="number"
                                value={p.weight}
                                onChange={(e) =>
                                    handleVariantValueChange(colorIdx, prodIdx, "weight", e.target.value)
                                }
                                size="small"
                                sx={{ width: 60 }}
                                inputProps={{ min: 1 }}
                            />
                            <span style={{ marginLeft: 4 }}>g</span>
                        </SoftBox>
                    ),
                    qty: (
                        <Input
                            type="number"
                            value={p.qty}
                            onChange={(e) =>
                                handleVariantValueChange(colorIdx, prodIdx, "qty", e.target.value)
                            }
                            size="small"
                            sx={{ width: 60 }}
                            inputProps={{ min: 1 }}
                        />
                    ),
                    price: (
                        <Input
                            type="number"
                            value={p.price}
                            onChange={(e) =>
                                handleVariantValueChange(colorIdx, prodIdx, "price", e.target.value)
                            }
                            size="small"
                            sx={{ width: 80 }}
                            inputProps={{ min: 0 }}
                        />
                    ),
                    image: (
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 60 }}
                            onClick={() => openImageModal(getLabelById(colorOptions, variant.colorId))}
                        >
                            <Icon fontSize="small">image</Icon> Ảnh
                        </Button>
                    ),
                    action: (
                        <Tooltip title="Xóa dòng này">
                            <IconButton size="small" sx={{ color: "#eb5757" }}>
                                <FaTrash />
                            </IconButton>
                        </Tooltip>
                    ),
                }))}
            />
        </Card>
    );

    const renderImageModal = () => (
        <Dialog open={showImageModal} onClose={closeImageModal} maxWidth="md" fullWidth>
            <DialogTitle>Chọn ảnh cho màu {modalColor}</DialogTitle>
            <DialogContent>
                <SoftBox mb={2} fontWeight="bold">
                    Danh sách ảnh đã chọn
                </SoftBox>
                <SoftBox
                    display="flex"
                    alignItems="center"
                    gap={2}
                    flexWrap="wrap"
                    style={{
                        minHeight: 100,
                        border: "1px dashed #d5d5d5",
                        borderRadius: 8,
                        width: "100%",
                        padding: 6,
                        background: "#f9fafc"
                    }}
                >
                    {selectedImages.length === 0 ? (
                        <SoftBox textAlign="center" color="secondary" width="100%">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                                alt="no-img"
                                style={{ width: 48, opacity: 0.5 }}
                            />
                            <div style={{ fontSize: 14, opacity: 0.7 }}>No Data Found</div>
                        </SoftBox>
                    ) : (
                        selectedImages.map((id) => {
                            const img = imageOptions.find((i) => i.value === id);
                            if (!img) return null;
                            return (
                                <SoftBox
                                    key={id}
                                    sx={{
                                        border: "1px solid #ddd",
                                        borderRadius: 2,
                                        p: 0.5,
                                        width: 90,
                                        height: 80,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#fafaff",
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.label}
                                        style={{
                                            width: 70,
                                            height: 50,
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    />
                                    <div style={{ fontSize: 12, textAlign: "center" }}>{img.label}</div>
                                </SoftBox>
                            );
                        })
                    )}
                </SoftBox>
                <SoftBox fontWeight="bold" mt={4} mb={2}>
                    Danh sách ảnh từ hệ thống
                </SoftBox>
                <SoftBox display="flex" flexWrap="wrap" gap={2}>
                    {imageOptions.length === 0 ? (
                        <SoftBox textAlign="center" color="secondary" width="100%">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                                alt="no-img"
                                style={{ width: 48, opacity: 0.5 }}
                            />
                            <div style={{ fontSize: 14, opacity: 0.7 }}>No Data Found</div>
                        </SoftBox>
                    ) : (
                        imageOptions.map((img) => (
                            <SoftBox
                                key={img.value}
                                sx={{
                                    border: selectedImages.includes(img.value)
                                        ? "2px solid orange"
                                        : "1px dashed #bbb",
                                    borderRadius: 2,
                                    p: 0.5,
                                    position: "relative",
                                    width: 120,
                                    height: 110,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    background: "#fff",
                                    transition: "box-shadow 0.2s, border 0.2s",
                                    boxShadow: selectedImages.includes(img.value)
                                        ? "0 2px 8px rgba(255,165,0,0.15)"
                                        : "none",
                                }}
                                onClick={() => {
                                    setSelectedImages((sel) =>
                                        sel.includes(img.value)
                                            ? sel.filter((v) => v !== img.value)
                                            : [...sel, img.value]
                                    );
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedImages.includes(img.value)}
                                    readOnly
                                    style={{
                                        position: "absolute",
                                        left: 2,
                                        top: 2,
                                        zIndex: 2,
                                    }}
                                />
                                <img
                                    src={img.url}
                                    alt={img.label}
                                    style={{
                                        width: 100,
                                        height: 80,
                                        objectFit: "cover",
                                        borderRadius: 4,
                                    }}
                                />
                                <div style={{ fontSize: 14, marginTop: 4 }}>{img.label}</div>
                            </SoftBox>
                        ))
                    )}
                </SoftBox>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={closeImageModal}>
                    Đóng
                </Button>
                <Button variant="contained" color="info" onClick={closeImageModal}>
                    Lưu chọn ảnh
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox
                py={3}
                sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}
            >
                <Card
                    sx={{
                        p: { xs: 2, md: 3 },
                        mb: 2,
                        maxWidth: "1100px",
                        margin: "0 auto",
                        boxShadow: 4,
                        borderRadius: 3,
                    }}
                >
                    <SoftBox>
                        <SoftBox fontWeight="bold" mb={2} fontSize={24} color="primary.main">
                            Thêm Sản Phẩm
                        </SoftBox>
                        <form onSubmit={handleAddProduct}>
                            <SoftBox mb={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Mã sản phẩm</SoftBox>
                                            <Input
                                                id="product-code-input"
                                                fullWidth
                                                placeholder="Mã sản phẩm"
                                                value={productCode}
                                                disabled
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#1769aa",
                                                    background: "#f2f6fa",
                                                    borderRadius: 2,
                                                    pl: 1,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Tên sản phẩm</SoftBox>
                                            <CreatableSelect
                                                inputId="product-name-input"
                                                options={productNameOptions}
                                                value={
                                                    productName
                                                        ? { value: productName, label: productName }
                                                        : null
                                                }
                                                onChange={(opt) =>
                                                    setProductName(opt ? opt.value : "")
                                                }
                                                onInputChange={(inputValue, { action }) => {
                                                    if (action === "input-change") {
                                                        setProductName(inputValue);
                                                    }
                                                }}
                                                placeholder="Chọn hoặc nhập tên sản phẩm"
                                                isClearable
                                                isSearchable
                                                formatCreateLabel={(inputValue) =>
                                                    `Thêm mới: ${inputValue}`
                                                }
                                                noOptionsMessage={() => "Không có sản phẩm, nhập tên mới để thêm"}
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Danh mục</SoftBox>
                                            <MuiSelect
                                                inputId="category-input"
                                                options={categoryOptions}
                                                value={
                                                    categoryOptions.find(
                                                        (opt) => opt.value === selectedCategory
                                                    ) || null
                                                }
                                                onChange={(opt) =>
                                                    setSelectedCategory(opt ? opt.value : null)
                                                }
                                                placeholder="Chọn danh mục"
                                                isClearable
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Thương hiệu</SoftBox>
                                            <MuiSelect
                                                inputId="brand-input"
                                                options={brandOptions}
                                                value={
                                                    brandOptions.find(
                                                        (opt) => opt.value === selectedBrand
                                                    ) || null
                                                }
                                                onChange={(opt) =>
                                                    setSelectedBrand(opt ? opt.value : null)
                                                }
                                                placeholder="Chọn thương hiệu"
                                                isClearable
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Quốc gia</SoftBox>
                                            <MuiSelect
                                                inputId="country-input"
                                                options={countryOptions}
                                                value={
                                                    countryOptions.find(
                                                        (opt) => opt.value === selectedCountry
                                                    ) || null
                                                }
                                                onChange={(opt) =>
                                                    setSelectedCountry(opt ? opt.value : "")
                                                }
                                                placeholder="Chọn quốc gia"
                                                isClearable
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Chất liệu</SoftBox>
                                            <MuiSelect
                                                inputId="material-input"
                                                options={materialOptions}
                                                value={
                                                    materialOptions.find(
                                                        (opt) => opt.value === selectedMaterial
                                                    ) || null
                                                }
                                                onChange={(opt) =>
                                                    setSelectedMaterial(opt ? opt.value : null)
                                                }
                                                placeholder="Chọn chất liệu"
                                                isClearable
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {/* Cổ áo và Tay áo chuyển lên đây */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Cổ áo</SoftBox>
                                            <MuiSelect
                                                options={collarOptions}
                                                value={collarOptions.find((o) => o.value === collars[0]) || null}
                                                onChange={(opt) =>
                                                    handleChangeSelect(setCollars, collars, 0, opt ? opt.value : "")
                                                }
                                                placeholder="Chọn kiểu cổ áo"
                                                isClearable
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Tay áo</SoftBox>
                                            <MuiSelect
                                                options={sleeveOptions}
                                                value={sleeveOptions.find((o) => o.value === sleeves[0]) || null}
                                                onChange={(opt) =>
                                                    handleChangeSelect(setSleeves, sleeves, 0, opt ? opt.value : "")
                                                }
                                                placeholder="Chọn kiểu tay áo"
                                                isClearable
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: 8,
                                                        borderColor: "#cfd8dc",
                                                        minHeight: 42,
                                                        boxShadow: state.isFocused
                                                            ? "0 0 0 2px #1976d2"
                                                            : "none",
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <SoftBox fontWeight="bold" mb={0.5}>Mô tả sản phẩm</SoftBox>
                                            <Input
                                                id="product-desc-input"
                                                fullWidth
                                                placeholder="Mô tả sản phẩm"
                                                value={productDesc}
                                                onChange={(e) => setProductDesc(e.target.value)}
                                                multiline
                                                rows={3}
                                                sx={{
                                                    background: "#f2f6fa",
                                                    borderRadius: 2,
                                                    pl: 1,
                                                    fontSize: 15
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <SoftBox display="flex" justifyContent="flex-end" mt={2}>
                                    <Button
                                        variant="contained"
                                        color="info"
                                        type="submit"
                                        disabled={addLoading}
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1.2,
                                            fontSize: 16,
                                            borderRadius: 2
                                        }}
                                    >
                                        {addLoading && (
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        )}
                                        Thêm sản phẩm
                                    </Button>
                                </SoftBox>
                                {addError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {addError}
                                    </Alert>
                                )}
                                {addSuccess && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        {addSuccess}
                                    </Alert>
                                )}
                            </SoftBox>
                        </form>
                    </SoftBox>
                </Card>

                {/* PHẦN 2: THUỘC TÍNH SẢN PHẨM */}
                {showAttributes && (
                    <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, maxWidth: "1100px", margin: "0 auto", borderRadius: 3 }}>
                        <SoftBox fontWeight="bold" mb={2} fontSize={20} color="primary.main">
                            Màu sắc & Kích cỡ
                        </SoftBox>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <SoftBox fontWeight="bold" mb={0.5}>Màu sắc</SoftBox>
                                    <MuiSelect
                                        isMulti
                                        options={colorOptions}
                                        value={colorOptions.filter((o) => colors.includes(o.value))}
                                        onChange={(opts) => setColors(opts ? opts.map(opt => opt.value) : [])}
                                        placeholder="Chọn nhiều màu sắc"
                                        closeMenuOnSelect={false}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                borderRadius: 8,
                                                borderColor: "#cfd8dc",
                                                minHeight: 45,
                                                boxShadow: state.isFocused ? "0 0 0 2px #1976d2" : "none",
                                            }),
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <SoftBox fontWeight="bold" mb={0.5}>Kích cỡ</SoftBox>
                                    <MuiSelect
                                        isMulti
                                        options={sizeOptions}
                                        value={sizeOptions.filter((o) => sizes.includes(o.value))}
                                        onChange={(opts) => setSizes(opts ? opts.map(opt => opt.value) : [])}
                                        placeholder="Chọn nhiều kích cỡ"
                                        closeMenuOnSelect={false}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                borderRadius: 8,
                                                borderColor: "#cfd8dc",
                                                minHeight: 45,
                                                boxShadow: state.isFocused ? "0 0 0 2px #1976d2" : "none",
                                            }),
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        {!isAllFieldsSelected && (
                            <SoftBox textAlign="right" mt={2}>
                                <Button variant="contained" color="primary" disabled>
                                    Vui lòng chọn đầy đủ thuộc tính để xem danh sách sản phẩm
                                </Button>
                            </SoftBox>
                        )}
                        {isAllFieldsSelected && (
                            <SoftBox my={4}>
                                <SoftBox textAlign="right" mb={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={handleAddProductDetail}
                                        disabled={addLoading || !createdSanPhamId}
                                        sx={{ fontWeight: 600, px: 3, fontSize: 15, borderRadius: 2 }}
                                    >
                                        {addLoading && (
                                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        )}
                                        Thêm sản phẩm chi tiết
                                    </Button>
                                </SoftBox>
                                {addError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {addError}
                                    </Alert>
                                )}
                                {addSuccess && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        {addSuccess}
                                    </Alert>
                                )}
                                {productVariants.map((variant, idx) => renderProductColorTable(variant, idx))}
                            </SoftBox>
                        )}
                    </Card>
                )}

                {renderImageModal()}
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ProductForm;