import React, { useMemo, useState } from "react";

const palettes = [
  { tint: "from-blue-50 to-blue-100", chipBg: "bg-blue-500", icon: "🧪" },
  { tint: "from-green-50 to-green-100", chipBg: "bg-green-500", icon: "⚛️" },
  { tint: "from-purple-50 to-purple-100", chipBg: "bg-purple-500", icon: "🔬" },
  { tint: "from-amber-50 to-amber-100", chipBg: "bg-amber-500", icon: "📘" },
  { tint: "from-rose-50 to-rose-100", chipBg: "bg-rose-500", icon: "📗" },
];

export default function SubjectFocus({ subjects }) {
  const [internal] = useState(null); // giữ placeholder, không gọi Question API vì Staff scope

  const list = useMemo(() => {
    if (subjects?.length) return subjects;
    if (internal) return internal;
    // fallback ban đầu
    return [
      { name: "Hóa học 10", stats: "—", tint: "from-blue-50 to-blue-100", chipBg: "bg-blue-500", icon: "🧪" },
      { name: "Hóa học 11", stats: "—", tint: "from-green-50 to-green-100", chipBg: "bg-green-500", icon: "⚛️" },
      { name: "Hóa học 12", stats: "—", tint: "from-purple-50 to-purple-100", chipBg: "bg-purple-500", icon: "🔬" },
    ];
  }, [subjects, internal]);

  const badge = useMemo(() => {
    const top = list?.[0]?.name || "Hóa học THPT";
    return top.length > 24 ? top.slice(0, 24) + "…" : top;
  }, [list]);

  return (
    <section className="mb-8 rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">🧪 Môn học chuyên biệt</h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">{badge}</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {list.map((s) => (
          <div key={s.name} className={`bg-gradient-to-br ${s.tint} rounded-lg p-4 text-center`}>
            <div className={`${s.chipBg} mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full text-white`}>
              <span className="text-2xl" aria-hidden>{s.icon}</span>
            </div>
            <h4 className="mb-2 font-semibold text-gray-900">{s.name}</h4>
            <p className="text-sm text-gray-600">{s.stats}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
