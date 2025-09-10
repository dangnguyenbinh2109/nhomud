import React, { useState, useEffect } from 'react';
import { BookCopy, PlusCircle, Search, Loader2, Edit, Trash2, ArrowLeft, X, Plus, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/api';

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

const StructureField = ({ label, items, onUpdate }) => {
  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate(newItems);
  };

  const handleAddItem = () => {
    onUpdate([...items, '']);
  };

  const handleRemoveItem = (index) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-grow border-gray-300 rounded-md shadow-sm"
            />
            <button type="button" onClick={() => handleRemoveItem(index)} className="p-1 text-red-500 hover:text-red-700">
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddItem} className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800">
        <Plus size={16} className="mr-1" /> Thêm {label.toLowerCase()}
      </button>
    </div>
  );
};

const TemplateModal = ({ template, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    structure: {
      objectives: template?.structure?.objectives || [],
      activities: template?.structure?.activities || [],
      assessments: template?.structure?.assessments || [],
    },
  });

  const isEditMode = !!template;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStructureChange = (field, items) => {
    setFormData(prev => ({
      ...prev,
      structure: { ...prev.structure, [field]: items },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Tên mẫu không được để trống.');
      return;
    }
    onSave(formData, template?.template_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 -mt-2">
          <h2 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa Mẫu' : 'Tạo Mẫu mới'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên mẫu</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-semibold">Cấu trúc mẫu</h3>
                <StructureField label="Mục tiêu" items={formData.structure.objectives} onUpdate={(items) => handleStructureChange('objectives', items)} />
                <StructureField label="Hoạt động" items={formData.structure.activities} onUpdate={(items) => handleStructureChange('activities', items)} />
                <StructureField label="Đánh giá" items={formData.structure.assessments} onUpdate={(items) => handleStructureChange('assessments', items)} />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white py-3 -mb-2">
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

const LessonPlanTemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/lesson-plan-templates`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setTemplates(data.data);
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
    fetchTemplates();
  }, []);

  const handleOpenModal = (template = null) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSaveTemplate = async (formData, templateId) => {
    setIsSubmitting(true);
    const isEditMode = !!templateId;
    const url = isEditMode ? `${API_URL}/lesson-plan-templates/${templateId}` : `${API_URL}/lesson-plan-templates`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.status === 'success') {
        toast.success(result.message || `Đã ${isEditMode ? 'cập nhật' : 'tạo'} mẫu thành công!`);
        handleCloseModal();
        fetchTemplates();
      } else {
        throw new Error(formatApiErrors(result.message || result.errors) || 'Có lỗi xảy ra');
      }
    } catch (e) {
      toast.error(`Lỗi lưu mẫu: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (template) => {
    if (window.confirm(`Bạn có chắc muốn xóa mẫu "${template.name}"?`)) {
      const toastId = toast.loading('Đang xóa...');
      try {
        const response = await apiFetch(`${API_URL}/lesson-plan-templates/${template.template_id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
          toast.success(result.message, { id: toastId });
          setTemplates(prev => prev.filter(t => t.template_id !== template.template_id));
        } else {
          throw new Error(result.message || 'Không thể xóa mẫu.');
        }
      } catch (e) {
        toast.error(`Lỗi: ${e.message}`, { id: toastId });
      }
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookCopy className="mr-3" />
                Quản lý Khung chương trình
            </h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="mr-2 h-5 w-5" />
          Thêm mẫu mới
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên mẫu..."
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-1/3 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto relative">
        {loading && <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>}
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên mẫu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template.template_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate" title={template.description}>{template.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(template.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(template)} className="text-indigo-600 hover:text-indigo-900 p-1"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(template)} className="text-red-600 hover:text-red-900 ml-2 p-1"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredTemplates.length === 0 && <div className="text-center py-10 text-gray-500">Chưa có mẫu kế hoạch bài học nào.</div>}
      </div>

      {isModalOpen && (
        <TemplateModal
          template={editingTemplate}
          onClose={handleCloseModal}
          onSave={handleSaveTemplate}
          loading={isSubmitting}
        />
      )}
    </div>
  );
};

export default LessonPlanTemplateManagement;