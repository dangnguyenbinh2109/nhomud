// src/pages/Auth/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuQrCode } from "react-icons/lu";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!id.trim()) e.id = "Vui lòng nhập đúng phone, email hoặc username của bạn";
    if (!pw) e.pw = "Vui lòng nhập mật khẩu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      // TODO: call API thật ở đây
      alert("Đăng nhập demo thành công (mock)!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CSS nhỏ để mắt chớp 👁️ */}
      <style>{`
        @keyframes blink {
          0%, 97%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
          99% { transform: scaleY(1); }
        }
        .eye-blink { display:inline-block; transform-origin:center; animation: blink 3.2s infinite; }
      `}</style>

      <div className="bg-slate-50 min-h-[calc(100vh-90px)] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mx-auto max-w-md bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Đăng nhập</h1>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* ID */}
              <div>
                <label htmlFor="login-id" className="sr-only">Số điện thoại / Email / Username</label>
                <input
                  id="login-id"
                  type="text"
                  inputMode="email"
                  className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.id ? "border-red-400" : "border-slate-200"}`}
                  placeholder="Nhập số điện thoại, email hoặc username"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  aria-invalid={!!errors.id}
                  aria-describedby={errors.id ? "error-id" : undefined}
                  autoComplete="username"
                />
                {errors.id && <p id="error-id" className="mt-2 text-sm text-red-600">{errors.id}</p>}
              </div>

              {/* Password với 👁️ chớp / 🙈 */}
              <div>
                <label htmlFor="login-pw" className="sr-only">Mật khẩu</label>
                <div className="relative">
                  <input
                    id="login-pw"
                    type={showPw ? "text" : "password"}
                    className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500
                      ${errors.pw ? "border-red-400" : "border-slate-200"}`}
                    placeholder="Mật khẩu"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    aria-invalid={!!errors.pw}
                    aria-describedby={errors.pw ? "error-pw" : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:scale-110 transition"
                    aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    title={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPw ? (
                      // đang Hiện mật khẩu: hiện 👁️ chớp
                      <span className="eye-blink text-lg leading-none">👁️</span>
                    ) : (
                      // đang Ẩn mật khẩu: hiện 🙈
                      <span className="text-lg leading-none">🙈</span>
                    )}
                  </button>
                </div>
                {errors.pw && <p id="error-pw" className="mt-2 text-sm text-red-600">{errors.pw}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot" className="text-blue-600 hover:underline">Quên mật khẩu?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Tạo một tài khoản mới
                </Link>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Hoặc</span>
                </div>
              </div>

              {/* Social / QR */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="rounded-xl border py-3">
                  <span className="inline-flex items-center gap-2 justify-center w-full">
                    <FcGoogle className="h-5 w-5" aria-hidden />
                    Google
                  </span>
                </button>
                <button type="button" className="rounded-xl border py-3">
                  <span className="inline-flex items-center gap-2 justify-center w-full">
                    <LuQrCode className="h-5 w-5" aria-hidden />
                    Qrcode
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
