
export async function fetchVouchersAlternative(page, size, search, statusFilter) {
    try {
        const searchObject = {
            // Thêm các trường tìm kiếm phổ biến mà backend có thể mong đợi
            maPhieuGiamGia: search && search.trim() !== "" ? search.trim() : undefined,
            tenPhieu: search && search.trim() !== "" ? search.trim() : undefined,
        };
        
        // Xóa các trường undefined
        Object.keys(searchObject).forEach(key => {
            if (searchObject[key] === undefined) {
                delete searchObject[key];
            }
        });
        
        // Thêm bộ lọc trạng thái
        if (statusFilter && statusFilter !== "Tất cả") {
            const statusMap = {
                "Đang diễn ra": 1,
                "Đã kết thúc": 0,
                "Tạm dừng": 3,
                "Chưa bắt đầu": 2
            };
            
            if (statusMap.hasOwnProperty(statusFilter)) {
                searchObject.trangThai = statusMap[statusFilter];
            }
        }
        
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/findAll?page=${page}&size=${size}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchObject),
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu phiếu giảm giá');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phiếu giảm giá:", error);
        throw error;
    }
}
export async function updateStatustVoucher(id, data) {
    try {
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/updateStatus/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to add voucher");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}
export async function addVouchers(data) {
    try {
        const response = await fetch("http://localhost:8080/phieu_giam_gia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to add voucher");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}
export async function fetchOneVouchers(id) {
    try {
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch vouchers");
        }
        const data = await response.json();
        return data.data
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        return [];
    }
}
export async function updateVouchers(data) {
    try {
        const response = await fetch("http://localhost:8080/phieu_giam_gia", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to add voucher");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}
export async function sendMail(data) {
    try {
        const response = await fetch("http://localhost:8080/phieu_giam_gia/sendMail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to add voucher");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}
