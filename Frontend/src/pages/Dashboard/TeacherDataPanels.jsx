// src/pages/Dashboard/TeacherDataPanels.jsx
import { useEffect, useRef, useState } from "react";
import { ocrExtractText, ocrGrade } from "@/services/ocr";
import { listOrders, createOrder } from "@/services/orders";
import { listPackages } from "@/services/packages";
import TeacherLessonPlanManagement from "../../components/Teacher/LessonPlanManagement";
import ExamCreation from "../Teacher/ExamCreation";

const Card = ({ children }) => (
  <div className="rounded-2xl border border-gray-200 shadow-sm p-4 bg-white">{children}</div>
);
const Section = ({ title, right }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold">{title}</h2>
    {right}
  </div>
);
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-white text-gray-700 hover:bg-gray-50 border",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
};
const Input = ({ label, ...props }) => (
  <label className="block text-sm mb-3">
    <span className="block text-gray-600 mb-1">{label}</span>
    <input {...props} className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${props.className||""}`} />
  </label>
);
const Textarea = ({ label, ...props }) => (
  <label className="block text-sm mb-3">
    <span className="block text-gray-600 mb-1">{label}</span>
    <textarea {...props} className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-[88px] ${props.className||""}`} />
  </label>
);
const Empty = ({ title="Chưa có dữ liệu", desc="Hãy tạo mới để bắt đầu." }) => (
  <div className="text-center py-10 text-gray-500">
    <div className="text-base font-medium">{title}</div>
    <div className="text-sm mt-1">{desc}</div>
  </div>
);

