import React, { useState, useEffect } from 'react';
import { Database, PlusCircle, Search, Loader2, Edit, Trash2, ArrowLeft, X } from 'lucide-react';
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

const QuestionModal = ({ question, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    content: question?.content || '',
    subject: question?.subject || '',
    difficulty_level: question?.difficulty_level || '',
    correct_answer: question?.correct_answer || '',
  });

  const isEditMode = !!question;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.content.trim() || !formData.subject.trim() || !formData.correct_answer.trim()) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    onSave(formData, question?.question_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nội dung câu hỏi</label>
              <textarea name="content" value={formData.content} onChange={handleChange} required rows="5" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Môn học</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mức độ khó</label>
                <input type="text" name="difficulty_level" value={formData.difficulty_level} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Đáp án đúng</label>
                <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
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

const QuestionBankManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/questions`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.questions)) {
        setQuestions(data.questions);
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
    fetchQuestions();
  }, []);

  const handleOpenModal = (question = null) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async (formData, questionId) => {
    setIsSubmitting(true);
    const isEditMode = !!questionId;
    const url = isEditMode ? `${API_URL}/questions/${questionId}` : `${API_URL}/questions`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        toast.success(result.message || `Đã ${isEditMode ? 'cập nhật' : 'tạo'} câu hỏi thành công!`);
        handleCloseModal();
        fetchQuestions();
      } else {
        throw new Error(formatApiErrors(result.message || result.errors) || 'Có lỗi xảy ra');
      }
    } catch (e) {
      toast.error(`Lỗi lưu câu hỏi: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (question) => {
    if (window.confirm(`Bạn có chắc muốn xóa câu hỏi: "${question.content.substring(0, 50)}..."?`)) {
      const toastId = toast.loading('Đang xóa...');
      try {
        const response = await apiFetch(`${API_URL}/questions/${question.question_id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
          toast.success(result.message, { id: toastId });
          setQuestions(prev => prev.filter(q => q.question_id !== question.question_id));
        } else {
          throw new Error(result.message || 'Không thể xóa câu hỏi.');
        }
      } catch (e) {
        toast.error(`Lỗi: ${e.message}`, { id: toastId });
      }
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
            <Link to="/staff/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Database className="mr-3" />
              Quản lý Ngân hàng câu hỏi
            </h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="mr-2 h-5 w-5" />
          Thêm câu hỏi mới
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo nội dung, chủ đề..."
            className="pl-10 pr-4 py-2 border rounded-md w-80 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Thêm các bộ lọc khác ở đây (môn học, cấp độ,...) */}
      </div>

      {/* Questions Table */}
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        )}
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung câu hỏi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Môn học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấp độ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuestions.map((q) => (
              <tr key={q.question_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 max-w-lg truncate" title={q.content}>{q.content}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {q.difficulty_level || 'Chưa xác định'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(q.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(q)} className="text-indigo-600 hover:text-indigo-900 p-1">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteQuestion(q)} className="text-red-600 hover:text-red-900 ml-2 p-1">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filteredQuestions.length === 0 && (
            <div className="text-center py-10 text-gray-500">Không tìm thấy câu hỏi nào.</div>
        )}
      </div>
      {isModalOpen && (
        <QuestionModal
          question={editingQuestion}
          onClose={handleCloseModal}
          onSave={handleSaveQuestion}
          loading={isSubmitting}
        />
      )}
    </div>
  );
};

export default QuestionBankManagement;