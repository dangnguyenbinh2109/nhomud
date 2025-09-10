import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`
    }
  >
    {children}
  </NavLink>
);

const Navbar = ({ role }) => {
  const renderNavItems = () => {
    switch (role) {
      case 'manager':
        return (
          <>
            <NavItem to="/manager/dashboard">Tổng quan</NavItem>
            <NavItem to="/manager/packages">Quản lý Gói</NavItem>
            <NavItem to="/manager/orders">Quản lý Đơn hàng</NavItem>
            <NavItem to="/manager/content-approval">Phê duyệt</NavItem>
          </>
        );
      case 'staff':
        return (
          <>
            <NavItem to="/staff/dashboard">Tổng quan</NavItem>
            <NavItem to="/staff/lesson-plans">Kế hoạch bài học</NavItem>
            <NavItem to="/staff/question-bank">Ngân hàng câu hỏi</NavItem>
            <NavItem to="/staff/prompt-templates">Mẫu Prompt</NavItem>
          </>
        );
      // Teacher và người dùng chưa đăng nhập sẽ không có nav item đặc biệt ở đây
      default:
        return <NavItem to="/">Trang chủ</NavItem>;
    }
  };

  return (
    <nav className="flex items-center space-x-4">
      {renderNavItems()}
    </nav>
  );
};

export default Navbar;
