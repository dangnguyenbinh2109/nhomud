// src/pages/Home/index.jsx

const HERO_IMG =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80&auto=format&fit=crop";

/* ---------- Small UI bits ---------- */
const IconWrap = ({ children }) => (
  <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
    {children}
  </div>
);

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex gap-3">
    <IconWrap>{icon}</IconWrap>
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ============================ */
/* SECTION: HERO (đầu trang)   */
/* ============================ */
const Hero = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* LEFT */}
      <div>
        {/* Badge */}
        <div className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-full px-3 py-0.5 mb-3">
          Dành cho giáo viên THPT
        </div>

        {/* Heading + wave underline */}
        <h1 className="max-w-[640px] text-[28px] sm:text-[34px] lg:text-[42px] font-bold leading-[1.2] tracking-[-0.01em] text-slate-900">
          Nền Tảng Kiểm Tra Đánh Giá Toàn Diện
          <br className="hidden sm:block" />
          <span className="relative inline-block pb-3 sm:pb-4">
            <span className="relative z-10">Được Tin Dùng Bởi Phần Lớn Giáo Viên</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 400 24"
              className="pointer-events-none absolute left-0 bottom-0 w-[102%] z-0 translate-y-1"
            >
              {/* mảnh vừa phải */}
              <path
                d="M2 18 C 40 2, 80 26, 120 10 S 200 6, 240 16 320 4, 398 14"
                fill="none"
                stroke="#22c55e"
                strokeWidth={5} 
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-blue-700 font-medium mt-3 text-sm sm:text-base max-w-[560px] leading-relaxed">
          Nâng cao chất lượng kiểm tra, đánh giá, trải nghiệm Giảng dạy và Học tập cùng AI
        </p>

        {/* Bullets */}
        <div className="mt-8 space-y-6">
          <FeatureItem
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" className="stroke-blue-500" strokeWidth="2" />
                <path d="M7 12l3 3 7-7" className="stroke-blue-500" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Kiểm tra Online và Offline dễ dàng, chính xác"
            desc="Mô phỏng các dạng đề thi mới, số hoá nhanh, đa dạng mẫu phiếu tô trắc nghiệm."
          />
          <FeatureItem
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="5" rx="7" ry="3" className="stroke-blue-500" strokeWidth="2" />
                <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" className="stroke-blue-500" strokeWidth="2" fill="none" />
                <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" className="stroke-blue-500" strokeWidth="2" fill="none" />
              </svg>
            }
            title="Số hoá Ngân hàng câu hỏi nhanh chóng"
            desc="Nhận diện dạng đề, trắc nghiệm & tự luận; lưu trữ hàng nghìn câu hỏi."
          />
          <FeatureItem
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M2 9l10-5 10 5-10 5-10-5z" className="stroke-blue-500" strokeWidth="2" fill="none" />
                <path d="M6 12v4c0 1.1 2.7 2 6 2s6-.9 6-2v-4" className="stroke-blue-500" strokeWidth="2" fill="none" />
                <path d="M20 10v6" className="stroke-blue-500" strokeWidth="2" />
              </svg>
            }
            title="Hệ thống Quản lý học tập thông minh"
            desc="Quản lý khoá học, bài giảng, giao bài, đánh giá và theo dõi tiến độ."
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative">
        <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-200">
          <img
            src={HERO_IMG}
            alt="Giao diện PlanbookAI trên máy tính"
            className="w-full h-[360px] object-cover"
          />
        </div>

        {/* bubble */}
        <div className="absolute -top-6 right-6 sm:-top-8 sm:right-8">
          <div className="bg-amber-400 text-white rounded-2xl px-4 py-3 shadow-lg">
            <div className="w-32 text-sm font-semibold">Tin nhắn nhanh</div>
            <div className="mt-1 h-1.5 rounded bg-white/80" />
            <div className="mt-1 h-1.5 rounded bg-white/60 w-20" />
          </div>
        </div>

        {/* dotted */}
        <div
          aria-hidden="true"
          className="absolute -bottom-6 left-8 w-40 h-4"
          style={{
            background: "radial-gradient(#cbd5e1 2px, transparent 2px) 0 0/14px 14px",
            opacity: 0.7,
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  </section>
);

/* ===================================== */
/* SECTION: Kiểm tra Online & Offline    */
/* ===================================== */
const FeatureSection = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Kiểm tra Online và Offline</h2>
    <div className="w-12 h-0.5 bg-slate-900 mt-2 mb-6" />
    <p className="text-slate-600 max-w-2xl mb-12">
      Tạo đề trắc nghiệm hoặc tự luận nhanh chóng, có thể tạo từ Ngân hàng câu hỏi.
      Giao bài trực tiếp đến từng học sinh hoặc nhóm học sinh, tự động thống kê kết quả.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* LEFT card */}
      <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M20 17.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25" />
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Hạ tầng cao, thi online đồng thời số lượng lớn</h3>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Nền tảng công nghệ cao, hỗ trợ hàng trăm nghìn người dùng thi cùng lúc, đảm bảo an toàn, bảo mật.
        </p>
        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-lg px-4 py-3 shadow border text-center">
            <div className="text-blue-600 font-bold text-lg">99.9%</div>
            <div className="text-xs text-slate-500">Thời gian hoạt động</div>
          </div>
          <div className="flex-1 bg-white rounded-lg px-4 py-3 shadow border text-center">
            <div className="text-blue-600 font-bold text-lg">300k+</div>
            <div className="text-xs text-slate-500">Người dùng đồng thời</div>
          </div>
        </div>
      </div>

      {/* RIGHT list */}
      <div className="flex flex-col gap-3">
        {[
          { title: "Hỗ trợ đa định dạng file câu hỏi", desc: "Nhận diện docx, pdf, ảnh, excel chính xác." },
          { title: "Hạ tầng cao, thi online đồng thời số lượng lớn", desc: "Ổn định 99.9%, 300k+ người dùng cùng lúc.", active: true },
          { title: "Giám sát nâng cao, phân quyền chi tiết", desc: "Chống gian lận bằng AI, theo dõi realtime." },
          { title: "Chấm phiếu trắc nghiệm số lượng lớn", desc: "OCR thông minh, chính xác 99.9%." },
          { title: "Thống kê kết quả chi tiết", desc: "Báo cáo đa chiều theo khung năng lực." },
        ].map((f, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              f.active ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-slate-50 border-slate-200"
            }`}
          >
            <p className={`font-semibold ${f.active ? "text-blue-700" : "text-slate-900"}`}>{f.title}</p>
            <p className="text-slate-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ===================================== */
/* SECTION: Số hoá Ngân hàng câu hỏi     */
/* ===================================== */
const QuestionBankSection = () => {
  const items = [
    { title: "AI Phân loại thông minh", desc: "AI phân loại chính xác 95%, xử lý 1000+ câu hỏi/phút", active: true },
    { title: "Lọc câu trùng lặp", desc: "Loại bỏ câu hỏi trùng lặp với độ chính xác 99.2%" },
    { title: "Chuẩn cấu trúc CT2018", desc: "Tuân thủ 100% chương trình GDPT 2018" },
    { title: "Phân tích thống kê trực quan", desc: "Dashboard thời gian thực theo khung năng lực" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Số hoá ngân hàng câu hỏi</h2>
      <div className="w-12 h-0.5 bg-slate-900 mt-2 mb-6" />
      <p className="text-slate-600 max-w-3xl mb-10">
        Số hoá hàng nghìn câu hỏi đa định dạng chỉ trong vài phút với AI. Phân loại theo khung năng lực, đơn vị kiến thức và mức độ.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT list */}
        <div className="order-2 lg:order-1 flex flex-col gap-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className={`rounded-xl border px-4 py-3 transition ${
                it.active ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              <p className={`font-semibold ${it.active ? "text-blue-700" : "text-slate-900"}`}>{it.title}</p>
              <p className="text-slate-600 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>

        {/* RIGHT card */}
        <div className="order-1 lg:order-2">
          <div
            className="rounded-3xl p-8 border shadow-sm"
            style={{
              background: "linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.06))",
              borderColor: "rgba(16,185,129,0.25)",
            }}
          >
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white grid place-items-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 10a4 4 0 1 1 4-4v12a4 4 0 1 1-4-4" />
                <path d="M12 6a4 4 0 1 1 4 4M12 18a4 4 0 1 0 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">AI Phân loại thông minh</h3>
            <p className="text-emerald-900/80 text-sm leading-relaxed mb-6">
              AI được train trên dữ liệu lớn, phân loại chính xác mức độ khó/dễ và đơn vị kiến thức; tự động gắn thẻ theo khung năng lực.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl px-4 py-3 border text-center">
                <div className="text-emerald-600 font-bold text-lg">95%</div>
                <div className="text-xs text-slate-500">Độ chính xác</div>
              </div>
              <div className="bg-white rounded-xl px-4 py-3 border text-center">
                <div className="text-emerald-600 font-bold text-lg">1000+</div>
                <div className="text-xs text-slate-500">Câu hỏi/phút</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===================================== */
/* SECTION: Hệ thống Quản lý học tập     */
/* ===================================== */
const LearningManagementSection = () => {
  const items = [
    { title: "Chuẩn cấu trúc PT2018", desc: "Tuân thủ 100% chuẩn SGK & yêu cầu CT2018" },
    { title: "Kho nội dung chất lượng", desc: "500K+ câu hỏi đủ mọi mức độ, lời giải chi tiết" },
    { title: "Công nghệ AI theo dõi tiến trình", desc: "Theo dõi realtime, phân tích từng học sinh & cả lớp" },
    { title: "Thống kê đánh giá chi tiết", desc: "Đánh giá 360°, cá nhân hoá học tập", active: true },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Hệ thống Quản lý học tập thông minh</h2>
      <div className="w-12 h-0.5 bg-slate-900 mt-2 mb-6" />
      <p className="text-slate-600 max-w-3xl mb-10">
        Quản lý khoá học, giao bài theo nhóm, theo dõi tiến độ và kết quả theo lớp/khóa. Xuất báo cáo hiệu quả đào tạo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT card */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-8 border shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white grid place-items-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 3h18v4H3zM3 17h18v4H3zM3 10h18v4H3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-slate-900">Thống kê đánh giá chi tiết</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Đánh giá năng lực tổng quan & chi tiết từng học sinh, đưa ra biện pháp ôn tập phù hợp, cá nhân hoá trải nghiệm.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl px-4 py-3 border text-center">
              <div className="text-amber-600 font-bold text-lg">360°</div>
              <div className="text-xs text-slate-500">Đánh giá</div>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 border text-center">
              <div className="text-amber-600 font-bold text-lg">Cá nhân</div>
              <div className="text-xs text-slate-500">Học tập</div>
            </div>
          </div>
        </div>

        {/* RIGHT list */}
        <div className="flex flex-col gap-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                it.active ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              <p className={`font-semibold ${it.active ? "text-blue-700" : "text-slate-900"}`}>{it.title}</p>
              <p className="text-slate-600 text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===================================== */
/* SECTION: Tại sao lựa chọn PlanbookAI  */
/* ===================================== */
const WhyChooseSection = () => {
  const items = [
    { title: "Hỗ trợ kỹ thuật", desc: "14/7 (8:00–22:00)", color: "blue",
      icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.06a2 2 0 1 1-2.83 2.83l-.06-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .31 1.7 1.7 0 0 0-.84 1.46V22a2 2 0 1 1-4 0v-.83A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.87.34l-.06.05A2 2 0 1 1 2.24 17l.05-.06A1.7 1.7 0 0 0 3 15a1.7 1.7 0 0 0-.31-1 1.7 1.7 0 0 0-1.46-.84H1a2 2 0 1 1 0-4h.83A1.7 1.7 0 0 0 3 7a1.7 1.7 0 0 0-.34-1.87l-.05-.06A2 2 0 1 1 5.44 2.24l.06.05A1.7 1.7 0 0 0 7 3c.37 0 .71-.11 1-.31A1.7 1.7 0 0 0 8.83 1H9a2 2 0 1 1 4 0v.83A1.7 1.7 0 0 0 13 3c.37 0 .71.11 1 .31.3.2.64.31 1 .31.53 0 1.04-.21 1.46-.59l.06-.05A2 2 0 1 1 21.76 5l-.05.06A1.7 1.7 0 0 0 21 7c0 .37.11.71.31 1 .2.3.31.64.31 1s-.11.71-.31 1a1.7 1.7 0 0 0-.31 1Z"/></svg>) },
    { title: "Hỗ trợ đào tạo", desc: "Đào tạo chuyên sâu cho trường/nhóm", color: "pink",
      icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4v15.5A2.5 2.5 0 0 0 6.5 22H20V5.5A2.5 2.5 0 0 0 17.5 3H6.5A2.5 2.5 0 0 0 4 5.5" /></svg>) },
    { title: "Kết nối ổn định", desc: "Thi online đồng thời >200k người", color: "green",
      icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14 0" /><path d="M8.5 16a6 6 0 0 1 7 0" /><path d="M12 20h.01" /></svg>) },
    { title: "Cộng đồng sử dụng lớn", desc: "400k+ giáo viên • 9k+ trường", color: "amber",
      icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>) },
    { title: "Bảo mật cao", desc: "Mã hoá đầu-cuối, chống gian lận bằng AI", color: "rose",
      icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12l2 2 4-4" /></svg>) },
    { title: "Dễ sử dụng", desc: "Giao diện thân thiện, phù hợp nghiệp vụ", color: "cyan",
      icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7 17 2-7 7-2-16-8Z" /></svg>) },
  ];

  const pastel = {
    blue: "bg-blue-100 text-blue-600",
    pink: "bg-pink-100 text-pink-600",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
    cyan: "bg-cyan-100 text-cyan-600",
  };

  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Tại sao lựa chọn PlanbookAI</h2>
          <div className="mx-auto w-16 h-1 bg-slate-900 mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((it, i) => (
            <div key={i} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-2xl grid place-items-center ${pastel[it.color]} shadow`} />
              <div className="relative -mt-12 mb-3">
                <div className={`w-16 h-16 mx-auto rounded-2xl grid place-items-center ${pastel[it.color]}`}>
                  {it.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{it.title}</h3>
              <p className="text-slate-500 mt-1 text-sm leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================ */
/* PAGE: Home                   */
/* ============================ */
const Home = () => {
  return (
    <>
      <Hero />
      <FeatureSection />
      <QuestionBankSection />
      <LearningManagementSection />
      <WhyChooseSection />
    </>
  );
};

export default Home;
