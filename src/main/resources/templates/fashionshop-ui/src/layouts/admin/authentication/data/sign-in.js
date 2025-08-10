/**
 * Đăng nhập bằng username & password, trả về object dữ liệu backend trả về (có thể gồm: role, username, message, accessToken...)
 * @param {{ username: string, password: string }} param0
 * @returns {Promise<object>} // trả về toàn bộ object backend trả về
 */
export async function signIn({ username, password }) {
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

    // Trả về toàn bộ object backend trả về (role, username, message, accessToken, ...)
    return data;
}