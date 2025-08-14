import dayjs from "dayjs";

export async function loadThongKe() {
    try {
        const response = await fetch("http://localhost:8080/thong_ke", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // <-- Thêm dòng này!
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
        return null;
    }
}

export async function fetchThongKeAlternative(page, size, search, startDate, endDate) {
    try {
        
        const searchObject = {};
        if (search) {
            searchObject.boLocNgayTuanThangNam = search.trim();
        }
        if (startDate && endDate) {
            searchObject.tuNgay = dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss');
            searchObject.denNgay = dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss');
        }
        console.log(searchObject)
        const response = await fetch(`http://localhost:8080/thong_ke?page=${page}&size=${size}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchObject),
            credentials: "include", // <-- Thêm dòng này!
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
function formatDateToISO(date) {
    if (!date) return null;
    return date.toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
}

export async function loadBieuDo(check ,startDate,endDate) {
    try {
        let url = `http://localhost:8080/thong_ke/bieudo/${check}`;
        if (startDate && endDate) {
            const ngayBD = formatDateToISO(startDate);
            const ngayKt = formatDateToISO(endDate);
            url += `?ngayBD=${ngayBD}&ngayKt=${ngayKt}`;
        }
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // <-- Thêm dòng này!
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
        return null;
    }
}