import React, { useState, useEffect, useMemo } from 'react';
import { FileText, PlusCircle, Search, Loader2, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const ExamModal = ({ exam, questionsList, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    title: exam?.title || '',
    subject: exam?.subject || 'Hóa học',
  });
  const [selectedQuestions, setSelectedQuestions] = useState(new Set(exam?.questions || []));
  const [searchTerm, setSearchTerm] = useState('');

  const isEditMode = !!exam;

  const handleQuestionToggle = (questionId) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedQuestions.size === 0) {
      toast.error('Vui lòng chọn ít nhất một câu hỏi.');
      return;
    }
    onSave({ ...formData, questions: Array.from(selectedQuestions) }, exam?.exam_id);
  };

  const filteredQuestions = useMemo(() => 
    questionsList.filter(q => 
      q.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
      q.question_id.toString().includes(searchTerm)
    ), [questionsList, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa Đề thi' : 'Tạo Đề thi mới'}</h2>
            <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Tên đề thi" required className="w-full border-gray-300 rounded-md" />
            <input type="text" name="subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Môn học" required className="w-full border-gray-300 rounded-md" />
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Chọn câu hỏi ({selectedQuestions.size} đã chọn)</h3>
            <input type="text" placeholder="Tìm câu hỏi theo ID hoặc nội dung..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full border-gray-300 rounded-md mb-2" />
            <div className="border rounded-md max-h-60 overflow-y-auto p-2">
              {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
                <div key={q.question_id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                  <input
                    type="checkbox"
                    id={`q-${q.question_id}`}
                    checked={selectedQuestions.has(q.question_id)}
                    onChange={() => handleQuestionToggle(q.question_id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`q-${q.question_id}`} className="ml-3 text-sm text-gray-700 cursor-pointer w-full">
                    <span className="font-bold">ID: {q.question_id}</span> - <span className="truncate">{q.content}</span>
                  </label>
                </div>
              )) : <p className="text-sm text-gray-500 p-2">Không tìm thấy câu hỏi.</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Hủy</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExamCreation = () => {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState({ exams: true, questions: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    // --- Dữ liệu mẫu để phát triển ---
    const mockQuestions = [
        { question_id: 1, content: "Câu hỏi mẫu 1: Ankan là gì?", subject: "Hóa học" },
        { question_id: 2, content: "Câu hỏi mẫu 2: Công thức của axit sunfuric?", subject: "Hóa học" },
        { question_id: 3, content: "Câu hỏi mẫu 3: Phản ứng este hóa là gì?", subject: "Hóa học" },
    ];
    // ---------------------------------

    try {
      // Fetch exams
      const examsResponse = await apiFetch(`${API_URL}/exams`);
      if (!examsResponse.ok) throw new Error('Failed to fetch exams');
      const examsData = await examsResponse.json();
      setExams(Array.isArray(examsData) ? examsData : []);
    } catch (e) {
      toast.error(`Lỗi tải đề thi: ${e.message}`);
    } finally {
      setLoading(prev => ({ ...prev, exams: false }));
    }

    try {
      // Fetch questions
      const questionsResponse = await apiFetch(`${API_URL}/questions`);
      if (!questionsResponse.ok) throw new Error('Failed to fetch questions');
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData.status === 'success' && Array.isArray(questionsData.questions) ? questionsData.questions : []);
    } catch (e) {
      const errorMessage = `Lỗi tải câu hỏi: ${e.message}. Hiển thị dữ liệu mẫu.`;
      toast.error(errorMessage, { duration: 5000 });
      // Nếu lỗi, sử dụng dữ liệu mẫu
      setQuestions(mockQuestions);
    } finally {
      setLoading(prev => ({ ...prev, questions: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (exam = null) => {
    setEditingExam(exam);
    setIsModalOpen(true);
  };

  const handleSaveExam = async (formData, examId) => {
    setIsSubmitting(true);
    const isEditMode = !!examId;
    const url = isEditMode ? `${API_URL}/exams/${examId}` : `${API_URL}/exams`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        toast.success(result.message);
        setIsModalOpen(false);
        setLoading(prev => ({ ...prev, exams: true }));
        const examsResponse = await apiFetch(`${API_URL}/exams`);
        const examsData = await examsResponse.json();
        setExams(Array.isArray(examsData) ? examsData : []);
      } else {
        throw new Error(result.message || 'Lỗi không xác định');
      }
    } catch (e) {
      toast.error(`Lỗi lưu đề thi: ${e.message}`);
    } finally {
      setIsSubmitting(false);
      setLoading(prev => ({ ...prev, exams: false }));
    }
  };

  const handleDeleteExam = async (exam) => {
    if (window.confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}"?`)) {
      const toastId = toast.loading('Đang xóa...');
      try {
        const response = await apiFetch(`${API_URL}/exams/${exam.exam_id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
          toast.success(result.message, { id: toastId });
          setExams(prev => prev.filter(e => e.exam_id !== exam.exam_id));
        } else {
          throw new Error(result.message || 'Không thể xóa đề thi.');
        }
      } catch (e) {
        toast.error(`Lỗi: ${e.message}`, { id: toastId });
      }
    }
  };

  const isLoading = loading.exams || loading.questions;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center"><FileText className="mr-3" />Quản lý Đề thi</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <PlusCircle className="mr-2 h-5 w-5" />
          Tạo Đề thi
        </button>
      </div>

      <div className="overflow-x-auto relative">
        {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
        )}
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên Đề thi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Môn học</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số câu hỏi</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!isLoading && exams.map((exam) => (
              <tr key={exam.exam_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{exam.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{exam.questions?.length || 0}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(exam)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Chỉnh sửa">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteExam(exam)} className="text-red-600 hover:text-red-900 ml-2 p-1" title="Xóa">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && exams.length === 0 && <div className="text-center py-10 text-gray-500">Chưa có đề thi nào. Hãy tạo một đề thi mới.</div>}
      </div>

      {isModalOpen && (
        <ExamModal 
            exam={editingExam} 
            questionsList={questions}
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveExam} 
            loading={isSubmitting} 
        />
      )}
    </div>
  );
};

export default ExamCreation;