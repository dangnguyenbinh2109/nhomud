import React from "react";

function classNames(...arr) { return arr.filter(Boolean).join(" "); }

export default function ToolCard({ color = "bg-gray-100", icon = "🧩", title, subtitle, desc, chip, onClick }) {
return (
<button onClick={onClick} className="w-full rounded-xl bg-white p-6 text-left shadow-lg transition-transform hover:-translate-y-1">
<div className="mb-4 flex items-center">
<div className={classNames("mr-4 rounded-lg p-3", color)}>
<span className="text-xl" aria-hidden>{icon}</span>
</div>
<div>
<h4 className="font-semibold text-gray-900">{title}</h4>
{subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
</div>
</div>
{desc && <p className="mb-4 text-sm text-gray-600">{desc}</p>}
<div className="flex items-center justify-between">
{chip && (
<span className="rounded-full px-2 py-1 text-xs" style={{ background: "rgba(59,130,246,0.12)", color: "#1d4ed8" }}>
{chip}
</span>
)}
<span aria-hidden>➡️</span>
</div>
</button>
);
}