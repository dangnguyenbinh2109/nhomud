import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import Home from "../pages/Home/index.jsx";
import AboutPage from "../pages/About/index.jsx";   // file này phải tồn tại
import LoginPage from "../pages/Auth/Login.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* Fallback để tránh trắng màn hình nếu gõ sai URL */}
        <Route path="*" element={<div className="p-6">404 — Trang không tồn tại</div>} />
      </Route>
    </Routes>
  );
}
