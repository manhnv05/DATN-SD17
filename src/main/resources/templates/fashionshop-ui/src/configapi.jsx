import axios from "axios";

// Log baseURL để kiểm tra khi chạy dev/build
console.log("API BASE URL:", process.env.REACT_APP_MAIN_URL);

// Nếu biến môi trường không có giá trị, cảnh báo để dễ debug
if (!process.env.REACT_APP_MAIN_URL) {
    console.warn("⚠️ REACT_APP_MAIN_URL is not set. Axios will not work correctly!");
}

const instanceAPIMain = axios.create({
    baseURL: process.env.REACT_APP_MAIN_URL?.trim() || "http://localhost:8080", // fallback nếu env bị thiếu
    timeout: 30000,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // <-- Quan trọng: Luôn gửi cookie
});

// Nếu chưa set biến môi trường, log mỗi lần request
if (!process.env.REACT_APP_MAIN_URL) {
    instanceAPIMain.interceptors.request.use((config) => {
        console.warn(
            "[AXIOS] Đang sử dụng fallback baseURL http://localhost:8080. Kiểm tra biến môi trường REACT_APP_MAIN_URL!"
        );
        return config;
    });
}

// (Tùy chọn) Thêm response interceptor để tự động xử lý 401/403 (nếu muốn)
// instanceAPIMain.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//             // Thực hiện logout hoặc điều hướng về trang login
//         }
//         return Promise.reject(error);
//     }
// );

export default instanceAPIMain;