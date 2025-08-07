import axios from "axios";

// Lấy baseURL từ biến môi trường, fallback sang localhost nếu không có
const BASE_URL = (process.env.REACT_APP_MAIN_URL || "http://localhost:8080").trim();

// Log baseURL khi khởi tạo để dễ kiểm tra môi trường dev/prod
console.log("[Axios] API BASE_URL:", BASE_URL);

// Nếu biến môi trường không set, cảnh báo
if (!process.env.REACT_APP_MAIN_URL) {
    console.warn("⚠️ REACT_APP_MAIN_URL is not set! Axios sẽ dùng http://localhost:8080 làm baseURL.");
}

// Khởi tạo instance axios chính dùng cho toàn app
const instanceAPIMain = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // <<-- Quan trọng: luôn gửi cookie JSESSIONID để backend nhận session!
});

// Nếu dùng fallback baseURL (localhost), log mỗi lần gọi request để nhắc nhở dev
if (!process.env.REACT_APP_MAIN_URL) {
    instanceAPIMain.interceptors.request.use((config) => {
        console.warn(
            "[Axios] Đang sử dụng fallback baseURL http://localhost:8080. Kiểm tra lại REACT_APP_MAIN_URL trong .env!"
        );
        return config;
    });
}

// (Tùy chọn) Response interceptor để tự động xử lý 401/403, ví dụ auto logout hoặc chuyển trang login
// instanceAPIMain.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             // TODO: logout user, xóa localStorage, điều hướng về login (nếu app có logic này)
//             // window.location.href = "/authentication/sign-in";
//         }
//         return Promise.reject(error);
//     }
// );

export default instanceAPIMain;