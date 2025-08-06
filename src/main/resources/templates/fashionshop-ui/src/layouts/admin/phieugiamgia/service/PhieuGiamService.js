import dayjs from 'dayjs';

// Lấy danh sách phiếu giảm giá với filter động (phân trang, tìm kiếm, lọc trạng thái, ngày)
export async function fetchVouchersAlternative(page, size, search, startDate, endDate, statusFilter) {
    try {
        const searchObject = {};
        if (search && search.trim() !== "") {
            searchObject.maPhieuGiamGia = search.trim();
            searchObject.tenPhieu = search.trim();
        }
        if (startDate && endDate) {
            searchObject.ngayBatDau = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
            searchObject.ngayKetThuc = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');
        }
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
            credentials: "include", // <-- THÊM ĐỂ GIỮ SESSION
        });

        if (!response.ok) {
            let errorMsg = 'Không thể lấy dữ liệu phiếu giảm giá';
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phiếu giảm giá:", error);
        throw error;
    }
}

// Cập nhật trạng thái phiếu giảm giá (POST)
export async function updateStatustVoucher(id, status) {
    try {
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/updateStatus/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(status),
            credentials: "include",
        });

        if (!response.ok) {
            let errorMsg = "Failed to update voucher status";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating voucher status:", error);
        return null;
    }
}

// Thêm mới phiếu giảm giá
export async function addVouchers(data) {
    try {
        const response = await fetch("http://localhost:8080/phieu_giam_gia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            let errorMsg = "Failed to add voucher";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return error;
    }
}

// Lấy 1 phiếu giảm giá theo id
export async function fetchOneVouchers(id) {
    try {
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/${id}`, {
            credentials: "include",
        });
        if (!response.ok) {
            let errorMsg = "Failed to fetch vouchers";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        return null;
    }
}

// Cập nhật phiếu giảm giá
export async function updateVouchers(data) {
    try {
        const response = await fetch("http://localhost:8080/phieu_giam_gia", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            let errorMsg = "Failed to update voucher";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch { }
            throw new Error(errorMsg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating voucher:", error);
        return null;
    }
}

// Gửi mail thông báo phiếu giảm giá
export async function sendMail(data) {
    try {
        const response = await fetch("http://localhost:8080/phieu_giam_gia/sendMail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
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