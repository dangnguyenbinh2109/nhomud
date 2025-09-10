import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[90px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
