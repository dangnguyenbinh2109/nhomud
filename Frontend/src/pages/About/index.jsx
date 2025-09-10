// src/pages/About/index.jsx

// Images meme
const IMG_1 = "https://i.pinimg.com/1200x/45/a6/7d/45a67df6980100f2f8582d51ebca3b74.jpg"; // Sự Ra Đời
const IMG_2 = "https://i.pinimg.com/736x/3f/66/33/3f6633686599f4ea1763389f6a900c35.jpg"; // Cách Mạng Giáo Dục
const HERO_GRADIENT =
  "linear-gradient(180deg, rgba(23,63,166,1) 0%, rgba(24,87,206,1) 100%)";

const SectionTitle = ({ children, sub }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
      {children}
    </h2>
    {sub && <p className="mt-3 text-slate-600 max-w-3xl mx-auto">{sub}</p>}
    <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-slate-900/80" />
  </div>
);

/* ---------- HERO ---------- */
const AboutHero = () => (
  <section className="py-16 md:py-20 text-white" style={{ background: HERO_GRADIENT }}>
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
      <h1 className="text-3xl md:text-5xl font-extrabold">Về Chúng Tôi</h1>
      <p className="mt-4 text-lg md:text-xl opacity-95">
        Đổi mới toàn diện cách giáo viên và nhà trường quản lý hoạt động kiểm tra, đánh giá học tập
      </p>
    </div>
  </section>
);

/* ---------- SỰ RA ĐỜI ---------- */
const BirthSection = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Sự Ra Đời</h2>
        <div className="w-16 h-1 bg-slate-900 mt-3 mb-6 rounded-full" />
        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
          <p>PlanbookAI ra đời vào 3/11/2025 với khát vọng đổi mới toàn diện cách giáo viên và nhà trường quản lý hoạt động kiểm tra, đánh giá học tập.</p>
          <p>Chúng tôi ứng dụng công nghệ tiên tiến để tự động hóa toàn bộ quy trình từ tạo đề – chấm thi – tổng hợp báo cáo, giúp giáo viên tiết kiệm thời gian, nâng cao chất lượng giảng dạy và mang đến cho học sinh trải nghiệm học tập hiệu quả, đúng trọng tâm.</p>
          <p>Đồng thời, PlanbookAI hỗ trợ nhà trường tối ưu công tác quản trị dựa trên dữ liệu chính xác và cập nhật theo thời gian thực.</p>
        </div>
      </div>

      <div className="relative">
          <img
            src={IMG_1}
            alt="About image 1"
            className="w-full max-h-[420px] object-contain mx-auto"
            loading="lazy"
          />

        {/* Badge 03/11/2025 + icon trái tim */}
        <div className="absolute -bottom-8 left-8">
          <div className="rounded-2xl bg-[#1e4db8] text-white px-6 py-5 shadow-2xl flex items-start gap-4 min-w-[220px]">
            <div className="grid place-items-center h-10 w-10 rounded-xl bg-white/15">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 21s-7.5-4.35-9.6-8.8C1.3 9.6 2.6 6.9 5.2 6.2c1.6-.4 3.3.2 4.4 1.4L12 10l2.4-2.4c1.1-1.2 2.8-1.8 4.4-1.4 2.6.7 3.9 3.4 2.8 6-2.1 4.45-9.6 8.8-9.6 8.8Z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold">03/11/2025</div>
              <div className="text-sm opacity-90 -mt-0.5">Thành lập</div>
            </div>
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  </section>
);

