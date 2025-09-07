import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Chỉ redirect nếu:
    // - role = admin
    // - đang ở đúng path "/"
    if (role === "admin" && location.pathname === "/") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [role, location, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mt-[100px] min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
