
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "layouts/client/card/CartProvider";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <CartProvider>
      <App />
      </CartProvider>
      <ToastContainer/>
    </SoftUIControllerProvider>
  </BrowserRouter>
);
