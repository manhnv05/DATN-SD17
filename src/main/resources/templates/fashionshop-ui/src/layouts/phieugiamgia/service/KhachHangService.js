export async function fetchKhachHang(page, size, search) {
    try {
        const searchObject = {
            // Thêm các trường tìm kiếm phổ biến mà backend có thể mong đợi
            tenKhachHang: search && search.trim() !== "" ? search.trim() : undefined,
        };
        
        // Xóa các trường undefined
        Object.keys(searchObject).forEach(key => {
            if (searchObject[key] === undefined) {
                delete searchObject[key];
            }
        });
        const response = await fetch(`http://localhost:8080/KhachHang/findAll?page=${page}&size=${size}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchObject),
        });
        if (!response.ok) {
            throw new Error("Lỗi không load đc khách hàng");
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Lỗi không load đc khách hàng", error);
        return [];
    }
}