/* -------- OCR -------- */
function fileToBase64(file){ return new Promise((res, rej)=>{ const r=new FileReader(); r.onload=()=>res(String(r.result).split(',')[1]); r.onerror=rej; r.readAsDataURL(file); }); }
function OCRPanel() {
  const [text, setText] = useState(""); const [grade, setGrade] = useState(null);
  const [busy, setBusy] = useState(false); const [examId, setExamId] = useState(""); const [studentName, setStudentName] = useState("");
  const [imgB64, setImgB64] = useState(""); const [imgInfo, setImgInfo] = useState(null);
  const fileRef = useRef(null);
  const [exams, setExams] = useState([]); const [examsLoading, setExamsLoading] = useState(false);
  const [base64Text, setBase64Text] = useState("");

  useEffect(() => {
    const loadExams = async () => {
      setExamsLoading(true);
      try { const xs = await listExams().catch(() => []); setExams(Array.isArray(xs) ? xs : []); }
      finally { setExamsLoading(false); }
    };
    loadExams();
  }, []);

  const onFileChange = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) { setImgB64(""); setImgInfo(null); return; }
    if (file.size > 10 * 1024 * 1024) { alert("Ảnh quá lớn (>10MB)"); e.target.value = ""; return; }
    setBusy(true);
    try {
      const base64 = await fileToBase64(file);
      setImgB64(base64);
      setImgInfo({ name: file.name, type: file.type || "image/*", size: file.size });
    } catch (err) {
      alert("Không đọc được ảnh", `${err}`);
    } finally { setBusy(false); }
  };

  const onExtract = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file && !imgB64) return alert("Chọn ảnh trước đã!");
    setBusy(true);
    try {
      const base64 = imgB64 || await fileToBase64(file);
      setText(await ocrExtractText(base64));
    }
    catch(e){ alert(e.message); } finally { setBusy(false); }
  };
  const onGrade = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file && !imgB64) return alert("Chọn ảnh trước đã!");
    if (!examId) return alert("Nhập Exam ID");
    setBusy(true);
    try {
      const base64 = imgB64 || await fileToBase64(file);
      const out = await ocrGrade({ exam_id: Number(examId), student_name: studentName || "", image_base64: base64 });
      setGrade(out);
    } catch(e){ alert(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <Section title="Tải ảnh bài làm & OCR" />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              <Button type="button" onClick={() => fileRef.current?.click()}>Chọn ảnh</Button>
              {imgB64 && (
                <Button type="button" variant="ghost" onClick={() => { if (fileRef.current) fileRef.current.value = ""; setImgB64(""); setImgInfo(null); }}>Xoá ảnh</Button>
              )}
            </div>
            {imgInfo && (
              <div className="rounded-xl border px-3 py-2 text-xs text-gray-700 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Đã chọn:</span>
                  <span>{imgInfo.name}</span>
                  <span className="text-gray-400">•</span>
                  <span>{(imgInfo.size/1024).toFixed(0)} KB</span>
                  <span className="text-gray-400">•</span>
                  <span>{imgInfo.type}</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-500">Base64 (gửi vào API image_base64): </span>
                  <code className="break-all">
                    {imgB64.slice(0, 96)}{imgB64.length>96?"…":""}
                  </code>
                  <button
                    type="button"
                    className="ml-2 inline-flex items-center rounded border px-2 py-0.5 hover:bg-gray-100"
                    onClick={() => { navigator.clipboard?.writeText(imgB64); }}
                  >Copy</button>
                </div>
              </div>
            )}
            {/* Optional: paste base64 manually */}
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Hoặc dán Base64 thủ công (chỉ phần chuỗi, không cần data:image/...)</div>
              <textarea
                value={base64Text}
                onChange={(e)=>setBase64Text(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-16"
                placeholder="Dán chuỗi base64 ở đây..."
              />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={()=>{ const clean = String(base64Text||"").split(',').pop().replace(/\s+/g,''); setImgB64(clean); setImgInfo({ name: 'base64.txt', type: 'text/plain', size: clean.length }); }}>Dùng Base64</Button>
              </div>
            </div>
          </div>
          <label className="block text-sm">
            <span className="block text-gray-600 mb-1">Chọn đề thi</span>
            <div className="flex gap-2">
              <select
                value={examId}
                onChange={(e)=>setExamId(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                disabled={examsLoading}
              >
                <option value="">{examsLoading ? "Đang tải danh sách..." : "— Chọn đề thi —"}</option>
                {exams.map((ex) => (
                  <option key={ex.exam_id} value={ex.exam_id}>
                    {ex.title || `Exam #${ex.exam_id}`} (#{ex.exam_id})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                onClick={async ()=>{ setExamsLoading(true); try { const xs = await listExams().catch(()=>[]); setExams(Array.isArray(xs)?xs:[]); } finally { setExamsLoading(false); } }}
                aria-label="Làm mới danh sách đề thi"
                title="Làm mới danh sách đề thi"
              >↻</button>
            </div>
          </label>
          <Input label="Tên học sinh (tuỳ chọn)" value={studentName} onChange={(e)=>setStudentName(e.target.value)} />
          <div className="md:col-span-3 flex gap-3 justify-end">
            <Button onClick={onExtract} disabled={busy}>{busy?"Đang xử lý…":"Lấy chữ từ ảnh"}</Button>
            <Button onClick={onGrade} variant="ghost" disabled={busy}>{busy?"Đang chấm…":"Chấm điểm (theo exam)"}</Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <Section title="Kết quả OCR (Text)" />
          {text ? <pre className="whitespace-pre-wrap text-sm text-gray-800">{text}</pre> : <Empty title="Chưa có kết quả OCR" desc="Tải ảnh và nhấn 'Lấy chữ từ ảnh'." />}
        </Card>
        <Card>
          <Section title="Kết quả Chấm điểm" />
          {grade ? (
            <div className="text-sm">
              <div><span className="text-gray-500">OCR ID:</span> {grade.ocr_id}</div>
              <div><span className="text-gray-500">Exam ID:</span> {grade.exam_id}</div>
              <div><span className="text-gray-500">Học sinh:</span> {grade.student_name || "—"}</div>
              <div><span className="text-gray-500">Điểm:</span> <span className="font-semibold">{grade.score}</span></div>
              <div><span className="text-gray-500">Thời gian:</span> {new Date(grade.processed_at).toLocaleString()}</div>
            </div>
          ) : <Empty title="Chưa có điểm" desc="Tải ảnh và nhấn 'Chấm điểm'." />}
        </Card>
      </div>
    </div>
  );
}

/* -------- Orders -------- */
function OrdersPanel() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]); const [pkgLoading, setPkgLoading] = useState(false);
  const [packageId, setPackageId] = useState("");

  const load = async () => { setLoading(true); try { setItems(await listOrders()); } finally { setLoading(false); } };
  const loadPackages = async () => { setPkgLoading(true); try { const list = await listPackages(); setPackages(Array.isArray(list)?list:[]); } finally { setPkgLoading(false); } };
  useEffect(() => { load(); loadPackages(); }, []);

  const onCreateOrder = async (e) => { e.preventDefault(); if (!packageId) { alert("Vui lòng chọn gói"); return; } await createOrder(Number(packageId)); setPackageId(""); await load(); };

  return (
    <div className="grid gap-6">
      <Card>
        <Section title="Tạo Order gói VIP" />
        <form onSubmit={onCreateOrder} className="grid md:grid-cols-3 gap-4">
          <label className="block text-sm">
            <span className="block text-gray-600 mb-1">Chọn gói</span>
            <div className="flex items-center gap-2">
              <select
                value={packageId}
                onChange={(e)=>setPackageId(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{pkgLoading?"Đang tải gói...":"— Chọn một gói —"}</option>
                {packages.map((p)=> (
                  <option key={p.package_id} value={p.package_id}>
                    {p.name} — {new Intl.NumberFormat('vi-VN').format(Number(p.price||0))}đ / {p.duration_days} ngày
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                onClick={loadPackages}
                title="Làm mới danh sách gói"
                aria-label="Làm mới danh sách gói"
              >↻</button>
            </div>
          </label>
          <div className="md:col-span-3 flex justify-end"><Button type="submit">Tạo Order</Button></div>
        </form>
      </Card>
      <Card>
        <Section title="Danh sách Orders" right={<Button variant="ghost" onClick={load}>Làm mới</Button>} />
        {loading ? <div className="py-8 text-center text-gray-500">Đang tải…</div> :
          (items?.length||0)===0 ? <Empty /> :
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Package</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2 pr-4">Thanh toán</th>
                  <th className="py-2 pr-4">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {items.map((x)=>(
                  <tr key={x.order_id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{x.order_id}</td>
                    <td className="py-2 pr-4">{x.package_id}</td>
                    <td className="py-2 pr-4 font-medium">{x.status}</td>
                    <td className="py-2 pr-4">{x.paid_at ? new Date(x.paid_at).toLocaleString() : "—"}</td>
                    <td className="py-2 pr-4">{new Date(x.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
      </Card>
    </div>
  );
}

export default function TeacherDataPanels() {
  return (
    <div className="space-y-10">
      <div id="lesson-plan-panel">
        <TeacherLessonPlanManagement />
      </div>
      <div id="exams-panel"><ExamCreation /></div>
      <div id="ocr-panel"><OCRPanel /></div>
      <OrdersPanel />
    </div>
  );
}
