// src/pages/Dashboard/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import RecentActivity from "../../components/Teacher/RecentActivity";
import SubjectFocus from "../../components/Teacher/SubjectFocus";
import StatCards from "../../components/Teacher/StatCards";
import { ToastStack } from "../../components/Teacher/Toasts";
import { useToasts } from "../../components/Teacher/useToasts";
// import TeacherHeader from "../../components/teacher/Header"; // nếu không dùng layout

import TeacherDataPanels from "./TeacherDataPanels"; // ⬅️ MỚI: phần CRUD gắn API
import { listLessonPlans } from "@/services/lessonPlans";
import { listExams } from "@/services/exams";
import { me } from "@/services/auth";
import AITools from "../../components/Teacher/AITools";

export default function TeacherDashboard() {
  const { toasts, push, remove } = useToasts();
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const onOpenTool = (tool) => {
    const map = {
      "lesson-plan": "Đang chuyển đến khu vực quản lý kế hoạch...",
      questionBank: "Đang mở Ngân hàng câu hỏi...",
      exercise: "Đang khởi động AI tạo bài tập...",
      test: "Đang mở công cụ tạo đề thi...",
      ocr: "Đang khởi động OCR chấm thi...",
    };
    push(map[tool] || "Đang mở...", "info");

    const panelIdMap = { "lesson-plan": "lesson-plan-panel", ocr: "ocr-panel", test: "exams-panel" };
    const panelId = panelIdMap[tool];

    if (panelId) {
      // cuộn tới khu vực OCR nếu có trên trang
      setTimeout(() => {
        const el = document.getElementById(panelId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  useEffect(() => {
    let mounted = true;
    // Load profile (for greeting) and counts in parallel
    me().then((u) => { if (mounted && u?.username) setUsername(u.username); }).catch(() => {});
    (async () => {
      try {
        setLoadingActivities(true);
        const [lp, exs] = await Promise.all([
          listLessonPlans().catch(() => []),
          listExams().catch(() => []),
        ]);
        if (!mounted) return;
        setStats([
          { label: "Lesson Plans", value: String(lp.length), gradient: "from-fuchsia-400 to-rose-500" },
          { label: "Đề thi đã tạo", value: String(exs.length), gradient: "from-emerald-400 to-teal-300" },
        ]);

        // Tạo hoạt động gần đây (ghép từ lesson plans + exams) và giữ nguyên style RecentActivity
        const relTime = (d) => {
          const diff = Date.now() - new Date(d).getTime();
          const s = Math.max(1, Math.round(diff / 1000));
          if (s < 60) return "vừa xong";
          const m = Math.round(s / 60);
          if (m < 60) return `${m} phút trước`;
          const h = Math.round(m / 60);
          if (h < 24) return `${h} giờ trước`;
          const day = Math.round(h / 24);
          if (day < 30) return `${day} ngày trước`;
          return new Date(d).toLocaleDateString("vi-VN");
        };

        const lpActivities = (Array.isArray(lp) ? lp : []).map((plan) => ({
          icon: "📘",
          color: "bg-blue-100",
          title: `Kế hoạch bài học: ${plan.title}`,
          time: relTime(plan.created_at || Date.now()),
          _date: new Date(plan.created_at || Date.now()).getTime(),
        }));
        const exActivities = (Array.isArray(exs) ? exs : []).map((exam) => ({
          icon: "📄",
          color: "bg-green-100",
          title: `Đề thi: ${exam.title}`,
          time: relTime(exam.created_at || Date.now()),
          _date: new Date(exam.created_at || Date.now()).getTime(),
        }));
        const combined = [...lpActivities, ...exActivities]
          .sort((a, b) => b._date - a._date)
          .slice(0, 5)
          .map((it) => { const r = { ...it }; delete r._date; return r; });
        setActivities(combined);
      } catch {
        // giữ mặc định trong StatCards
      } finally {
        setLoadingActivities(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <TeacherHeader /> */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Phần UI cũ của em */}
        <section className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Chào mừng trở lại{username ? ", " : ""}{username} 👋</h2>
          <p className="text-gray-600">Hôm nay là ngày tuyệt vời để tạo ra những bài học thú vị với AI</p>
        </section>

        <StatCards stats={stats || undefined} />

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <AITools onOpen={onOpenTool} />
            <section className="mt-6 rounded-xl bg-white p-6 shadow-lg">
              <h4 className="mb-4 font-semibold text-gray-900">📋 Hoạt động gần đây</h4>
              {loadingActivities ? (
                <div className="py-4 text-center text-gray-500">Đang tải…</div>
              ) : (
                <RecentActivity items={activities} />
              )}
            </section>
          </div>

          <aside className="lg:col-span-2">
            <SubjectFocus />
          </aside>
        </div>

        {/* ====== MỚI: Các bảng dữ liệu gọi API thật ====== */}
        <TeacherDataPanels />
      </div>
      <ToastStack toasts={toasts} onClose={remove} />
    </div>
  );
}