/* ---------- TẦM NHÌN & SỨ MỆNH ---------- */
const VisionMission = () => (
  <section className="bg-slate-50 py-14 md:py-20">
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <SectionTitle> Tầm Nhìn & Sứ Mệnh </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Tầm Nhìn",
            desc:
              "Trở thành nền tảng công nghệ giáo dục hàng đầu Đông Nam Á, kết nối toàn diện giáo viên, học sinh và nguồn lực học tập để kiến tạo hệ sinh thái giáo dục thông minh, bền vững.",
            tone: "from-blue-50 to-white",
            icon: (
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12s4-7 9-7 9 7 9 7-4 7-9 7-9-7-9-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ),
          },
          {
            title: "Sứ Mệnh",
            desc:
              "Hỗ trợ giáo viên số hoá hoạt động giảng dạy, mang đến cho học sinh trải nghiệm học tập cá nhân hoá, truyền cảm hứng và phát triển năng lực toàn diện.",
            tone: "from-emerald-50 to-white",
            icon: (
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ),
          },
        ].map((c, idx) => (
          <div key={idx} className={`rounded-3xl p-7 md:p-8 bg-gradient-to-b ${c.tone} border border-slate-200 shadow-sm`}>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white grid place-items-center">
                {c.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{c.title}</h3>
            </div>
            <p className="mt-5 text-slate-600 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- CÁCH MẠNG GIÁO DỤC ---------- */
const Revolution = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <img
          src={IMG_2}
          alt="About image 2"
          className="w-full max-h-[420px] object-contain mx-auto"
          loading="lazy"
        />
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Một Cuộc Cách Mạng Trong Giáo Dục</h2>
        <div className="w-16 h-1 bg-slate-900 mt-3 mb-6 rounded-full" />
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>Với hệ thống thông minh, dữ liệu được phân tích theo thời gian thực, ma trận và nội dung ôn tập được tự động đồng bộ theo tiến độ giảng dạy.</p>
          <p>Chúng tôi tin rằng chất lượng giáo dục sẽ bứt phá khi giáo viên có thêm thời gian cho sáng tạo và tương tác.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Hệ thống thông minh", tone: "bg-emerald-50 text-emerald-700" },
            { label: "Phân tích thời gian thực", tone: "bg-indigo-50 text-indigo-700" },
            { label: "Đồng bộ tự động", tone: "bg-violet-50 text-violet-700" },
            { label: "Cá nhân hoá học tập", tone: "bg-amber-50 text-amber-700" },
          ].map((b, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${b.tone}`}>
              <span className="h-8 w-8 grid place-items-center rounded-full bg-white/70">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 12l3 3 7-7" />
                </svg>
              </span>
              <span className="font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------- GIÁ TRỊ CỐT LÕI ---------- */
const CoreValues = () => {
  const cards = [
    { title: "Hiệu Quả", desc: "Tiết kiệm thời gian, tối ưu công việc", tone: "from-emerald-50 to-white", badge: "bg-emerald-500",
      icon: (<svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 3l-1 9 8 2" /><path d="M3 12a9 9 0 1 0 18 0" /></svg>) },
    { title: "Chính Xác", desc: "Dữ liệu minh bạch, kết quả tin cậy", tone: "from-blue-50 to-white", badge: "bg-blue-600",
      icon: (<svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>) },
    { title: "Linh Hoạt", desc: "Cá nhân hoá trải nghiệm học tập", tone: "from-violet-50 to-white", badge: "bg-violet-600",
      icon: (<svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18" /></svg>) },
    { title: "Đồng Hành", desc: "Luôn lắng nghe và hỗ trợ 24/7", tone: "from-orange-50 to-white", badge: "bg-orange-600",
      icon: (<svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 8.5c0 4.5-8 10-8 10S4 13 4 8.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 1.5Z" /></svg>) },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <SectionTitle children="Giá Trị Cốt Lõi" sub="Những giá trị định hướng mọi hoạt động của chúng tôi" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div key={i} className={`rounded-3xl p-6 bg-gradient-to-b ${c.tone} border shadow-sm`}>
              <div className={`h-14 w-14 rounded-2xl ${c.badge} text-white grid place-items-center mb-5`}>{c.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{c.title}</h3>
              <p className="mt-2 text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- PAGE ---------- */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BirthSection />
      <VisionMission />
      <Revolution />
      <CoreValues />
    </>
  );
}
