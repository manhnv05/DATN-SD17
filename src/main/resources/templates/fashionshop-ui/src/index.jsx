
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { ToastContainer } from "react-toastify";

// Soft UI Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";
import ChatlingWidget from "./ChatlingWidget";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <App />
      <ToastContainer/>
      <ChatlingWidget />
    </SoftUIControllerProvider>
  </BrowserRouter>
);
