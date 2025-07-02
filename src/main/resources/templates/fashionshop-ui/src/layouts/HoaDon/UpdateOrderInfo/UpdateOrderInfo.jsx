import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
// API để lấy danh sách địa chỉ của Việt Nam
const API_PROVINCES_URL = 'https://provinces.open-api.vn/api/';

/**
 * Component Modal để cập nhật thông tin đơn hàng.
 * Hoạt động hoàn toàn bằng React State, không phụ thuộc vào JavaScript của Bootstrap.
 * @param {object} props
 * @param {boolean} props.show - Bắt buộc. Prop từ cha để quyết định có hiển thị modal không.
 * @param {function} props.onClose - Bắt buộc. Hàm để gọi khi người dùng muốn đóng modal.
 * @param {string | number} props.orderId - ID của đơn hàng cần cập nhật.
 * @param {object} props.initialData - Dữ liệu ban đầu để điền vào form.
 * @param {function} props.onUpdateSuccess - Hàm để gọi sau khi cập nhật thành công.
 */
const UpdateOrderInfo = ({ show, onClose, orderId, initialData, onUpdateSuccess }) => {

    // --- STATE QUẢN LÝ FORM ---
    const [formData, setFormData] = useState({ tenNguoiNhan: '', soDienThoai: '', diaChiCuThe: '' });
    
    // --- STATE QUẢN LÝ CÁC DROPDOWN ĐỊA CHỈ ---
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    
    // --- STATE QUẢN LÝ TRẠNG THÁI LOADING ---
    const [isSubmitting, setIsSubmitting] = useState(false); // Khi nhấn nút submit
    const [isPreloading, setIsPreloading] = useState(false); // Khi modal đang tự động điền dữ liệu
    const [preloadStatusText, setPreloadStatusText] = useState(''); // Text hiển thị khi pre-loading

    // --- EFFECT CHÍNH: KHỞI TẠO VÀ ĐIỀN DỮ LIỆU KHI MODAL MỞ ---
    useEffect(() => {
        if (show) {
            const initializeForm = async () => {
                setIsPreloading(true);
                
                // Reset tất cả state về trạng thái sạch
                setFormData({ tenNguoiNhan: initialData?.tenNguoiNhan || '', soDienThoai: initialData?.soDienThoai || '' });
                setSelectedProvince(''); setSelectedDistrict(''); setSelectedWard('');
                setProvinces([]); setDistricts([]); setWards([]);

                const addressString = initialData?.diaChi || '';
                const reversedParts = addressString.split(',').map(p => p.trim()).reverse();
                
                let provinceName = '', districtName = '', wardName = '', diaChiCuThe = '';
                
                if (reversedParts.length >= 3) {
                    provinceName = reversedParts[0] || '';
                    districtName = reversedParts[1] || '';
                    wardName = reversedParts[2] || '';
                    const restParts = reversedParts.slice(3).reverse();
                    diaChiCuThe = restParts.join(', ');
                } else {
                    diaChiCuThe = addressString;
                }
                setFormData(prev => ({ ...prev, diaChiCuThe }));

                try {
                    setPreloadStatusText('Đang tải danh sách tỉnh/thành...');
                    const provincesResponse = await fetch(`${API_PROVINCES_URL}?depth=1`);
                    if (!provincesResponse.ok) throw new Error("Lỗi mạng khi tải tỉnh/thành.");
                    const provincesData = await provincesResponse.json();
                    setProvinces(provincesData);

                    if (!provinceName) { setIsPreloading(false); return; }
                    const foundProvince = provincesData.find(p => provinceName.includes(p.name));
                    if (foundProvince) {
                        setSelectedProvince(foundProvince.code);
                    } else {
                         setIsPreloading(false);
                    }
                } catch (error) {
                    console.error("Lỗi trong quá trình tự động điền địa chỉ:", error);
                    alert("Đã có lỗi xảy ra khi tải dữ liệu địa chỉ.");
                    setIsPreloading(false);
                }
            };
            initializeForm();
        }
    }, [show, initialData]);

    // EFFECT PHỤ: Tải huyện khi tỉnh thay đổi (bởi người dùng hoặc tự động)
    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([]);
            setSelectedDistrict('');
            return;
        }
        const fetchDistricts = async () => {
            if(!isPreloading) setPreloadStatusText('Đang tải danh sách quận/huyện...');
            if(!isPreloading) setIsPreloading(true);
            try {
                const response = await fetch(`${API_PROVINCES_URL}p/${selectedProvince}?depth=2`);
                const data = await response.json();
                setDistricts(data.districts || []);
                
                const reversedParts = (initialData?.diaChi || '').split(',').map(p => p.trim()).reverse();
                if (reversedParts.length > 1) {
                    const districtName = reversedParts[1] || '';
                    const foundDistrict = (data.districts || []).find(d => districtName.includes(d.name));
                    if (foundDistrict) setSelectedDistrict(foundDistrict.code);
                }
            } catch (error) { console.error("Lỗi tải huyện:", error); }
             finally { if(!isPreloading) setIsPreloading(false); }
        };
        fetchDistricts();
    }, [selectedProvince]);

    // EFFECT PHỤ: Tải xã khi huyện thay đổi (bởi người dùng hoặc tự động)
    useEffect(() => {
        if (!selectedDistrict) {
            setWards([]);
            setSelectedWard('');
            return;
        }
        const fetchWards = async () => {
             if(!isPreloading) setPreloadStatusText('Đang tải danh sách xã/phường...');
             if(!isPreloading) setIsPreloading(true);
            try {
                const response = await fetch(`${API_PROVINCES_URL}d/${selectedDistrict}?depth=2`);
                const data = await response.json();
                setWards(data.wards || []);
                
                const reversedParts = (initialData?.diaChi || '').split(',').map(p => p.trim()).reverse();
                 if (reversedParts.length > 2) {
                    const wardName = reversedParts[2] || '';
                    const foundWard = (data.wards || []).find(w => wardName.includes(w.name));
                    if (foundWard) setSelectedWard(foundWard.code);
                }
            } catch (error) { console.error("Lỗi tải xã:", error); }
            finally { setIsPreloading(false); }
        };
        fetchWards();
    }, [selectedDistrict]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const provinceName = provinces.find(p => p.code == selectedProvince)?.name || '';
        const districtName = districts.find(d => d.code == selectedDistrict)?.name || '';
        const wardName = wards.find(w => w.code == selectedWard)?.name || '';
        
        if (!formData.tenNguoiNhan || !formData.soDienThoai || !provinceName || !districtName || !wardName) {
            toast.warning("Vui lòng điền các trường bắt buộc (Tên, SĐT, Tỉnh, Huyện, Xã).");
            setIsSubmitting(false);
            return;
        }

        const fullAddress = [formData.diaChiCuThe, wardName, districtName, provinceName]
                            .filter(part => part)
                            .join(', ');

        const requestPayload = {
            tenKhachHang: formData.tenNguoiNhan,
            sdt: formData.soDienThoai,
            diaChi: fullAddress,
            ghiChu: "Cập nhật thông tin giao hàng"
        };
        
        try {
            const backendApiUrl = `http://localhost:8080/api/hoa-don/cap-nhat-thong-tin/${orderId}`;
            const response = await fetch(backendApiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Cập nhật thất bại');
            }
            toast.success("Cập nhật thành công !")
           
            if (onClose) onClose();
            if (onUpdateSuccess) onUpdateSuccess();
        } catch (error) {
            console.error("Lỗi khi submit:", error);
            toast.error(`Lỗi: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title"  >Thay đổi thông tin</h5>
                                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                            </div>
                            
                            <div className="modal-body position-relative">
                                {isPreloading && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                                        zIndex: 10, display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', borderRadius: 'inherit'
                                    }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2 mb-0 fw-bold">{preloadStatusText}</p>
                                    </div>
                                )}

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="tenNguoiNhan" className="form-label">Tên người nhận <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="tenNguoiNhan" name="tenNguoiNhan" value={formData.tenNguoiNhan} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="soDienThoai" className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                                        <input type="tel" className="form-control" id="soDienThoai" name="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="province" className="form-label">Tỉnh/thành phố <span className="text-danger">*</span></label>
                                        <select className="form-select" id="province" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} required>
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="district" className="form-label">Quận/huyện <span className="text-danger">*</span></label>
                                        <select className="form-select" id="district" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} required disabled={!selectedProvince}>
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="ward" className="form-label">Xã/phường <span className="text-danger">*</span></label>
                                        <select className="form-select" id="ward" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} required disabled={!selectedDistrict}>
                                            <option value="">-- Chọn Xã/Phường --</option>
                                            {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="diaChiCuThe" className="form-label">Địa chỉ cụ thể</label>
                                    <input type="text" className="form-control" id="diaChiCuThe" name="diaChiCuThe" placeholder="Số nhà, tên đường (nếu có)..." value={formData.diaChiCuThe} onChange={handleInputChange} />
                                </div>
                               
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting || isPreloading}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span className="ms-1">Đang lưu...</span>
                                        </>
                                    ) : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

UpdateOrderInfo.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  initialData: PropTypes.shape({
    tenNguoiNhan: PropTypes.string.isRequired,
    soDienThoai: PropTypes.string.isRequired,
    diaChi: PropTypes.string.isRequired,
  }).isRequired,
  onUpdateSuccess: PropTypes.func,
};

export default UpdateOrderInfo;