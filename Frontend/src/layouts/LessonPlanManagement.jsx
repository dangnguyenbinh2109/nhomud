import React, { useState, useEffect } from 'react';
import { BookCopy, PlusCircle, Search, Loader2, Edit, Trash2, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const formatApiErrors = (errors) => {
  if (typeof errors === 'string') return errors;
  if (typeof errors === 'object' && errors !== null) {
    return Object.entries(errors)
      .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
      .join('; ');
  }
  return 'Có lỗi không xác định xảy ra.';
};

const LessonPlanModal = ({ plan, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    description: plan?.description || '',
  });

  const isEditMode = !!plan;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Tên kế hoạch không được để trống.');
      return;
    }
    onSave(formData, plan?.lesson_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa Kế hoạch' : 'Tạo Kế hoạch mới'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên kế hoạch</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Hủy</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LessonPlanManagement = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/lesson-plans`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.lesson_plans)) {
        setLessonPlans(data.lesson_plans);
      } else {
        throw new Error('Invalid data structure from API');
      }
    } catch (e) {
      toast.error(`Lỗi tải dữ liệu: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const handleOpenModal = (plan = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (formData, lessonId) => {
    setIsSubmitting(true);
    const isEditMode = !!lessonId;
    const url = isEditMode ? `${API_URL}/lesson-plans/${lessonId}` : `${API_URL}/lesson-plans`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.status === 'success') {
        toast.success(result.message || `Đã ${isEditMode ? 'cập nhật' : 'tạo'} kế hoạch thành công!`);
        handleCloseModal();
        fetchLessonPlans(); // Tải lại danh sách
      } else {
        throw new Error(formatApiErrors(result.message || result.errors) || 'Có lỗi xảy ra');
      }
    } catch (e) {
      toast.error(`Lỗi lưu kế hoạch: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (plan) => {
    if (window.confirm(`Bạn có chắc muốn xóa kế hoạch "${plan.title}"?`)) {
      const toastId = toast.loading('Đang xóa...');
      try {
        const response = await apiFetch(`${API_URL}/lesson-plans/${plan.lesson_id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
          toast.success(result.message, { id: toastId });
          setLessonPlans(prev => prev.filter(p => p.lesson_id !== plan.lesson_id));
        } else {
          throw new Error(result.message || 'Không thể xóa kế hoạch.');
        }
      } catch (e) {
        toast.error(`Lỗi: ${e.message}`, { id: toastId });
      }
    }
  };

  const filteredPlans = lessonPlans.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <Link to="/staff/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookCopy className="mr-3" />
                Quản lý Kế hoạch bài học mẫu
            </h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="mr-2 h-5 w-5" />
          Thêm kế hoạch mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên kế hoạch..."
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-1/3 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        {loading && <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>}
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên kế hoạch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPlans.map((plan) => (
              <tr key={plan.lesson_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate" title={plan.description}>{plan.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(plan.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(plan)} className="text-indigo-600 hover:text-indigo-900 p-1"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(plan)} className="text-red-600 hover:text-red-900 ml-2 p-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredPlans.length === 0 && <div className="text-center py-10 text-gray-500">Không tìm thấy kế hoạch bài học nào.</div>}
      </div>

      {isModalOpen && (
        <LessonPlanModal
          plan={editingPlan}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          loading={isSubmitting}
        />
      )}
    </div>
  );
};

export default LessonPlanManagement;