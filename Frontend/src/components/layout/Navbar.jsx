import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 ml-64">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-600">Quản lý hệ thống</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            🔔
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-gray-700 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
