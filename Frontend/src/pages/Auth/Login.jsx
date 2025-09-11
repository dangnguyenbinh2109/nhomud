// src/pages/Auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as doLogin } from "@/services/auth";          // dùng service axios đã cấu hình
import { FcGoogle } from "react-icons/fc";
import { LuQrCode } from "react-icons/lu";

export default function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const switchMode = (e) => {
    e.preventDefault();
    setIsRegister((prev) => !prev);
    setErrors({});
    setId("");
    setEmail("");
    setPw("");
    setConfirmPassword("");
  };

  // validate input
  const validate = () => {
    const e = {};
    if (!id.trim()) e.id = "Vui lòng nhập username của bạn";
    if (!pw) e.pw = "Vui lòng nhập mật khẩu.";
    if (isRegister && !email.trim()) e.email = "Vui lòng nhập email.";
    if (isRegister && pw !== confirmPassword) e.confirmPassword = "Mật khẩu nhập lại không khớp.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // submit login
  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      if (isRegister) {
        // Logic đăng ký
        const response = await fetch(`http://127.0.0.1:6868/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: id.trim(), email: email.trim(), password: pw }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Đăng ký thất bại.");
        }
        alert(result.message || "Đăng ký thành công! Vui lòng đăng nhập.");
        setIsRegister(false); // Chuyển về form đăng nhập
      } else {
        // Logic đăng nhập
        // gọi API qua service (service sẽ tự lưu token/refresh_token/role,... vào localStorage)
        const user = await doLogin(String(id ?? "").trim(), String(pw ?? ""));

        // 👉 Điều hướng theo role
        const role = user?.role || localStorage.getItem("role");
        switch (role) {
          case "teacher":
            navigate("/dashboard");
            break;
          case "manager":
            navigate("/manager/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      // hiện lỗi nhưng KHÔNG đổi UI
      const errorMessage = isRegister ? "Đăng ký thất bại" : "Đăng nhập thất bại";
      alert(err?.response?.data?.message || err?.message || errorMessage);
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
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">{isRegister ? "Tạo tài khoản" : "Đăng nhập"}</h1>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* ID */}
              <div>
                <label htmlFor="login-id" className="sr-only">Username</label>
                <input
                  id="login-id"
                  type="text"
                  className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500
                    ${errors.id ? "border-red-400" : "border-slate-200"}`}
                  placeholder="Username"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  aria-invalid={!!errors.id}
                  aria-describedby={errors.id ? "error-id" : undefined}
                  autoComplete="username"
                />
                {errors.id && <p id="error-id" className="mt-2 text-sm text-red-600">{errors.id}</p>}
              </div>

              {/* Email (chỉ khi đăng ký) */}
              {isRegister && (
                <div>
                  <label htmlFor="register-email" className="sr-only">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-400" : "border-slate-200"}`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "error-email" : undefined}
                  />
                  {errors.email && <p id="error-email" className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
              )}

              {/* Password với 👁️/🙈 giữ nguyên UI */}
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
                      <span className="eye-blink text-lg leading-none">👁️</span>
                    ) : (
                      <span className="text-lg leading-none">🙈</span>
                    )}
                  </button>
                </div>
                {errors.pw && <p id="error-pw" className="mt-2 text-sm text-red-600">{errors.pw}</p>}
              </div>

              {/* Confirm Password (chỉ khi đăng ký) */}
              {isRegister && (
                <div>
                  <label htmlFor="confirm-pw" className="sr-only">Nhập lại mật khẩu</label>
                  <div className="relative">
                    <input
                      id="confirm-pw"
                      type={showPw ? "text" : "password"}
                      className={`w-full rounded-xl border px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-400" : "border-slate-200"}`}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "error-confirm-pw" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:scale-110 transition"
                      aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      title={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPw ? <span className="eye-blink text-lg leading-none">👁️</span> : <span className="text-lg leading-none">🙈</span>}
                    </button>
                  </div>
                  {errors.confirmPassword && <p id="error-confirm-pw" className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              )}

              {!isRegister && (
                <div className="flex items-center justify-between text-sm">
                  <a href="/forgot" className="text-blue-600 hover:underline">Quên mật khẩu?</a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? (isRegister ? "Đang tạo..." : "Đang đăng nhập...") : (isRegister ? "Đăng ký" : "Đăng nhập")}
              </button>

              <div className="text-center text-sm text-gray-600">
                {isRegister ? "Đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
                <a href="#" onClick={switchMode} className="text-blue-600 hover:underline">
                  {isRegister ? "Đăng nhập" : "Tạo một tài khoản mới"}
                </a>
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
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
