import React, { useEffect, useState } from "react";
import { listLessonPlans } from "@/services/lessonPlans";
import { listExams } from "@/services/exams";

export default function RecentActivity({ items }) {
  const [internal, setInternal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items && items.length) return; // ưu tiên dữ liệu truyền từ ngoài
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [lp, exs] = await Promise.all([
          listLessonPlans().catch(() => []),
          listExams().catch(() => []),
        ]);
        if (!mounted) return;
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
        setInternal(combined);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [items]);

  const list = items?.length ? items : (internal || []);
  return (
    <div className="space-y-4">
      {loading && list.length === 0 ? (
        <div className="py-3 text-center text-gray-500">Đang tải…</div>
      ) : (
        list.map((x, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className={`${x.color} rounded-full p-2`}>
              <span className="text-sm" aria-hidden>{x.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{x.title}</p>
              <p className="text-xs text-gray-500">{x.time}</p>
            </div>
          </div>
        ))
      )}
      {(!loading && list.length === 0) && (
        <div className="py-3 text-center text-gray-500">Chưa có hoạt động nào gần đây.</div>
      )}
    </div>
  );
}
