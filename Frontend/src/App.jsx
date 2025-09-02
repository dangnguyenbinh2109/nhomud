import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang dùng chung Header/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* thêm các trang khác muốn có header/footer ở đây */}
        </Route>

        {/* Trang không cần Header/Footer (vd: Login) */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div className="p-6">Not found</div>} />
      </Routes>
    </Router>
  );
}
