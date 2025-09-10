import React, { useEffect, useState } from "react";
import { listExams } from "@/services/exams";
import { listLessonPlans } from "@/services/lessonPlans";

export default function StatCards({ stats }) {
  const [internal, setInternal] = useState(null);

  useEffect(() => {
    if (stats && stats.length) return; // ưu tiên props từ ngoài
    let mounted = true;
    (async () => {
      try {
        const [lp, exs] = await Promise.all([
          listLessonPlans().catch(() => []),
          listExams().catch(() => []),
        ]);
        if (!mounted) return;
        setInternal([
          { label: "Lesson Plans", value: String(lp.length || 0), gradient: "from-fuchsia-400 to-rose-500" },
          { label: "Đề thi đã tạo", value: String(exs.length || 0), gradient: "from-emerald-400 to-teal-300" },
          { label: "Bài đã chấm", value: "—", gradient: "from-pink-400 to-yellow-300" },
        ]);
      } catch {
        // fall back below
      }
    })();
    return () => { mounted = false; };
  }, [stats]);

  const defaultStats = [
    { label: "Lesson Plans", value: "—", gradient: "from-fuchsia-400 to-rose-500" },
    { label: "Đề thi đã tạo", value: "—", gradient: "from-emerald-400 to-teal-300" },
    { label: "Bài đã chấm", value: "—", gradient: "from-pink-400 to-yellow-300" },
  ];

  const list = stats?.length ? stats : (internal || defaultStats);
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {list.map((s) => (
        <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-xl p-6 text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm/6 opacity-90">{s.label}</p>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
            <span className="text-3xl/none opacity-80" aria-hidden>📊</span>
          </div>
        </div>
      ))}
    </div>
  );
}
