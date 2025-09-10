import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Package, ShoppingCart, CheckSquare, BookCopy, Database, Bot, Home, Settings, FileText, ScanLine, BarChart3, FolderKanban } from 'lucide-react';

const SidebarItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const renderNavItems = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <SidebarItem to="/admin/dashboard" icon={<Home size={20} />}>Tổng quan</SidebarItem>
            <SidebarItem to="/admin/user-management" icon={<Users size={20} />}>Quản lý người dùng</SidebarItem>
            <SidebarItem to="/admin/lesson-plan-templates" icon={<BookCopy size={20} />}>Khung chương trình</SidebarItem>
            <SidebarItem to="/admin/system-settings" icon={<Settings size={20} />}>Cấu hình hệ thống</SidebarItem>
            <SidebarItem to="/admin/revenue" icon={<BarChart3 size={20} />}>Doanh thu</SidebarItem>
          </>
        );
      case 'manager':
        return (
          <>
            <SidebarItem to="/manager/dashboard" icon={<Home size={20} />}>Tổng quan</SidebarItem>
            <SidebarItem to="/manager/packages" icon={<Package size={20} />}>Quản lý Gói</SidebarItem>
            <SidebarItem to="/manager/orders" icon={<ShoppingCart size={20} />}>Quản lý Đơn hàng</SidebarItem>
            <SidebarItem to="/manager/content-approval" icon={<CheckSquare size={20} />}>Phê duyệt</SidebarItem>
          </>
        );
      case 'teacher':
        return (
          <>
            <SidebarItem to="/dashboard" icon={<Home size={20} />}>Tổng quan</SidebarItem>
            <SidebarItem to="/teacher/lesson-plans" icon={<BookCopy size={20} />}>Kế hoạch bài học</SidebarItem>
            <SidebarItem to="/teacher/create-exam" icon={<FileText size={20} />}>Tạo Đề thi</SidebarItem>
            <SidebarItem to="/teacher/ocr-grading" icon={<ScanLine size={20} />}>Chấm bài OCR</SidebarItem>
            <SidebarItem to="/teacher/resources" icon={<FolderKanban size={20} />}>Tài nguyên</SidebarItem>
          </>
        );
      case 'staff':
              return (
                <>
                  <SidebarItem to="/staff/dashboard" icon={<Home size={20} />}>Tổng quan</SidebarItem>
                  <SidebarItem to="/staff/lesson-plans" icon={<BookCopy size={20} />}>Kế hoạch bài học</SidebarItem>
                  <SidebarItem to="/staff/question-bank" icon={<Database size={20} />}>Ngân hàng câu hỏi</SidebarItem>
                  <SidebarItem to="/staff/prompt-templates" icon={<Bot size={20} />}>Mẫu Prompt</SidebarItem>
                </>
              );
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r hidden md:block">
      <div className="h-full p-4"><nav className="space-y-1">{renderNavItems()}</nav></div>
    </aside>
  );
};

export default Sidebar;
