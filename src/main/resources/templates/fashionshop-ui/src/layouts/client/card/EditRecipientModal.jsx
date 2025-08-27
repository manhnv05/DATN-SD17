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
} from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import {
    cartItem,
    SIZE_OPTIONS,
    PRIMARY_BLUE,
    WHITE,
    LIGHT_BLUE_BG,
    BORDER_COLOR,
    DISABLED_BG,
    MAIN_TEXT_COLOR,
} from "../order/constants";
import { toast } from "react-toastify";

const GHN_API_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = "03b71be1-6891-11f0-9e03-7626358ab3e0";
const GHN_SHOP_ID = 5908591;

const ghnApi = axios.create({
    baseURL: GHN_API_BASE_URL,
    headers: {
        token: GHN_TOKEN,
        "Content-Type": "application/json",
    },
});

function tachDiaChi(diaChi) {
    // Tách chuỗi theo dấu phẩy và loại bỏ khoảng trắng thừa
    const parts = diaChi.split(',').map(part => part.trim());

    // Trả về đối tượng với các phần địa chỉ
    return {
        chiTiet: parts[0] || '',
        xa: parts[1] || '',
        huyen: parts[2] || '',
        tinh: parts[3] || ''
    };
}

const EditRecipientModal = ({ open, onClose, recipientData, onSave }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        tenKhachHang: "",
        sdt: "",
        diaChi: "",
        province: null,
        district: null,
        ward: null,
    });

    // Hàm tìm và set địa chỉ từ dữ liệu có sẵn
    const loadAddressFromData = async (addressParts) => {
        if (!addressParts.tinh || !provinces.length) return;
        
        setIsLoading(true);
        
        try {
            // Tìm province
            const provinceObj = provinces.find(
                (p) => p.ProvinceName.toLowerCase().includes(addressParts.tinh.toLowerCase()) ||
                       addressParts.tinh.toLowerCase().includes(p.ProvinceName.toLowerCase())
            );

            if (provinceObj) {
                // Set province
                setForm((prev) => ({ ...prev, province: provinceObj }));

                // Load districts
                const districtResponse = await ghnApi.get("/master-data/district", {
                    params: { province_id: provinceObj.ProvinceID },
                });

                if (districtResponse.data?.data) {
                    const districtsData = districtResponse.data.data;
                    setDistricts(districtsData);

                    // Tìm district
                    const districtObj = districtsData.find(
                        (d) => d.DistrictName.toLowerCase().includes(addressParts.huyen.toLowerCase()) ||
                               addressParts.huyen.toLowerCase().includes(d.DistrictName.toLowerCase())
                    );

                    if (districtObj) {
                        // Set district
                        setForm((prev) => ({ ...prev, district: districtObj }));

                        // Load wards
                        const wardResponse = await ghnApi.get("/master-data/ward", {
                            params: { district_id: districtObj.DistrictID },
                        });

                        if (wardResponse.data?.data) {
                            const wardsData = wardResponse.data.data;
                            setWards(wardsData);

                            // Tìm ward
                            const wardObj = wardsData.find(
                                (w) => w.WardName.toLowerCase().includes(addressParts.xa.toLowerCase()) ||
                                       addressParts.xa.toLowerCase().includes(w.WardName.toLowerCase())
                            );

                            if (wardObj) {
                                setForm((prev) => ({ ...prev, ward: wardObj }));
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error loading address:", error);
            toast.error("Có lỗi khi tải địa chỉ");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProvinceChange = (event, value) => {
        setForm((prev) => ({ ...prev, province: value, district: null, ward: null }));
    };

    const handleDistrictChange = (event, value) => {
        setForm((prev) => ({ ...prev, district: value, ward: null }));
    };

    const handleWardChange = (event, value) => {
        setForm((prev) => ({ ...prev, ward: value }));
    };

    // 1. Lấy provinces từ GHN khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await ghnApi.get("/master-data/province");
                if (response.data?.data) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
                toast.error("Không thể tải danh sách tỉnh/thành phố.");
            }
        };
        fetchProvinces();
    }, []);

    // 2. Load dữ liệu địa chỉ khi modal mở và có recipientData
    useEffect(() => {
        if (open && recipientData && provinces.length > 0) {
            const addressParts = tachDiaChi(recipientData.diaChi);
            
            // Set các field cơ bản
            setForm({
                tenKhachHang: recipientData.tenKhachHang || "",
                sdt: recipientData.sdt || "",
                diaChi: addressParts.chiTiet || "",
                province: null,
                district: null,
                ward: null,
            });

            // Load địa chỉ từ dữ liệu
            if (addressParts.tinh) {
                loadAddressFromData(addressParts);
            }
        }
    }, [open, recipientData, provinces]);

    // 3. Reset form khi đóng modal
    useEffect(() => {
        if (!open) {
            setForm({
                tenKhachHang: "",
                sdt: "",
                diaChi: "",
                province: null,
                district: null,
                ward: null,
            });
            setDistricts([]);
            setWards([]);
        }
    }, [open]);

    // 4. Load districts khi province thay đổi (từ user interaction)
    useEffect(() => {
        if (form.province && !isLoading) {
            const fetchDistricts = async () => {
                try {
                    const response = await ghnApi.get("/master-data/district", {
                        params: { province_id: form.province.ProvinceID },
                    });
                    if (response.data?.data) {
                        setDistricts(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching districts:", error);
                    toast.error("Không thể tải danh sách quận/huyện.");
                }
            };
            fetchDistricts();
        } else if (!form.province) {
            setDistricts([]);
            setForm((prev) => ({ ...prev, district: null, ward: null }));
            setWards([]);
        }
    }, [form.province, isLoading]);

    // 5. Load wards khi district thay đổi (từ user interaction)
    useEffect(() => {
        if (form.district && !isLoading) {
            const fetchWards = async () => {
                try {
                    const response = await ghnApi.get("/master-data/ward", {
                        params: { district_id: form.district.DistrictID },
                    });
                    if (response.data?.data) {
                        setWards(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching wards:", error);
                    toast.error("Không thể tải danh sách phường/xã.");
                }
            };
            fetchWards();
        } else if (!form.district) {
            setWards([]);
            setForm((prev) => ({ ...prev, ward: null }));
        }
    }, [form.district, isLoading]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        // Validate form trước khi save
        if (!form.tenKhachHang.trim()) {
            toast.error("Vui lòng nhập tên người nhận");
            return;
        }
        if (!form.sdt.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }
        if (!form.province || !form.district || !form.ward) {
            toast.error("Vui lòng chọn đầy đủ địa chỉ");
            return;
        }

        // Tạo địa chỉ đầy đủ
        const fullAddress = `${form.diaChi}, ${form.ward.WardName}, ${form.district.DistrictName}, ${form.province.ProvinceName}`;
        
        const savedData = {
            ...form,
            diaChi: fullAddress
        };
        
        onSave(savedData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Sửa thông tin người nhận</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Tên người nhận"
                    name="tenKhachHang"
                    fullWidth
                    value={form.tenKhachHang}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    label="Số điện thoại"
                    name="sdt"
                    fullWidth
                    value={form.sdt}
                    onChange={handleChange}
                    required
                />
                
                <TextField
                    margin="dense"
                    label="Địa chỉ cụ thể"
                    name="diaChi"
                    fullWidth
                    value={form.diaChi}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường..."
                    required
                />

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Chọn địa chỉ:
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={MAIN_TEXT_COLOR}
                            sx={{ mb: 0.5 }}
                        >
                            Tỉnh / Thành phố *
                        </Typography>
                        <Autocomplete
                            options={provinces}
                            getOptionLabel={(opt) => opt?.ProvinceName || ""}
                            value={form.province}
                            onChange={handleProvinceChange}
                            isOptionEqualToValue={(opt, val) => opt?.ProvinceID === val?.ProvinceID}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Chọn tỉnh/thành phố"
                                    size="small"
                                    sx={{ bgcolor: WHITE, borderRadius: 1 }}
                                />
                            )}
                            loading={provinces.length === 0}
                            disabled={isLoading}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={MAIN_TEXT_COLOR}
                            sx={{ mb: 0.5 }}
                        >
                            Quận / Huyện *
                        </Typography>
                        <Autocomplete
                            options={districts}
                            getOptionLabel={(opt) => opt?.DistrictName || ""}
                            value={form.district}
                            onChange={handleDistrictChange}
                            isOptionEqualToValue={(opt, val) => opt?.DistrictID === val?.DistrictID}
                            disabled={!form.province || isLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Chọn quận/huyện"
                                    size="small"
                                    sx={{ bgcolor: WHITE, borderRadius: 1 }}
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color={MAIN_TEXT_COLOR}
                            sx={{ mb: 0.5 }}
                        >
                            Phường / Xã *
                        </Typography>
                        <Autocomplete
                            options={wards}
                            getOptionLabel={(opt) => opt?.WardName || ""}
                            value={form.ward}
                            onChange={handleWardChange}
                            isOptionEqualToValue={(opt, val) => opt?.WardCode === val?.WardCode}
                            disabled={!form.district || isLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Chọn phường/xã"
                                    size="small"
                                    sx={{ bgcolor: WHITE, borderRadius: 1 }}
                                />
                            )}
                        />
                    </Box>
                </Stack>
                
                {isLoading && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        Đang tải địa chỉ...
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Hủy
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleSave}
                    disabled={isLoading}
                >
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