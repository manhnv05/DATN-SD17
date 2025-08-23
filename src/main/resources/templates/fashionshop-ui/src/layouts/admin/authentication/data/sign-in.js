/**
 * Đăng nhập bằng username & password, trả về object dữ liệu backend trả về (có thể gồm: role, username, message, accessToken, id...)
 * @param {{ username: string, password: string }} param0
 * @returns {Promise<object>} // trả về toàn bộ object backend trả về
 */
export async function signIn({ username, password }) {
    // Gửi request đăng nhập đến backend
    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            username,
            password
        }),
        credentials: "include", // <--- Quan trọng để giữ session/cookie!
    });

    let data;
    try {
        data = await response.json();
    } catch (e) {
        // Nếu backend trả về lỗi dạng text
        const error = await response.text();
        throw new Error(error || "Đăng nhập thất bại!");
    }

    if (!response.ok) {
        // Nếu backend trả lỗi dạng JSON
        throw new Error(data?.message || "Đăng nhập thất bại!");
    }

    // Optional: Lưu thông tin user vào localStorage để FE giữ phiên (có thể chuyển đoạn này ra ngoài)
    if (data) {
        if (data.role) localStorage.setItem("role", data.role);
        if (data.username) localStorage.setItem("username", data.username);
        if (data.id !== undefined && data.id !== null) localStorage.setItem("userId", data.id);
        if (data.email) localStorage.setItem("email", data.email);
        if (data.avatar) localStorage.setItem("avatar", data.avatar);
        // Nếu backend trả accessToken và bạn muốn lưu (cân nhắc bảo mật)
        //if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
    }

    // Trả về toàn bộ object backend trả về (role, username, message, accessToken, id, ...)
    return data;
}