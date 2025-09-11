import React, { useEffect, useState } from "react";
import ToolCard from "./ToolCard";
import { listLessonPlans } from "@/services/lessonPlans";

export default function AITools({ onOpen }) {
  const [counts, setCounts] = useState({ lessonPlans: null, ocr: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [lps] = await Promise.all([
          listLessonPlans().catch(() => []),
        ]);
        if (!mounted) return;
        setCounts({
          lessonPlans: Array.isArray(lps) ? lps.length : 0,
          ocr: null, // chưa có API count OCR
        });
      } catch {
        if (!mounted) return;
        setCounts({ lessonPlans: 0, ocr: null });
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section>
      <h3 className="mb-6 text-2xl font-bold text-gray-900">🤖 Công cụ AI</h3>
      <div className="grid grid-cols-1 gap-6">
        <ToolCard
          color="bg-blue-100"
          icon="📘"
          title="Tạo kế hoạch bài học"
          subtitle="Thiết kế & tổ chức"
          desc="Tạo kế hoạch thủ công, từ mẫu hoặc với AI"
          chip={counts.lessonPlans == null ? "—" : `${counts.lessonPlans} kế hoạch`}
          onClick={() => onOpen?.("lesson-plan")}
        />
        <ToolCard
          color="bg-orange-100"
          icon="📷"
          title="Chấm thi OCR"
          subtitle="Tự động & chính xác"
          desc="Quét và chấm bài làm tự động với OCR"
          chip={counts.ocr == null ? undefined : `${counts.ocr} bài đã chấm`}
          onClick={() => onOpen?.("ocr")}
        />
      </div>
    </section>
  );
}
