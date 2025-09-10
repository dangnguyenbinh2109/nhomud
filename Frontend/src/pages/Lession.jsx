import { useEffect, useState } from "react";
import { listPackages } from "@/services/packages";
import { createOrder } from "@/services/orders";

export default function Lession() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingId, setCreatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const list = await listPackages();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Không tải được gói sản phẩm");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const order = async (pkg) => {
    setMessage(""); setError(""); setCreatingId(pkg.package_id);
    try {
      await createOrder(pkg.package_id);
      setMessage(`Tạo đơn hàng cho gói "${pkg.name || pkg.package_id}" thành công!`);
    } catch (e) {
      const msg = e?.response?.status === 401
        ? "Vui lòng đăng nhập để tạo đơn hàng."
        : (e?.response?.data?.message || e?.message || "Tạo đơn hàng thất bại");
      setError(msg);
    } finally { setCreatingId(null); }
  };

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Sản phẩm</h1>
        {loading && <p>Đang tải gói sản phẩm...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((pkg) => (
            <div key={pkg.package_id} className="border rounded-xl p-5 bg-white shadow-sm">
              <h3 className="text-lg font-semibold">{pkg.name || `Gói #${pkg.package_id}`}</h3>
              <p className="text-gray-600 mt-1">{pkg.description || ""}</p>
              <p className="mt-2 font-bold">{(pkg.price ?? 0).toLocaleString("vi-VN")} đ</p>
              <button
                onClick={() => order(pkg)}
                disabled={creatingId === pkg.package_id}
                className="mt-4 w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {creatingId === pkg.package_id ? "Đang tạo đơn..." : "Đặt mua"}
              </button>
            </div>
          ))}
        </div>

        {!loading && items.length === 0 && (
          <div className="text-gray-600">Chưa có gói sản phẩm.</div>
        )}
      </div>
    </div>
  );
}

