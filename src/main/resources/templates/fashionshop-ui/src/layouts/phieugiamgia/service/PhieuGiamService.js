// Lấy danh sách phiếu giảm giá với filter và phân trang (POST theo backend custom)
export async function fetchVouchersAlternative(page, size, search, statusFilter) {
    try {
        const searchObject = {};
        if (search && search.trim() !== "") {
            // Nếu backend tìm theo OR thì nên chỉ truyền 1 trường, nếu AND thì truyền cả hai
            searchObject.maPhieuGiamGia = search.trim();
            searchObject.tenPhieu = search.trim();
        }
        // Bộ lọc trạng thái
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
            // Có thể lấy thêm response json để lấy thông điệp lỗi chi tiết
            let errorMsg = 'Không thể lấy dữ liệu phiếu giảm giá';
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch {}
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
        // status nên là số nguyên, không phải object
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/updateStatus/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(status),
        });

        if (!response.ok) {
            let errorMsg = "Failed to update voucher status";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch {}
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
        });

        if (!response.ok) {
            let errorMsg = "Failed to add voucher";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch {}
            throw new Error(errorMsg);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error adding voucher:", error);
        return null;
    }
}

// Lấy 1 phiếu giảm giá theo id
export async function fetchOneVouchers(id) {
    try {
        const response = await fetch(`http://localhost:8080/phieu_giam_gia/${id}`);
        if (!response.ok) {
            let errorMsg = "Failed to fetch vouchers";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch {}
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
        });

        if (!response.ok) {
            let errorMsg = "Failed to update voucher";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch {}
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
export async function sendMail({ voucherId, emails }) {
    try {
        // Đảm bảo truyền đúng cấu trúc object mà backend yêu cầu
        const payload = {
            phieuGiamGiaVO: { id: voucherId },
            emails: emails
        };

        const response = await fetch("http://localhost:8080/phieu_giam_gia/sendMail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMsg = "Failed to send voucher mail";
            try {
                const err = await response.json();
                if (err && err.message) errorMsg = err.message;
            } catch {}
            throw new Error(errorMsg);
        }

        // Đọc response dạng text trước, phòng trường hợp body rỗng
        const text = await response.text();
        if (text) {
            const result = JSON.parse(text);
            return result;
        } else {
            // Nếu không có body, trả về kết quả mặc định
            return { success: true };
        }
    } catch (error) {
        console.error("Error sending voucher mail:", error);
        return null;
    }
}