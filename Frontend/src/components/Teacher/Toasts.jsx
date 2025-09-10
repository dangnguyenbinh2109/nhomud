import React from "react";

export function ToastStack({ toasts, onClose }) {
const color = (type) => ({ success: "bg-green-600", info: "bg-blue-600", warning: "bg-amber-500", danger: "bg-rose-600" }[type] || "bg-slate-700");
return (
<div className="fixed top-4 right-4 z-[60] space-y-2">
{toasts.map((t) => (
<div key={t.id} className={`${color(t.type)} flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg`} role="status">
<span aria-hidden>🔔</span>
<span>{t.message}</span>
<button className="ml-auto opacity-80 hover:opacity-100" onClick={() => onClose?.(t.id)} aria-label="Đóng thông báo">✕</button>
</div>
))}
</div>
);
}
