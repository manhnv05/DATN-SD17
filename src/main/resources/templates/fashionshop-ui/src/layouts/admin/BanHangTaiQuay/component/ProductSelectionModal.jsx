import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Thêm useMemo
import axios from 'axios';
import PropTypes from 'prop-types';
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
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationModal from './ConfirmationModal';
import ProductSlideshow from "./ProductSlideshow"; // Import component ProductSlideshow

// Import SoftUI components
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";

// URL API của bạn
const API_URL = "http://localhost:8080/chiTietSanPham/allctspgiamgia"; 
const BASE_IMAGE_URL = "http://localhost:8080/";

// Hàm format tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function ProductSelectionModal({ open, onClose, onSelectProduct }) {
const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [minMaxActualPrice, setMinMaxActualPrice] = useState([0, 10000000]);
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedMaterial, setSelectedMaterial] = useState('Tất cả');
    const [selectedSize, setSelectedSize] = useState('Tất cả');
    const [selectedCollar, setSelectedCollar] = useState('Tất cả');
    const [selectedSleeve, setSelectedSleeve] = useState('Tất cả');
    const [selectedBrand, setSelectedBrand] = useState('Tất cả');
    const [selectedColor, setSelectedColor] = useState('Tất cả');

  // Hàm để fetch dữ liệu sản phẩm từ API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await axios.get(API_URL, {
            withCredentials: true // <-- BỔ SUNG: gửi kèm cookie/session khi gọi API backend
        });
      const fetchedProducts = response.data.map(p => ({
        ...p,
        uniqueId: `${p.maSanPham || ''}-${p.kichThuoc || ''}-${p.mauSac || ''}-${p.id || Math.random()}`
      }));
      console.log("LOG 2 (ProductSelectionModal): Dữ liệu sản phẩm đã được tải:", fetchedProducts);
      setProducts(fetchedProducts);
      if (fetchedProducts.length > 0) {
        const allPrices = fetchedProducts.map(p => p.gia).filter(price => typeof price === 'number' && !isNaN(price));
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
  // useEffect để tải dữ liệu khi modal mở
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open, fetchProducts]);

  // TỐI ƯU HÓA 2: Dùng useMemo để chỉ tính toán lại danh sách các bộ lọc khi `products` thay đổi.
  const getUniqueValues = useCallback((key) => {
    const values = products.map(p => p[key]);
    return ['Tất cả', ...new Set(values.filter(v => v !== null && v !== undefined && v !== ''))];
  }, [products]);

  const categories = useMemo(() => getUniqueValues('danhMuc'), [getUniqueValues]);
  const materials = useMemo(() => getUniqueValues('chatLieu'), [getUniqueValues]);
  const sizes = useMemo(() => getUniqueValues('kichThuoc').sort((a,b) => {
    if (a === 'Tất cả') return -1;
    if (b === 'Tất cả') return 1;
    const order = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5, 'XXXL': 6 };
    return (order[a] ?? 99) - (order[b] ?? 99);
  }), [getUniqueValues]);
  const collars = useMemo(() => getUniqueValues('coAo'), [getUniqueValues]);
  const sleeves = useMemo(() => getUniqueValues('tayAo'), [getUniqueValues]);
  const brands = useMemo(() => getUniqueValues('thuongHieu'), [getUniqueValues]);
  const colors = useMemo(() => getUniqueValues('mauSac'), [getUniqueValues]);

  // TỐI ƯU HÓA 3: Dùng useMemo để ghi nhớ kết quả lọc. Hàm filter chỉ chạy lại khi
  // danh sách sản phẩm gốc hoặc một trong các bộ lọc thay đổi.
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
          (product.tenSanPham && product.tenSanPham.toLowerCase().includes(lowercasedSearchTerm)) ||
          (product.maSanPham && product.maSanPham.toLowerCase().includes(lowercasedSearchTerm));

        const matchesPrice = product.gia >= priceRange[0] && product.gia <= priceRange[1];

        const matchesCategory = selectedCategory === 'Tất cả' || product.danhMuc === selectedCategory;
        const matchesMaterial = selectedMaterial === 'Tất cả' || product.chatLieu === selectedMaterial;
        const matchesSize = selectedSize === 'Tất cả' || product.kichThuoc === selectedSize;
        const matchesCollar = selectedCollar === 'Tất cả' || product.coAo === selectedCollar;
        const matchesSleeve = selectedSleeve === 'Tất cả' || product.tayAo === selectedSleeve;
        const matchesBrand = selectedBrand === 'Tất cả' || product.thuongHieu === selectedBrand;
        const matchesColor = selectedColor === 'Tất cả' || product.mauSac === selectedColor;

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
  }, [products, searchTerm, priceRange, selectedCategory, selectedMaterial, selectedSize, selectedCollar, selectedSleeve, selectedBrand, selectedColor]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCloseAndReset = () => {
    setSearchTerm('');
    setPriceRange(minMaxActualPrice);
    setSelectedCategory('Tất cả');
    setSelectedMaterial('Tất cả');
    setSelectedSize('Tất cả');
    setSelectedCollar('Tất cả');
    setSelectedSleeve('Tất cả');
    setSelectedBrand('Tất cả');
    setSelectedColor('Tất cả');
    setProducts([]);
    onClose();
  };
    const handleOpenConfirmation = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setConfirmationModalOpen(true);
    };

    const handleConfirmSelection = () => {
        if (selectedProduct) {
            onSelectProduct({ ...selectedProduct, quantity });
        }
        setConfirmationModalOpen(false);
        handleCloseAndReset();
    };
    return (
          <Dialog 
      open={open} 
      onClose={handleCloseAndReset} 
     
       fullWidth={true}
   maxWidth={false} // Tắt giới hạn chiều rộng mặc định
      sx={{ '& .MuiDialog-paper': {  height: '80vh',width: '90vw', maxWidth: 'none' } }}
  
      // Đặt chiều rộng tùy chỉnh
    >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SoftTypography variant="h5" fontWeight="medium" color="info">
                        Tìm kiếm sản phẩm
                    </SoftTypography>
                    <IconButton onClick={handleCloseAndReset}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {/* Phần bộ lọc */}
                <SoftBox mb={2}>
                  {/* Box lớn chứa cả hàng bộ lọc trên cùng */}
{/* Box lớn chứa cả hàng bộ lọc trên cùng */}
<Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 3 }}>

    {/* --- KHỐI TÌM KIẾM (BÊN TRÁI) --- */}
    {/* THAY ĐỔI Ở ĐÂY: Đặt chiều rộng cụ thể, ví dụ 450px */}
    <Box sx={{ width: { xs: '100%', md: 450 } }}>
        {/* 1. Tiêu đề in đậm */}
        <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
            Tìm kiếm sản phẩm
        </SoftTypography>

        {/* 2. Ô nhập liệu */}
        <TextField
            placeholder="Nhập tên hoặc mã sản phẩm "
            variant="outlined"
            fullWidth 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
           
        />
    </Box>

    {/* --- KHỐI LỌC GIÁ (BÊN PHẢI) --- */}
    {/* Khối này giữ nguyên */}
    <Box sx={{ width: { xs: '100%', md: 300 } }}>
        {/* 1. Tiêu đề in đậm cho bộ lọc giá */}
        <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
            Lọc theo giá
        </SoftTypography>

        {/* 2. Hiển thị khoảng giá đã chọn */}
        <Typography variant="body2" gutterBottom sx={{ textAlign: 'center', mt: 1 }}>
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
        </Typography>

        {/* 3. Thanh trượt giá */}
        <Slider
            value={priceRange}
            onChange={handlePriceChange}
            min={minMaxActualPrice[0]}
            max={minMaxActualPrice[1]}
            valueLabelDisplay="off"
            disableSwap
        />
    </Box>

