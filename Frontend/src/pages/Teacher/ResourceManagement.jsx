import React, { useState, useEffect } from 'react';
import { FolderKanban, BookCopy, Database, FileArchive, PlusCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const ResourceManagement = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState({ lessonPlans: true });

  const myDocuments = [
    { id: 1, name: "Đề thi tham khảo học kỳ 2.pdf", size: "1.2MB" },
    { id: 2, name: "Sơ đồ tư duy Ankan.png", size: "800KB" },
  ];

  useEffect(() => {
    const fetchLessonPlans = async () => {
      try {
        setLoading(prev => ({ ...prev, lessonPlans: true }));
        const response = await apiFetch(`${API_URL}/lesson-plans`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.lesson_plans)) {
          setLessonPlans(data.lesson_plans.slice(0, 5)); // Lấy 5 kế hoạch bài học gần nhất
        } else {
          throw new Error('Cấu trúc dữ liệu API không hợp lệ');
        }
      } catch (e) {
        toast.error(`Lỗi tải kế hoạch bài học: ${e.message}`);
      } finally {
        setLoading(prev => ({ ...prev, lessonPlans: false }));
      }
    };

    fetchLessonPlans();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FolderKanban className="mr-3" />
        Quản lý Tài nguyên
      </h1>
      <p className="text-gray-600 mb-8">
        Đây là không gian làm việc cá nhân của bạn. Lưu trữ, tổ chức và quản lý các tài liệu giảng dạy, ngân hàng câu hỏi riêng và các kế hoạch bài học đã tạo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cột Kế hoạch bài học */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BookCopy className="mr-3 text-blue-500" />
            Kế hoạch bài học của tôi
          </h2>
          {loading.lessonPlans ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : (
            <ul className="space-y-3">
              {lessonPlans.length > 0 ? lessonPlans.map(plan => (
                <li key={plan.lesson_id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  <span className="text-sm font-medium truncate" title={plan.title}>{plan.title}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{new Date(plan.created_at).toLocaleDateString()}</span>
                </li>
              )) : <p className="text-sm text-gray-500">Chưa có kế hoạch bài học nào.</p>}
            </ul>
          )}
          <Link to="/teacher/lesson-plans" className="mt-4 text-sm text-blue-600 hover:underline block">Xem tất cả</Link>
        </div>

        {/* Cột Tài liệu khác */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileArchive className="mr-3 text-orange-500" />Tài liệu tham khảo</h2>
          <p className="text-xs text-gray-400 mb-3">(Chức năng đang phát triển)</p>
          <ul className="space-y-3 opacity-50">{myDocuments.map(doc => (<li key={doc.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50"><span className="text-sm font-medium truncate">{doc.name}</span><span className="text-xs text-gray-400">{doc.size}</span></li>))}</ul>
          <button disabled className="mt-4 w-full flex items-center justify-center py-2 bg-orange-50 text-orange-600 rounded-md cursor-not-allowed"><PlusCircle size={16} className="mr-2" /> Tải lên tài liệu mới</button>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;