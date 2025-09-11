import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const ExamView = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentInfo, setStudentInfo] = useState({ name: '', studentId: '' });
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        // Bước 1: Lấy thông tin đề thi và danh sách ID câu hỏi
        const examResponse = await apiFetch(`${API_URL}/public/exams/${examId}`);
        const examResult = await examResponse.json();
        if (!examResponse.ok || examResult.status !== 'success') {
          throw new Error(examResult.message || 'Không thể tải chi tiết đề thi.');
        }
        const examData = examResult.data;
        const questionIds = new Set(examData.questions || []);

        if (questionIds.size === 0) {
            setExam(examData); // Hiển thị đề thi dù không có câu hỏi
            return;
        }

        // Bước 2: Lấy danh sách câu hỏi công khai (không có đáp án)
        const questionsResponse = await apiFetch(`${API_URL}/public/questions`);
        const questionsResult = await questionsResponse.json();
        if (!questionsResponse.ok || questionsResult.status !== 'success') {
            throw new Error(questionsResult.message || 'Không thể tải danh sách câu hỏi.');
        }
        const publicQuestions = questionsResult.questions || [];

        // Bước 3: Lọc và ghép nối dữ liệu
        const detailedQuestions = publicQuestions.filter(q => questionIds.has(q.question_id));

        // Cập nhật state với đầy đủ nội dung câu hỏi
        setExam({ ...examData, questions: detailedQuestions });

      } catch (error) {
        toast.error(error.message);
        setExam(null);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleStudentInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleStartTest = () => {
    if (!studentInfo.name.trim() || !studentInfo.studentId.trim()) {
      toast.error('Vui lòng nhập đầy đủ Tên và Số báo danh.');
      return;
    }
    setIsTestStarted(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== exam.questions.length) {
      if (!window.confirm('Bạn chưa hoàn thành tất cả các câu hỏi. Bạn có chắc muốn nộp bài?')) {
        return;
      }
    }
    setSubmitting(true);
    try {
      // Đây là một ví dụ, bạn cần tạo API endpoint này ở backend
      // const response = await apiFetch(`${API_URL}/exams/${examId}/submit`, {
      //   method: 'POST',
      //   body: JSON.stringify({ ...studentInfo, answers }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Lỗi nộp bài');
      // setResult(data.result); // Giả sử API trả về kết quả
      toast.success('Nộp bài thành công! Đây là dữ liệu giả.');
      setResult({ score: 8.5, correct: 17, total: 20 }); // Dữ liệu giả
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-500 font-semibold">Không tìm thấy đề thi hoặc đã có lỗi xảy ra.</p>
        <button onClick={() => window.history.back()} className="mt-4 inline-block text-blue-600 hover:underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Hoàn thành bài thi!</h2>
        <p className="text-lg">Thí sinh: <span className="font-semibold">{studentInfo.name}</span> - SBD: <span className="font-semibold">{studentInfo.studentId}</span></p>
        <div className="my-6">
          <p className="text-xl">Điểm số của bạn:</p>
          <p className="text-5xl font-bold text-blue-600 my-2">{result.score.toFixed(2)}</p>
          <p className="text-gray-600">Số câu đúng: {result.correct}/{result.total}</p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-4 inline-block text-blue-600 hover:underline">Làm lại bài thi khác</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100 mr-4" title="Quay lại">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
          <p className="text-sm text-gray-500">Môn học: {exam.subject} - ID: {exam.exam_id}</p>
        </div>
      </div>

      {!isTestStarted ? (
        <div className="max-w-md mx-auto mt-8">
          <h2 className="text-xl font-semibold text-center mb-4">Thông tin thí sinh</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={studentInfo.name}
              onChange={handleStudentInfoChange}
              placeholder="Họ và tên"
              className="w-full border-gray-300 rounded-md p-2"
            />
            <input
              type="text"
              name="studentId"
              value={studentInfo.studentId}
              onChange={handleStudentInfoChange}
              placeholder="Số báo danh"
              className="w-full border-gray-300 rounded-md p-2"
            />
          </div>
          <button onClick={handleStartTest} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Bắt đầu làm bài
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Nội dung đề thi ({exam.questions?.length || 0} câu)</h2>
          <div className="space-y-6">
            {exam.questions && exam.questions.length > 0 ? (
              exam.questions.map((question, index) => (
                <div key={question.question_id} className="p-4 border rounded-md bg-gray-50">
                  <p className="font-semibold mb-3">Câu {index + 1}: <span className="font-normal">{question.content}</span></p>
                  <div className="flex space-x-6">
                    {['A', 'B', 'C', 'D'].map(option => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${question.question_id}`}
                          value={option}
                          checked={answers[question.question_id] === option}
                          onChange={() => handleAnswerChange(question.question_id, option)}
                          className="h-4 w-4"
                        />
                        <span className="ml-2 font-medium">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Đề thi này chưa có câu hỏi.</p>
            )}
          </div>
          <div className="mt-8 text-center">
            <button type="submit" disabled={submitting} className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center mx-auto">
              {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
              Nộp bài
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExamView;