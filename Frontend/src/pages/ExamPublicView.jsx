import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, FileText, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const ExamPublicView = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        // Không cần apiFetch vì đây là route public
        const response = await fetch(`${API_URL}/exams/${examId}`);
        const result = await response.json();
        if (response.ok && result.status === 'success') {
          setExam(result.data);
        } else {
          throw new Error(result.message || 'Không thể tải đề thi.');
        }
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

  const handleSubmit = () => {
    if (window.confirm('Bạn có chắc muốn nộp bài?')) {
      let correctCount = 0;
      exam.questions.forEach(q => {
        if (String(answers[q.question_id]) === String(q.correct_answer)) {
          correctCount++;
        }
      });
      const finalScore = (correctCount / exam.questions.length) * 10;
      setScore(finalScore.toFixed(2));
      setSubmitted(true);
      toast.success(`Bạn đã nộp bài thành công! Điểm của bạn là: ${finalScore.toFixed(2)}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  if (!exam) {
    return <div className="text-center py-10"><p className="text-red-500 font-semibold">Không tìm thấy đề thi.</p></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-6 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{exam.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Môn học: {exam.subject}</p>
        </div>

        <div className="space-y-6">
          {exam.questions.map((q, index) => (
            <div key={q.question_id} className={`p-4 border rounded-md ${submitted ? (String(answers[q.question_id]) === String(q.correct_answer) ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-white'}`}>
              <p className="font-semibold mb-2">Câu {index + 1}: <span className="font-normal">{q.content}</span></p>
              <input
                type="text"
                placeholder="Nhập câu trả lời của bạn"
                value={answers[q.question_id] || ''}
                onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
                disabled={submitted}
                className="w-full border-gray-300 rounded-md p-2 text-sm"
              />
              {submitted && (
                <div className="mt-2 text-sm flex items-center">
                  {String(answers[q.question_id]) === String(q.correct_answer) ? <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : <XCircle className="w-4 h-4 text-red-600 mr-2" />}
                  <span>Đáp án đúng: <span className="font-bold">{q.correct_answer}</span></span>
                </div>
              )}
            </div>
          ))}
        </div>

        {!submitted && (
          <div className="mt-8 text-center">
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Nộp bài
            </button>
          </div>
        )}
        {submitted && (
            <div className="mt-8 text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Điểm số của bạn</p>
                <p className="text-4xl font-bold text-blue-600">{score}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ExamPublicView;