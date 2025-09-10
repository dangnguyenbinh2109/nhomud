import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Navbar />
        <main className="p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