</Box>

<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}> {/* Tăng gap lên một chút */}
  
  {/* Bộ lọc Danh mục */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Danh mục
    </SoftTypography>
    <Select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
    </Select>
  </Box>

  {/* Bộ lọc Thương hiệu */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Thương hiệu
    </SoftTypography>
    <Select
      value={selectedBrand}
      onChange={(e) => setSelectedBrand(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {brands.map((brand) => (<MenuItem key={brand} value={brand}>{brand}</MenuItem>))}
    </Select>
  </Box>

  {/* Bộ lọc Màu sắc */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Màu sắc
    </SoftTypography>
    <Select
      value={selectedColor}
      onChange={(e) => setSelectedColor(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {colors.map((color) => (<MenuItem key={color} value={color}>{color}</MenuItem>))}
    </Select>
  </Box>

  {/* Bộ lọc Chất liệu */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Chất liệu
    </SoftTypography>
    <Select
      value={selectedMaterial}
      onChange={(e) => setSelectedMaterial(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {materials.map((mat) => (<MenuItem key={mat} value={mat}>{mat}</MenuItem>))}
    </Select>
  </Box>

  {/* Bộ lọc Kích thước */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Kích thước
    </SoftTypography>
    <Select
      value={selectedSize}
      onChange={(e) => setSelectedSize(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {sizes.map((size) => (<MenuItem key={size} value={size}>{size}</MenuItem>))}
    </Select>
  </Box>

  {/* Bộ lọc Cổ áo */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Cổ áo
    </SoftTypography>
    <Select
      value={selectedCollar}
      onChange={(e) => setSelectedCollar(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {collars.map((collar) => (<MenuItem key={collar} value={collar}>{collar}</MenuItem>))}
    </Select>
  </Box>

  {/* Bộ lọc Tay áo */}
  <Box>
    <SoftTypography variant="button" fontWeight="bold" sx={{ mb: 0.5, display: 'block' }}>
      Tay áo
    </SoftTypography>
    <Select
      value={selectedSleeve}
      onChange={(e) => setSelectedSleeve(e.target.value)}
      sx={{ minWidth: 160, height: 40 }}
    >
      {sleeves.map((sleeve) => (<MenuItem key={sleeve} value={sleeve}>{sleeve}</MenuItem>))}
    </Select>
  </Box>

</Box>
                </SoftBox>

                {/* Bảng hiển thị sản phẩm */}
                {loading ? (
                    <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress color="info" />
                        <SoftTypography variant="body2" ml={2}>Đang tải sản phẩm...</SoftTypography>
                    </SoftBox>
                ) : error ? (
                    <SoftBox display="flex" justifyContent="center" alignItems="center" height="200px">
                        <SoftTypography variant="body2" color="error">{error}</SoftTypography>
                    </SoftBox>
                ) : (
                    <TableContainer component={Paper} sx={{ maxHeight: 500, overflowX: 'auto' }}>
                        <Table stickyHeader aria-label="sticky product table" sx={{ tableLayout: 'fixed', minWidth: 1500 }}>
                            
                                <TableRow>
                                    <TableCell align="center" sx={{ width: 120, fontWeight: 'bold' }}>Ảnh</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 150, fontWeight: 'bold' }}>Tên</TableCell>
                                    <TableCell align="left" sx={{ minWidth: 100, fontWeight: 'bold' }}>Mã SP</TableCell>
                                    <TableCell align="left" sx={{ minWidth: 120, fontWeight: 'bold' }}>Danh mục</TableCell>
                                    <TableCell align="left" sx={{ minWidth: 120, fontWeight: 'bold' }}>Thương hiệu</TableCell>
                                    <TableCell align="left" sx={{ minWidth: 120, fontWeight: 'bold' }}>Màu sắc</TableCell>
                                    <TableCell align="left" sx={{ minWidth: 120, fontWeight: 'bold' }}>Chất liệu</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Kích thước</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Cổ áo</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Tay áo</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Giá</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Số lượng</TableCell>
                                    <TableCell align="center" sx={{ minWidth: 120, fontWeight: 'bold' }}>Thao tác</TableCell>
                                </TableRow>
                        
                            <TableBody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.idChiTietSanPham} hover>
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
                                            <TableCell align="left" sx={{ width: 150 }}>{product.tenSanPham || 'N/A'}</TableCell>
                                            <TableCell align="left" sx={{ width: 120 }}>{product.maSanPham || 'N/A'}</TableCell>
                                            <TableCell align="left" sx={{ width: 120 }}>{product.danhMuc || 'N/A'}</TableCell>
                                            <TableCell align="left" sx={{ width: 120 }}>{product.thuongHieu || 'N/A'}</TableCell>
                                            <TableCell align="left" sx={{ width: 100 }}>{product.mauSac || 'N/A'}</TableCell>
                                            <TableCell align="left" sx={{ width: 100 }}>{product.chatLieu || 'N/A'}</TableCell>
                                            <TableCell align="center" sx={{ width: 80 }}>{product.kichThuoc || 'N/A'}</TableCell>
                                            <TableCell align="center" sx={{ width: 80 }}>{product.coAo || 'N/A'}</TableCell>
                                            <TableCell align="center" sx={{ width: 80 }}>{product.tayAo || 'N/A'}</TableCell>
                                            <TableCell align="right" sx={{ width: 120 }}>
                                                  {/* Kiểm tra nếu có giảm giá */}
                                                  {(product.phanTramGiam > 0 && product.giaTienSauKhiGiam < product.gia) ? (
                                                    <Box>
                                                      {/* Giá gốc bị gạch ngang */}
                                                      <SoftTypography
                                                        component="span" // Dùng span để không xuống dòng
                                                        variant="body2"
                                                        color="text"
                                                        sx={{ textDecoration: 'line-through', fontSize: '0.85rem' }}
                                                      >
                                                        {formatCurrency(product.gia)}
                                                      </SoftTypography>
                                                      {/* Giá sau khi giảm */}
                                                      <SoftTypography
                                                        variant="body2"
                                                        color="error"
                                                        fontWeight="bold"
                                                        sx={{ display: 'block' }} // Hiển thị trên một dòng mới
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
                                            <TableCell align="center" sx={{ width: 80 }}>{product.soLuongTonKho || 'N/A'}</TableCell>
                                            <TableCell align="center" sx={{ width: 100 }}>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    onClick={() => handleOpenConfirmation(product)}
                                                    sx={{ minWidth: 60, p: 0 }} // Đảm bảo nút không bị quá to
                                                >
                                                    CHỌN
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
            <ConfirmationModal
                open={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleConfirmSelection}
                product={selectedProduct}
                quantity={quantity}
                setQuantity={setQuantity}
            />
        </Dialog>
        
        
    );
}

// THÊM TOÀN BỘ KHỐI NÀY VÀO CUỐI FILE
ProductSelectionModal.propTypes = {
  // 'open' phải là một giá trị boolean (true/false) và là bắt buộc.
  open: PropTypes.bool.isRequired,

  // 'onClose' phải là một hàm và là bắt buộc.
  onClose: PropTypes.func.isRequired,

  // 'onSelectProduct' phải là một hàm và là bắt buộc.
  onSelectProduct: PropTypes.func.isRequired
};
export default ProductSelectionModal;