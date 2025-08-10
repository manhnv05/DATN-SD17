export async function logout() {
    const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
    });

    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        throw new Error(typeof data === "object" ? (data?.message || "Đăng xuất thất bại!") : data || "Đăng xuất thất bại!");
    }
    return data;
}