import React, { useEffect, useMemo, useState } from "react";
import { me } from "@/services/auth";

export default function TeacherHeader() {
  const [user, setUser] = useState(null);
  const username = user?.username || localStorage.getItem("username") || "Người dùng";
  const role = user?.role || localStorage.getItem("role") || "teacher";
  const initials = useMemo(() => {
    const name = String(username || "");
    const parts = name.trim().split(/\s+/);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
    return letters.toUpperCase();
  }, [username]);

  useEffect(() => {
    let mounted = true;
    me().then((u) => {
      if (mounted) setUser(u);
    }).catch(() => {
      // giữ nguyên localStorage fallback
    });
    return () => { mounted = false; };
  }, []);

  const roleLabel = {
    admin: "Quản trị viên",
    teacher: "Giáo viên",
    staff: "Nhân viên học vụ",
    manager: "Quản lý",
  }[role] || role;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] text-white shadow-lg"
      style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ height: 90 }}>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white/20 p-2"><span aria-hidden>🧠</span></div>
            <div>
              <h1 className="text-2xl font-bold">PlanbookAI</h1>
              <p className="text-sm opacity-90">Cổng công cụ AI cho giáo viên THPT</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg bg-white/20 p-2 hover:bg-white/30" aria-label="Thông báo">
              <span aria-hidden>🔔</span>
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-xs">3</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-indigo-500 font-bold">
                {initials}
              </div>
              <div>
                <p className="font-semibold">{username}</p>
                <p className="text-sm opacity-90">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
