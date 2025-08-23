/**
 * Đăng xuất người dùng: Gọi API backend để hủy phiên/cookie, đồng thời xóa toàn bộ thông tin user ở localStorage trên FE.
 * @returns {Promise<object>} // Trả về object có message từ backend, hoặc báo lỗi nếu thất bại.
 */
export async function logout() {
    try {
        // Gọi API logout để xóa refreshToken/cookie ở backend
        const response = await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include", // Đảm bảo gửi cookie lên backend để xóa
        });

        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            // Nếu không phải JSON thì cố gắng trả về object chứa message
            const text = await response.text();
            data = { message: text || "Đăng xuất thành công!" };
        }

        if (!response.ok) {
            throw new Error(data?.message || "Đăng xuất thất bại!");
        }

        // Xóa toàn bộ thông tin đăng nhập khỏi localStorage trên FE
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        // Bạn có thể xóa thêm các key khác liên quan user nếu có

        // Đảm bảo trả ra object có message
        return typeof data === "object" ? data : { message: data };
    } catch (error) {
        // Trả về thông báo lỗi chuẩn
        throw new Error(error?.message || "Đăng xuất thất bại!");
    }
}