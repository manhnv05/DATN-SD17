import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Slider,
  MenuItem,
  Select,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import ProductSlideshow from "../../BanHangTaiQuay/component/ProductSlideshow.jsx";

const API_URL = "http://localhost:8080/chiTietSanPham/allctspgiamgia";

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "N/A";
  }
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

function ProductSelectionModalOrderDetail({ open, onClose, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minMaxActualPrice, setMinMaxActualPrice] = useState([0, 10000000]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedMaterial, setSelectedMaterial] = useState("Tất cả");
  const [selectedSize, setSelectedSize] = useState("Tất cả");
  const [selectedCollar, setSelectedCollar] = useState("Tất cả");
  const [selectedSleeve, setSelectedSleeve] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [selectedColor, setSelectedColor] = useState("Tất cả");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, { withCredentials: true });
      const fetchedProducts = response.data.map((p) => ({
        ...p,
        uniqueId: `${p.maSanPham || ""}-${p.kichThuoc || ""}-${p.mauSac || ""}-${
          p.id || Math.random()
        }`,
      }));
      setProducts(fetchedProducts);
      if (fetchedProducts.length > 0) {
        const allPrices = fetchedProducts
          .map((p) => p.gia)
          .filter((price) => typeof price === "number" && !isNaN(price));
        if (allPrices.length > 0) {
          const minP = Math.min(...allPrices);
          const maxP = Math.max(...allPrices);
          setMinMaxActualPrice([minP, maxP]);
          setPriceRange([minP, maxP]);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open, fetchProducts]);

  const getUniqueValues = useCallback(
    (key) => {
      const values = products.map((p) => p[key]);
      return [
        "Tất cả",
        ...new Set(values.filter((v) => v !== null && v !== undefined && v !== "")),
      ];
    },
    [products]
  );

  const categories = useMemo(() => getUniqueValues("danhMuc"), [getUniqueValues]);
  const materials = useMemo(() => getUniqueValues("chatLieu"), [getUniqueValues]);
  const sizes = useMemo(
    () =>
      getUniqueValues("kichThuoc").sort((a, b) =>
        a === "Tất cả"
          ? -1
          : b === "Tất cả"
          ? 1
          : ({ XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5, XXXL: 6 }[a] ?? 99) -
            ({ XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5, XXXL: 6 }[b] ?? 99)
      ),
    [getUniqueValues]
  );
  const collars = useMemo(() => getUniqueValues("coAo"), [getUniqueValues]);
  const sleeves = useMemo(() => getUniqueValues("tayAo"), [getUniqueValues]);
  const brands = useMemo(() => getUniqueValues("thuongHieu"), [getUniqueValues]);
  const colors = useMemo(() => getUniqueValues("mauSac"), [getUniqueValues]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        product.tenSanPham?.toLowerCase().includes(lowercasedSearchTerm) ||
        product.maSanPham?.toLowerCase().includes(lowercasedSearchTerm);
      const matchesPrice = product.gia >= priceRange[0] && product.gia <= priceRange[1];
      const matchesCategory = selectedCategory === "Tất cả" || product.danhMuc === selectedCategory;
      const matchesMaterial =
        selectedMaterial === "Tất cả" || product.chatLieu === selectedMaterial;
      const matchesSize = selectedSize === "Tất cả" || product.kichThuoc === selectedSize;
      const matchesCollar = selectedCollar === "Tất cả" || product.coAo === selectedCollar;
      const matchesSleeve = selectedSleeve === "Tất cả" || product.tayAo === selectedSleeve;
      const matchesBrand = selectedBrand === "Tất cả" || product.thuongHieu === selectedBrand;
      const matchesColor = selectedColor === "Tất cả" || product.mauSac === selectedColor;
      return (
        matchesSearch &&
        matchesPrice &&
        matchesCategory &&
        matchesMaterial &&
        matchesSize &&
        matchesCollar &&
        matchesSleeve &&
        matchesBrand &&
        matchesColor
      );
    });
  }, [
    products,
    searchTerm,
    priceRange,
    selectedCategory,
    selectedMaterial,
    selectedSize,
    selectedCollar,
    selectedSleeve,
    selectedBrand,
    selectedColor,
  ]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCloseAndReset = () => {
    setSearchTerm("");
    setPriceRange(minMaxActualPrice);
    setSelectedCategory("Tất cả");
    setSelectedMaterial("Tất cả");
    setSelectedSize("Tất cả");
    setSelectedCollar("Tất cả");
    setSelectedSleeve("Tất cả");
    setSelectedBrand("Tất cả");
    setSelectedColor("Tất cả");
    setProducts([]);
    onClose();
  };

  const handleProductSelect = (product) => {
    onSelectProduct({ ...product, quantity: 1 });
    handleCloseAndReset();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseAndReset}
      fullWidth={true}
      maxWidth={false}
      sx={{ "& .MuiDialog-paper": { height: "90vh", width: "90vw", maxWidth: "none" } }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SoftTypography variant="h5" fontWeight="medium" color="info">
            Tìm kiếm sản phẩm
          </SoftTypography>
          <IconButton onClick={handleCloseAndReset}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* === PHẦN BỘ LỌC === */}
        <SoftBox mb={2} p={1}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Tìm kiếm sản phẩm
              </SoftTypography>
              <TextField
                placeholder="Nhập tên hoặc mã sản phẩm"
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <Box sx={{ flex: "1 1 300px" }}>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Lọc theo giá
              </SoftTypography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                min={minMaxActualPrice[0]}
                max={minMaxActualPrice[1]}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
                disableSwap
              />
              <Typography
                variant="caption"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{formatCurrency(priceRange[0])}</span>
                <span>{formatCurrency(priceRange[1])}</span>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Danh mục
              </SoftTypography>
              <Select
                size="small"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Thương hiệu
              </SoftTypography>
              <Select
                size="small"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Màu sắc
              </SoftTypography>
              <Select
                size="small"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Chất liệu
              </SoftTypography>
              <Select
                size="small"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {materials.map((mat) => (
                  <MenuItem key={mat} value={mat}>
                    {mat}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Kích thước
              </SoftTypography>
              <Select
                size="small"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Cổ áo
              </SoftTypography>
              <Select
                size="small"
                value={selectedCollar}
                onChange={(e) => setSelectedCollar(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {collars.map((collar) => (
                  <MenuItem key={collar} value={collar}>
                    {collar}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
                Tay áo
              </SoftTypography>
              <Select
                size="small"
                value={selectedSleeve}
                onChange={(e) => setSelectedSleeve(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {sleeves.map((sleeve) => (
                  <MenuItem key={sleeve} value={sleeve}>
                    {sleeve}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </SoftBox>

        {/* === PHẦN BẢNG DỮ LIỆU === */}
        {loading ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress color="info" />
            <SoftTypography variant="body2" ml={2}>
              Đang tải sản phẩm...
            </SoftTypography>
          </SoftBox>
        ) : error ? (
          <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
            <SoftTypography variant="body2" color="error">
              {error}
            </SoftTypography>
          </SoftBox>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: "calc(100% - 200px)" }}>
            <Table stickyHeader>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: "100px" }}>
                  Ảnh
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", minWidth: "200px" }}>
                  Tên sản phẩm
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                  Mã SP
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                  Danh mục
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                  Thương hiệu
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", minWidth: "100px" }}>
                  Màu sắc
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold", minWidth: "100px" }}>
                  Chất liệu
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: "90px" }}>
                  Kích thước
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: "90px" }}>
                  Cổ áo
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: "90px" }}>
                  Tay áo
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                  Giá
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: "90px" }}>
                  Tồn kho
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", minWidth: "120px" }}>
                  Thao tác
                </TableCell>
              </TableRow>

              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.idChiTietSanPham || product.uniqueId} hover>
                       <TableCell align="center" sx={{ width: 80, p: 1 }}>
                                                                    {/* Box container để định vị nhãn giảm giá */}
                                                                    <Box sx={{ position: 'relative', width: 100, height: 100 }}>
                                                                      {/* Ảnh sản phẩm */}
                                                                     <ProductSlideshow product={product} />
                                                                      {/* Nhãn giảm giá (chỉ hiển thị khi phanTramGiam > 0) */}
                                                                      {product.phanTramGiam > 0 && (
                                                                        <SoftTypography
                                                                          variant="caption"
                                                                          color="white"
                                                                          fontWeight="bold"
                                                                          sx={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            backgroundColor: 'success.main', // Màu xanh lá cây từ theme
                                                                            padding: '2px 5px',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.7rem',
                                                                            lineHeight: 1.2
                                                                          }}
                                                                        >
                                                                          {product.phanTramGiam}% OFF
                                                                        </SoftTypography>
                                                                      )}
                                                                    </Box>
                                                                  </TableCell>
                      <TableCell align="left">{product.tenSanPham || "N/A"}</TableCell>
                      <TableCell align="left">{product.maSanPham || "N/A"}</TableCell>
                      <TableCell align="left">{product.danhMuc || "N/A"}</TableCell>
                      <TableCell align="left">{product.thuongHieu || "N/A"}</TableCell>
                      <TableCell align="left">{product.mauSac || "N/A"}</TableCell>
                      <TableCell align="left">{product.chatLieu || "N/A"}</TableCell>
                      <TableCell align="center">{product.kichThuoc || "N/A"}</TableCell>
                      <TableCell align="center">{product.coAo || "N/A"}</TableCell>
                      <TableCell align="center">{product.tayAo || "N/A"}</TableCell>
                      <TableCell align="right" sx={{ width: 120 }}>
                        {/* Kiểm tra nếu có giảm giá */}
                        {product.phanTramGiam > 0 && product.giaTienSauKhiGiam < product.gia ? (
                          <Box>
                            {/* Giá gốc bị gạch ngang */}
                            <SoftTypography
                              component="span" // Dùng span để không xuống dòng
                              variant="body2"
                              color="text"
                              sx={{ textDecoration: "line-through", fontSize: "0.85rem" }}
                            >
                              {formatCurrency(product.gia)}
                            </SoftTypography>
                            {/* Giá sau khi giảm */}
                            <SoftTypography
                              variant="body2"
                              color="error"
                              fontWeight="bold"
                              sx={{ display: "block" }} // Hiển thị trên một dòng mới
                            >
                              {formatCurrency(product.giaTienSauKhiGiam)}
                            </SoftTypography>
                          </Box>
                        ) : (
                          // Nếu không giảm giá, chỉ hiển thị giá gốc
                          <SoftTypography variant="body2" fontWeight="bold">
                            {formatCurrency(product.gia)}
                          </SoftTypography>
                        )}
                      </TableCell>
                      <TableCell align="center">{product.soLuongTonKho || "N/A"}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color={product.soLuongTonKho > 0 ? "info" : "inherit"}
                          onClick={() => handleProductSelect(product)}
                          disabled={product.soLuongTonKho <= 0}
                          sx={{ minWidth: 90 }}
                        >
                          {product.soLuongTonKho > 0 ? "CHỌN" : "Hết hàng"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      <SoftTypography variant="body2" color="text">
                        Không tìm thấy sản phẩm nào phù hợp.
                      </SoftTypography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAndReset} color="secondary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProductSelectionModalOrderDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectProduct: PropTypes.func.isRequired,
};

export default ProductSelectionModalOrderDetail;
