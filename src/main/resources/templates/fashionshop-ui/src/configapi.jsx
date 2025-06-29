import axios from "axios";

// Log baseURL để kiểm tra khi chạy dev/build
console.log("API BASE URL:", process.env.REACT_APP_MAIN_URL);

// Nếu biến môi trường không có giá trị, cảnh báo để dễ debug
if (!process.env.REACT_APP_MAIN_URL) {
    console.warn("⚠️ REACT_APP_MAIN_URL is not set. Axios will not work correctly!");
}

const instanceAPIMain = axios.create({
    baseURL: process.env.REACT_APP_MAIN_URL || "http://localhost:8080", // fallback nếu env bị thiếu
    timeout: 30000,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin" không cần thiết ở phía client, server phải set header này
    },
});

export default instanceAPIMain;