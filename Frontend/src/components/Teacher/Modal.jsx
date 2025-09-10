import React, { useEffect } from "react";

export default function Modal({ open, onClose, title, subtitle, children }) {
useEffect(() => {
if (!open) return;
const onKey = (e) => e.key === "Escape" && onClose?.();
window.addEventListener("keydown", onKey);
return () => window.removeEventListener("keydown", onKey);
}, [open, onClose]);

if (!open) return null;
return (
<div
className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
onClick={(e) => e.target === e.currentTarget && onClose?.()}
aria-modal
role="dialog"
>
<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
<div className="mb-6 text-center">
<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
<span className="text-2xl" aria-hidden>
✨
</span>
</div>
<h3 className="text-xl font-bold text-gray-900">{title}</h3>
{subtitle && <p className="text-gray-600">{subtitle}</p>}
</div>
<div className="space-y-3">{children}</div>
<button onClick={onClose} className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
Đóng
</button>
</div>
</div>
);
}
