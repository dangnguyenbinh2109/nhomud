import React, { useState, useEffect } from 'react';
import { BookText, PlusCircle, Search, Loader2, Edit, Trash2, ArrowLeft, X, File, Bot, BookCopy, Wand2 } from 'lucide-react';
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

const LessonPlanModal = ({ plan, onClose, onSave, loading, initialData }) => {
  const [formData, setFormData] = useState({
    title: plan?.title || initialData?.title || '',
    description: plan?.description || initialData?.description || '',
  });

  useEffect(() => {
    // Đồng bộ formData với props khi chúng thay đổi (quan trọng cho việc nhận dữ liệu từ AI/Template)
    setFormData({
      title: plan?.title || initialData?.title || '',
      description: plan?.description || initialData?.description || '',
    });
  }, [plan, initialData]);


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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
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

const CreateModeModal = ({ onClose, onSelect }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Chọn phương thức tạo kế hoạch</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => onSelect('manual')} className="p-4 border rounded-lg hover:bg-gray-100 text-center">
          <File size={32} className="mx-auto mb-2" />
          <span className="font-semibold">Tạo thủ công</span>
        </button>
        <button onClick={() => onSelect('template')} className="p-4 border rounded-lg hover:bg-gray-100 text-center">
          <BookCopy size={32} className="mx-auto mb-2" />
          <span className="font-semibold">Từ khung chương trình</span>
        </button>
        <button onClick={() => onSelect('ai')} className="p-4 border rounded-lg hover:bg-gray-100 text-center">
          <Bot size={32} className="mx-auto mb-2" />
          <span className="font-semibold">Với Prompt AI</span>
        </button>
      </div>
    </div>
  </div>
);

const TemplateSelectorModal = ({ onClose, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await apiFetch(`${API_URL}/lesson-plan-templates`);
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setTemplates(data.data);
        } else {
          throw new Error(data.message || 'Không thể tải mẫu.');
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chọn Khung chương trình</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <div className="overflow-y-auto">
          {loading ? <Loader2 className="animate-spin mx-auto" /> : (
            <ul className="divide-y divide-gray-200">
              {templates.map(template => (
                <li key={template.template_id} onClick={() => onSelectTemplate(template)} className="p-4 hover:bg-gray-100 cursor-pointer">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const AiGeneratorModal = ({ onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    const fetchPromptTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const response = await apiFetch(`${API_URL}/prompt-templates`);
        const data = await response.json();
        if (response.ok && data.status === 'success') {
          setPromptTemplates(data.data);
        } else {
          throw new Error(data.message || 'Không thể tải các mẫu prompt.');
        }
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchPromptTemplates();
  }, []);

  const handleTemplateChange = (e) => {
    const selectedContent = e.target.value;
    setPrompt(selectedContent);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Vui lòng nhập prompt.');
      return;
    }
    setLoading(true);
    try {
      // This is a presumed API endpoint. The backend needs to implement this.
      const response = await apiFetch(`${API_URL}/ai/generate-from-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        // Sửa lỗi: Truy cập vào data.data.content thay vì data.content để lấy đúng nội dung từ API.
        const generatedContent = data.data?.content || '';
        onGenerate({ title: 'Kế hoạch bài học từ AI', description: generatedContent });
      } else {
        throw new Error(data.message || 'AI không thể tạo nội dung.');
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tạo nội dung với AI</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn mẫu prompt có sẵn (tùy chọn)</label>
            <select onChange={handleTemplateChange} disabled={loadingTemplates} className="w-full border rounded-md p-2 bg-gray-50">
                <option value="">{loadingTemplates ? 'Đang tải mẫu...' : 'Tự nhập hoặc chọn một mẫu'}</option>
                {promptTemplates.map(template => (
                    <option key={template.prompt_id} value={template.content}>
                        {template.name}
                    </option>
                ))}
            </select>
        </div>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows="5" placeholder="Nhập yêu cầu của bạn, ví dụ: 'Tạo kế hoạch bài học về chủ đề axit và bazơ cho lớp 11'..." className="w-full border rounded-md p-2 mb-4"></textarea>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Hủy</button>
          <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center disabled:bg-purple-300">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />} Tạo nội dung
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherLessonPlanManagement = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    createMode: false,
    templateSelector: false,
    aiGenerator: false,
  });
  const [initialPlanData, setInitialPlanData] = useState(null);

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

  const handleSelectCreationMode = (mode) => {
    setModalState({ createMode: false, templateSelector: false, aiGenerator: false });
    if (mode === 'manual') {
      setInitialPlanData(null);
      handleOpenModal();
    } else if (mode === 'template') {
      setModalState(prev => ({ ...prev, templateSelector: true }));
    } else if (mode === 'ai') {
      setModalState(prev => ({ ...prev, aiGenerator: true }));
    }
  };

  const handleTemplateSelected = (template) => {
    // Sửa lỗi: Thêm optional chaining (?.) và giá trị mặc định ([]) để tránh lỗi khi structure hoặc các thuộc tính con không tồn tại.
    const objectives = (template.structure?.objectives || []).join('\n- ');
    const activities = (template.structure?.activities || []).join('\n- ');
    const assessments = (template.structure?.assessments || []).join('\n- ');
    const description = `Dựa trên mẫu: ${template.name}\n\nMục tiêu:\n- ${objectives}\n\nHoạt động:\n- ${activities}\n\nĐánh giá:\n- ${assessments}`;
    setInitialPlanData({ title: template.name, description });
    setModalState(prev => ({ ...prev, templateSelector: false }));
    handleOpenModal();
  };

  const handleAiContentGenerated = (data) => {
    setInitialPlanData(data);
    setModalState(prev => ({ ...prev, aiGenerator: false }));
    handleOpenModal();
  };

  const handleOpenModal = (plan = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setModalState(prev => ({ ...prev, createMode: true }));
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setInitialPlanData(null); // Reset initial data
  };

  const handleCloseAllModals = () => {
    setModalState({
      createMode: false,
      templateSelector: false,
      aiGenerator: false,
    });
    handleCloseModal();
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
        fetchLessonPlans();
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
            <Link to="/teacher/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookText className="mr-3" />
                Quản lý Kế hoạch bài học cá nhân
            </h1>
        </div>
        <button onClick={handleOpenCreateModal} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="mr-2 h-5 w-5" />
          Thêm kế hoạch mới
        </button>
      </div>

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
        {!loading && filteredPlans.length === 0 && <div className="text-center py-10 text-gray-500">Bạn chưa có kế hoạch bài học nào.</div>}
      </div>

      {isModalOpen && (
        <LessonPlanModal
          plan={editingPlan}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          loading={isSubmitting}
          initialData={initialPlanData}
        />
      )}

      {modalState.createMode && (
        <CreateModeModal
          onClose={handleCloseAllModals}
          onSelect={handleSelectCreationMode}
        />
      )}

      {modalState.templateSelector && (
        <TemplateSelectorModal
          onClose={handleCloseAllModals}
          onSelectTemplate={handleTemplateSelected}
        />
      )}

      {modalState.aiGenerator && (
        <AiGeneratorModal
          onClose={handleCloseAllModals}
          onGenerate={handleAiContentGenerated}
        />
      )}
    </div>
  );
};

export default TeacherLessonPlanManagement;