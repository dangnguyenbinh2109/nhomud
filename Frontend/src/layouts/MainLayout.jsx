import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* chừa khoảng cho header fixed */}
      <main className="flex-1 pt-[90px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
