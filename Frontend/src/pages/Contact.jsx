import { useEffect, useState } from "react";
import { listPackages } from "@/services/packages";
import { createOrder } from "@/services/orders";

export default function Contact() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pkgId, setPkgId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try { setPackages(await listPackages()); }
      catch (e) { /* imprecise but fine for public page */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (!pkgId) { setError("Vui lòng chọn gói cần báo giá."); return; }
    setSubmitting(true);
    try {
      await createOrder(Number(pkgId));
      setMessage("Đã gửi yêu cầu báo giá. Chúng tôi sẽ liên hệ sớm!");
      setName(""); setEmail(""); setPhone(""); setPkgId("");
    } catch (e) {
      const msg = e?.response?.status === 401
        ? "Vui lòng đăng nhập để gửi báo giá."
        : (e?.response?.data?.message || e?.message || "Gửi báo giá thất bại");
      setError(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Báo giá</h1>
        {loading && <p>Đang tải gói...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-xl border">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
            <input className="mt-1 w-full border rounded-lg px-3 py-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Nguyễn Văn A" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@domain.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="09xx xxx xxx" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chọn gói</label>
            <select className="mt-1 w-full border rounded-lg px-3 py-2" value={pkgId} onChange={e=>setPkgId(e.target.value)}>
              <option value="">-- Chọn một gói --</option>
              {packages.map(p => (
                <option key={p.package_id} value={p.package_id}>
                  {(p.name || `Gói #${p.package_id}`)} - {(p.price ?? 0).toLocaleString("vi-VN")} đ
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-60">
              {submitting ? "Đang gửi..." : "Gửi báo giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

