import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <h1 className="text-white text-xl font-bold">⚛️ Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="mr-3">📊</span>
            <span className="font-medium">Tổng quan</span>
          </NavLink>

          <NavLink
            to="/admin/revenue"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="mr-3">💰</span>
            <span className="font-medium">Doanh thu</span>
          </NavLink>

          <NavLink
            to="/admin/user-reports"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="mr-3">👥</span>
            <span className="font-medium">Báo cáo người dùng</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
