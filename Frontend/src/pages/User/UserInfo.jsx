import { useMemo, useState } from "react";

/* helpers nhỏ */
const Field = ({ label, children, hint }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${props.className || ""}`}
  />
);

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition ${checked ? "bg-blue-600" : "bg-slate-300"}`}
  >
    <span
      className={`block w-5 h-5 bg-white rounded-full translate-y-0.5 transition ${checked ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

const Avatar = ({ name }) => {
  const initials = useMemo(() => {
    const parts = (name || "?").trim().split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");
  }, [name]);
  return (
    <div className="w-16 h-16 rounded-full bg-blue-600 text-white grid place-items-center text-xl font-bold">
      {initials.toUpperCase()}
    </div>
  );
};

export default function UserInfo() {
  // giả lập dữ liệu user (sau nối API -> fetch & setState)
  const [profile, setProfile] = useState({
    fullName: "Bae Selina",
    username: "selina.bae",
    email: "selina@example.com",
    phone: "0912345678",
    role: "Giáo viên",
    subject: "Toán",
    school: "THPT Hòa Bình",
    language: "vi",
    theme: "light",
    emailNotif: true,
    twoFA: false,
  });

  // đổi mật khẩu (client-only demo)
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const pwValid = pw.next.length >= 6 && pw.next === pw.confirm;

  const saveProfile = () => {
    // TODO: call API: PUT /users/me
    alert("Đã lưu hồ sơ (demo). Dữ liệu gửi lên: \n" + JSON.stringify(profile, null, 2));
  };

  const changePassword = () => {
    if (!pwValid) return;
    // TODO: call API: POST /users/change-password
    alert("Đổi mật khẩu demo thành công!");
    setPw({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* top bar giả lập giống dashboard */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-semibold text-slate-800">Hồ sơ người dùng</div>
          <div className="flex items-center gap-3">
            <Avatar name={profile.fullName} />
            <div className="text-sm leading-tight">
              <div className="font-medium">{profile.fullName}</div>
              <div className="text-slate-500">{profile.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* left: general info */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Họ và tên">
                <Input
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </Field>
              <Field label="Username">
                <Input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </Field>
              <Field label="Số điện thoại">
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </Field>

              <Field label="Vai trò">
                <Input
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                />
              </Field>
              <Field label="Môn giảng dạy">
                <Input
                  value={profile.subject}
                  onChange={(e) => setProfile({ ...profile, subject: e.target.value })}
                />
              </Field>

              <Field label="Trường / Đơn vị">
                <Input
                  className="md:col-span-2"
                  value={profile.school}
                  onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                />
              </Field>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={saveProfile}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 rounded-lg border font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </section>

          {/* security */}
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Bảo mật</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Mật khẩu hiện tại">
                <Input
                  type="password"
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                />
              </Field>
              <Field label="Mật khẩu mới" hint="Tối thiểu 6 ký tự">
                <Input
                  type="password"
                  value={pw.next}
                  onChange={(e) => setPw({ ...pw, next: e.target.value })}
                />
              </Field>
              <Field label="Nhập lại mật khẩu mới">
                <Input
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                />
              </Field>
            </div>
            {!pwValid && (pw.next || pw.confirm) && (
              <p className="text-sm text-rose-600 mt-2">
                Mật khẩu mới phải ≥ 6 ký tự và trùng khớp.
              </p>
            )}
            <div className="mt-4">
              <button
                onClick={changePassword}
                disabled={!pwValid}
                className={`px-4 py-2 rounded-lg font-medium text-white ${
                  pwValid ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-300 cursor-not-allowed"
                }`}
              >
                Đổi mật khẩu
              </button>
            </div>
          </section>
        </div>

        {/* right: preferences & quick toggles */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Tùy chọn</h2>
            <div className="space-y-4">
              <Field label="Ngôn ngữ">
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </Field>

              <Field label="Giao diện">
                <select
                  value={profile.theme}
                  onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  <option value="light">Sáng (Light)</option>
                  <option value="dark">Tối (Dark)</option>
                  <option value="system">Theo hệ thống</option>
                </select>
              </Field>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Nhận email thông báo
                  </div>
                  <div className="text-xs text-slate-500">
                    Điểm số/tiến độ sẽ gửi về email của bạn
                  </div>
                </div>
                <Toggle
                  checked={profile.emailNotif}
                  onChange={(v) => setProfile({ ...profile, emailNotif: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    Xác thực 2 bước (2FA)
                  </div>
                  <div className="text-xs text-slate-500">
                    Tăng cường bảo mật tài khoản
                  </div>
                </div>
                <Toggle
                  checked={profile.twoFA}
                  onChange={(v) => setProfile({ ...profile, twoFA: v })}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-3">Khu vực nguy hiểm</h2>
            <p className="text-sm text-slate-600 mb-3">
              Xóa tài khoản sẽ xoá dữ liệu liên quan (không khuyến nghị).
            </p>
            <button
              className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700"
              onClick={() => confirm("Bạn chắc chắn muốn xóa tài khoản? (demo)") && alert("Đã gửi yêu cầu xoá (demo)")}
            >
              Xóa tài khoản
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
