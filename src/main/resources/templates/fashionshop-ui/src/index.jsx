
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./layouts/admin/BanHangTaiQuay/AuthProvider.jsx";
// Soft UI Dashboard React Context Provider
import ChatlingWidget from "ChatlingWidget.js";
import { SoftUIControllerProvider } from "context";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <AuthProvider>
        <App />
        <ToastContainer />
        <ChatlingWidget />
      </AuthProvider>
    </SoftUIControllerProvider>
  </BrowserRouter>
);
