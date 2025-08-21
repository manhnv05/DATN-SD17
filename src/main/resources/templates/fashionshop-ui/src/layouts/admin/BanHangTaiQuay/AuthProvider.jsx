// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types"; 
// Tạo Context
const AuthContext = createContext(null);

// Tạo Component Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State để biết đang tải dữ liệu lần đầu

  // Tách hàm fetchCurrentUser ra ngoài để tái sử dụng
  // Dùng useCallback để tối ưu, tránh tạo lại hàm khi component re-render
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/auth/me", {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      // Nếu có lỗi (chưa đăng nhập), set user là null
      setUser(null);
    } finally {
      // Chỉ set loading là false ở lần fetch đầu tiên để màn hình không bị "nháy"
      if (loading) {
        setLoading(false);
      }
    }
  }, [loading]); // Phụ thuộc vào `loading`

  // 1. useEffect này để tải dữ liệu người dùng khi trang được mở lần đầu
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // 2. useEffect này để lắng nghe sự kiện khi người dùng quay lại tab
  useEffect(() => {
    // Khi người dùng quay lại tab này, gọi lại hàm fetchCurrentUser
    window.addEventListener('focus', fetchCurrentUser);

    // Dọn dẹp listener khi component bị unmount (rời khỏi trang)
    return () => {
      window.removeEventListener('focus', fetchCurrentUser);
    };
  }, [fetchCurrentUser]);

  // Giá trị mà Provider sẽ cung cấp cho các component con
  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
// Tạo Custom Hook để các component khác sử dụng cho tiện
export const useAuth = () => {
  return useContext(AuthContext);
};