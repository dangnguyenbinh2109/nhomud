import React from "react";

export default function QuickActions({ onOpenQuick, onToast }) {
return (
<div className="space-y-3">
<button
className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white transition-colors hover:from-blue-600 hover:to-blue-700"
onClick={onOpenQuick}
>
<span aria-hidden>➕</span>
<span>Tạo bài tập nhanh</span>
</button>
<button
className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-white transition-colors hover:from-green-600 hover:to-green-700"
onClick={() => onToast?.("Đang tạo đề thi nhanh với AI...", "success")}
>
<span aria-hidden>📄</span>
<span>Tạo đề thi nhanh</span>
</button>
<button
className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 text-white transition-colors hover:from-purple-600 hover:to-purple-700"
onClick={() => onToast?.("Đang mở công cụ tải bài lên chấm...", "info")}
>
<span aria-hidden>⤴️</span>
<span>Tải bài lên chấm</span>
</button>
</div>
);
}