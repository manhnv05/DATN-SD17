export async function findAllPDDKH(page, size, data) {
    try {
        const response = await fetch(`http://localhost:8080/PhieuGiamGiaKhachHang/pddkh?page=${page}&size=${size}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", // <-- Thêm để giữ session/cookie khi gọi API sau đăng nhập
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

export async function deletePDDKH(id) {
    try {
        const response = await fetch(`http://localhost:8080/PhieuGiamGiaKhachHang/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // <-- Thêm để giữ session/cookie khi gọi API sau đăng nhập
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

export async function addPDDKH(data) {
    try {
        const response = await fetch("http://localhost:8080/PhieuGiamGiaKhachHang", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", // <-- Thêm để giữ session/cookie khi gọi API sau đăng nhập
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