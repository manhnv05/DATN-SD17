// src/context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Tạo Context object
const CartContext = createContext();

// 2. Tạo component Provider (Nơi cung cấp dữ liệu)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState("testcart"); // Quản lý ID giỏ hàng tại đây

  // Dữ liệu và hàm sẽ được cung cấp cho toàn ứng dụng
  const value = {
    cartItems,
    setCartItems,
    cartId,
    setCartId
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Tạo một hook tùy chỉnh để dễ dàng sử dụng context
export const useCart = () => {
  return useContext(CartContext);
};