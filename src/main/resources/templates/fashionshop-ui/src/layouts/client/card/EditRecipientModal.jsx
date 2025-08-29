import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    Autocomplete,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

// --- GHN API Configuration ---
const GHN_API_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = "03b71be1-6891-11f0-9e03-7626358ab3e0"; // Replace with your actual token
const ghnApi = axios.create({
    baseURL: GHN_API_BASE_URL,
    headers: {
        token: GHN_TOKEN,
        "Content-Type": "application/json",
    },
});

// --- Helper Functions ---
function tachDiaChi(diaChi = "") {
    if (!diaChi) return { chiTiet: '', xa: '', huyen: '', tinh: '' };
    const parts = diaChi.split(',').map(part => part.trim());
    // Handles cases with fewer than 4 parts by providing empty strings
    return {
        chiTiet: parts[0] || '',
        xa: parts[1] || '',
        huyen: parts[2] || '',
        tinh: parts[3] || ''
    };
}

const normalizeString = (str = "") => {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[\s,.-]|(thành phố|tỉnh|quận|huyện|phường|xã|thị xã|thị trấn)/g, "");
};


const EditRecipientModal = ({ open, onClose, recipientData, onSave }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingProvinces, setIsFetchingProvinces] = useState(true);

    const [form, setForm] = useState({
        tenKhachHang: "",
        sdt: "",
        diaChi: "", // This will hold only the specific part of the address
        province: null,
        district: null,
        ward: null,
    });

    // --- Effects for managing address data ---

    // 1. Fetch provinces from GHN when the component mounts
    useEffect(() => {
        const fetchProvinces = async () => {
            setIsFetchingProvinces(true);
            try {
                const response = await ghnApi.get("/master-data/province");
                if (response.data?.data) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
                toast.error("Không thể tải danh sách tỉnh/thành phố.");
            } finally {
                setIsFetchingProvinces(false);
            }
        };
        fetchProvinces();
    }, []);

    // 2. Populate form and auto-select address when modal opens with data
    useEffect(() => {
        if (open && recipientData && provinces.length > 0) {
            const addressParts = tachDiaChi(recipientData.diaChi);
            
            setForm({
                tenKhachHang: recipientData.tenKhachHang || "",
                sdt: recipientData.sdt || "",
                diaChi: addressParts.chiTiet || "",
                province: null, district: null, ward: null,
            });

            if (addressParts.tinh) {
                loadAddressFromData(addressParts);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, recipientData, provinces]);

    // 3. Fetch districts when a province is selected by the user
    useEffect(() => {
        if (!form.province) {
            setDistricts([]);
            setWards([]);
            setForm(prev => ({ ...prev, district: null, ward: null }));
            return;
        }
        
        const fetchDistricts = async () => {
            try {
                const response = await ghnApi.get("/master-data/district", {
                    params: { province_id: form.province.ProvinceID },
                });
                setDistricts(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching districts:", error);
                toast.error("Không thể tải danh sách quận/huyện.");
            }
        };
        fetchDistricts();
    }, [form.province]);

    // 4. Fetch wards when a district is selected by the user
    useEffect(() => {
        if (!form.district) {
            setWards([]);
            setForm(prev => ({ ...prev, ward: null }));
            return;
        }

        const fetchWards = async () => {
            try {
                const response = await ghnApi.get("/master-data/ward", {
                    params: { district_id: form.district.DistrictID },
                });
                setWards(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching wards:", error);
                toast.error("Không thể tải danh sách phường/xã.");
            }
        };
        fetchWards();
    }, [form.district]);


    // --- Core Logic Functions ---

    const loadAddressFromData = async (addressParts) => {
        setIsLoading(true);
        try {
            // Find Province
            const provinceObj = provinces.find(p => 
                normalizeString(p.ProvinceName).includes(normalizeString(addressParts.tinh))
            );
            if (!provinceObj) {
                toast.warn(`Không tìm thấy tỉnh/thành phố: "${addressParts.tinh}"`);
                return;
            }
            setForm(prev => ({ ...prev, province: provinceObj }));

            // Fetch and Find District
            const districtResponse = await ghnApi.get("/master-data/district", {
                params: { province_id: provinceObj.ProvinceID },
            });
            const districtsData = districtResponse.data?.data || [];
            setDistricts(districtsData);
            const districtObj = districtsData.find(d => 
                normalizeString(d.DistrictName).includes(normalizeString(addressParts.huyen))
            );
            if (!districtObj) {
                toast.warn(`Không tìm thấy quận/huyện: "${addressParts.huyen}"`);
                return;
            }
            setForm(prev => ({ ...prev, district: districtObj }));

            // Fetch and Find Ward
            const wardResponse = await ghnApi.get("/master-data/ward", {
                params: { district_id: districtObj.DistrictID },
            });
            const wardsData = wardResponse.data?.data || [];
            setWards(wardsData);
            const wardObj = wardsData.find(w => 
                normalizeString(w.WardName).includes(normalizeString(addressParts.xa))
            );
            if (wardObj) {
                setForm(prev => ({ ...prev, ward: wardObj }));
            } else {
                 toast.warn(`Không tìm thấy phường/xã: "${addressParts.xa}"`);
            }
        } catch (error) {
            console.error("Error auto-loading address:", error);
            toast.warn("Không thể tự động tìm thấy địa chỉ chi tiết.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
        if (!form.tenKhachHang.trim() || !form.sdt.trim() || !form.diaChi.trim()) {
            toast.error("Vui lòng nhập đầy đủ tên, SĐT và địa chỉ cụ thể.");
            return;
        }
        if (!phoneRegex.test(form.sdt.trim())) {
            toast.error("Định dạng số điện thoại không hợp lệ.");
            return;
        }
        if (!form.province || !form.district || !form.ward) {
            toast.error("Vui lòng chọn đầy đủ Tỉnh, Huyện và Xã.");
            return;
        }

        const fullAddress = `${form.diaChi}, ${form.ward.WardName}, ${form.district.DistrictName}, ${form.province.ProvinceName}`;
        
        const savedData = {
            tenKhachHang: form.tenKhachHang,
            sdt: form.sdt,
            diaChi: fullAddress, // Return the full, reconstructed address
        };
        
        onSave(savedData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Sửa thông tin người nhận</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense" label="Tên người nhận" name="tenKhachHang" fullWidth
                    value={form.tenKhachHang} onChange={handleChange} required
                />
                <TextField
                    margin="dense" label="Số điện thoại" name="sdt" fullWidth
                    value={form.sdt} onChange={handleChange} required
                />
                <TextField
                    margin="dense" label="Địa chỉ cụ thể" name="diaChi" fullWidth
                    value={form.diaChi} onChange={handleChange}
                    placeholder="Số nhà, tên đường..." required
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                    <Autocomplete
                        options={provinces}
                        getOptionLabel={(opt) => opt?.ProvinceName || ""}
                        value={form.province}
                        onChange={(e, val) => setForm(prev => ({ ...prev, province: val, district: null, ward: null }))}
                        isOptionEqualToValue={(opt, val) => opt?.ProvinceID === val?.ProvinceID}
                        renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố *" />}
                        fullWidth
                        loading={isFetchingProvinces}
                        disabled={isLoading || isFetchingProvinces}
                    />
                    <Autocomplete
                        options={districts}
                        getOptionLabel={(opt) => opt?.DistrictName || ""}
                        value={form.district}
                        onChange={(e, val) => setForm(prev => ({ ...prev, district: val, ward: null }))}
                        isOptionEqualToValue={(opt, val) => opt?.DistrictID === val?.DistrictID}
                        disabled={!form.province || isLoading}
                        renderInput={(params) => <TextField {...params} label="Quận / Huyện *" />}
                        fullWidth
                    />
                    <Autocomplete
                        options={wards}
                        getOptionLabel={(opt) => opt?.WardName || ""}
                        value={form.ward}
                        onChange={(e, val) => setForm(prev => ({ ...prev, ward: val }))}
                        isOptionEqualToValue={(opt, val) => opt?.WardCode === val?.WardCode}
                        disabled={!form.district || isLoading}
                        renderInput={(params) => <TextField {...params} label="Phường / Xã *" />}
                        fullWidth
                    />
                </Stack>
                {isLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            Đang tự động điền địa chỉ...
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} disabled={isLoading}>Hủy</Button>
                <Button variant="contained" onClick={handleSave} disabled={isLoading}>
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditRecipientModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    recipientData: PropTypes.shape({
        tenKhachHang: PropTypes.string,
        sdt: PropTypes.string,
        diaChi: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
};

export default EditRecipientModal;
