// src/context/CartContext.js
import React, { createContext, useState, useContext,useEffect } from 'react';
import axios from "axios";
// 1. Tạo Context object
const CartContext = createContext();

// 2. Tạo component Provider (Nơi cung cấp dữ liệu)
export const CartProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState("testcart"); // Quản lý ID giỏ hàng tại đây
 useEffect(() => {
    if (!cartId) {
      setIsLoading(false); // Nếu không có cartId, ngừng loading
      return;
    };

    const apiUrl = `http://localhost:8080/api/v1/cart/${cartId}`;

    const fetchCartItems = async () => {
      setIsLoading(true); // Bắt đầu loading mỗi khi fetch
      try {
        const response = await axios.get(apiUrl);
        const formattedData = response.data.map((item) => ({
          id: item.idChiTietSanPham,
          name: item.tenSanPham,
          price: item.donGia,
          quantity: item.soLuong,
          size: item.tenKichCo,
          color: item.tenMauSac,
          listUrlImage: item.hinhAnh || [],
          image: (item.hinhAnh && item.hinhAnh[0]) || "https://i.imgur.com/G5g066E.png",
        }));
        setCartItems(formattedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng trong Context:", error);
        setCartItems([]);
      } finally {
        setIsLoading(false); // <--- LUÔN TẮT LOADING SAU KHI FETCH XONG
      }
    };

    fetchCartItems();
  }, [cartId]);
  // Dữ liệu và hàm sẽ được cung cấp cho toàn ứng dụng
  const value = {
    cartItems,
    setCartItems,
    cartId,
    setCartId,
     isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Tạo một hook tùy chỉnh để dễ dàng sử dụng context
export const useCart = () => {
  return useContext(CartContext);
  CartProvider.propTypes = {
  children: PropTypes.node.isRequired, // hoặc PropTypes.element, tùy bạn
};
};