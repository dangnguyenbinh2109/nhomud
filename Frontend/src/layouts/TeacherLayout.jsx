// src/layouts/TeacherLayout.jsx
import { Outlet } from "react-router-dom";
import TeacherHeader from "@/components/Teacher/Header";

export default function TeacherLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <TeacherHeader />
      {/* chừa khoảng cho header fixed giáo viên */}
      <main className="flex-1 pt-[90px]">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
