import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'manager':
        return '/manager/dashboard';
      case 'teacher':
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              PlanbookAI
            </Link>
          </div>

          {/* Navbar */}
          <div className="hidden md:block">
            <Navbar role={user?.role} />
          </div>

          {/* User Menu / Login Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div>
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <span className="font-semibold mr-2 capitalize">{user.username}</span>
                    <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><LayoutDashboard className="mr-2 h-4 w-4" />Bảng điều khiển</Link>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><LogOut className="mr-2 h-4 w-4" />Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Đăng nhập</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
