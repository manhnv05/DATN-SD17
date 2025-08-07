/**
 * Đăng ký tài khoản khách hàng mới.
 * @param {{
 *   email: string,
 *   matKhau: string,
 *   tenKhachHang: string,
 *   sdt: string
 * }} param0
 * @returns {Promise<string>} // Trả về message thành công hoặc lỗi từ backend
 */
export async function signUp({ email, matKhau, tenKhachHang, sdt }) {
    const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            matKhau,
            tenKhachHang,
            sdt
        }),
        credentials: "include", // Nếu backend có set cookie, giữ lại (có thể không cần cho đăng ký)
    });

    let data;
    try {
        data = await response.json();
    } catch (e) {
        // Nếu backend trả về lỗi dạng text
        const error = await response.text();
        throw new Error(error || "Đăng ký thất bại!");
    }

    if (!response.ok) {
        throw new Error(data || "Đăng ký thất bại!"); // data thường là message
    }
    // Thành công: backend trả về "Đăng ký tài khoản thành công!"
    return data;
}