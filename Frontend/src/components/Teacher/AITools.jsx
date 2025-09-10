import React, { useEffect, useState } from "react";
import ToolCard from "./ToolCard";
import { listExams } from "@/services/exams";

export default function AITools({ onOpen }) {
  const [counts, setCounts] = useState({ exams: null, ocr: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [exs] = await Promise.all([
          listExams().catch(() => []),
        ]);
        if (!mounted) return;
        setCounts({
          exams: Array.isArray(exs) ? exs.length : 0,
          ocr: null, // chưa có API count OCR
        });
      } catch {
        if (!mounted) return;
        setCounts({ exams: 0, ocr: null });
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="lg:col-span-2">
      <h3 className="mb-6 text-2xl font-bold text-gray-900">🤖 Công cụ AI</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ToolCard
          color="bg-green-100"
          icon="✨"
          title="Tạo bài tập"
          subtitle="Tự động với AI"
          desc="Tạo bài tập (tương đương đề thi) theo chủ đề"
          chip={counts.exams == null ? "—" : `${counts.exams} đề thi`}
          onClick={() => onOpen?.("test")}
        />
        <ToolCard
          color="bg-purple-100"
          icon="📋"
          title="Tạo đề thi"
          subtitle="Trắc nghiệm thông minh"
          desc="Tạo đề thi trắc nghiệm với nhiều phiên bản"
          chip={counts.exams == null ? "—" : `${counts.exams} đề thi`}
          onClick={() => onOpen?.("test")}
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
