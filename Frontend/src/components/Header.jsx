// src/components/Header.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Về chúng tôi", href: "/about" },
  { name: "Sản phẩm", href: "/lession" },
  { name: "Báo giá", href: "/contact" },
  { name: "Hướng dẫn", href: "/" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }) =>
    `relative px-1 transition-colors ${
      isActive
        ? "text-blue-700 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-blue-700"
        : "text-gray-700 hover:text-blue-700"
    }`;

  return (
    <header className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between" style={{ height: "90px" }}>
          <Link to="/" className="flex items-center gap-3">
            {/* logo nằm ở public/images/logo.png */}
            <img src="/images/logo.png" alt="PlanbookAI" className="h-[72px] w-auto" />
            <span className="sr-only">PlanbookAI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <NavLink key={item.href} to={item.href} className={linkClass}>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 bg-[#1b588f] text-white hover:scale-110 transition"
            >
              Đăng nhập
            </Link>

            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border"
              onClick={() => setOpen((v) => !v)}
              aria-label="Mở menu"
            >
              ☰
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink key={item.href} to={item.href} className={linkClass}>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
