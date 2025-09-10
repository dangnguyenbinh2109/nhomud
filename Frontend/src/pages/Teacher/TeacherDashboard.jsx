import React, { useState, useEffect } from 'react';
import { BookText, FileText, ScanLine, FolderKanban, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { apiFetch } from '../../utils/api';

// Re-using the FeatureCard component structure from other dashboards
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const FeatureCard = ({ icon, title, description, link }) => (
  <Link to={link} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 hover:border-blue-500">
    <div className="flex items-start">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </Link>
);

const TeacherDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Features based on the provided documentation for the 'Teacher' role
  const features = [
    {
      icon: <BookText size={24} />,
      title: 'Quản lý Kế hoạch bài học',
      description: 'Thiết kế, tạo mới và chỉnh sửa các kế hoạch bài học cá nhân.',
      link: '/teacher/lesson-plans',
    },
    {
      icon: <FileText size={24} />,
      title: 'Tạo Đề thi & Bài tập',
      description: 'Tạo đề thi trắc nghiệm và các dạng bài tập đa dạng từ ngân hàng câu hỏi.',
      link: '/teacher/create-exam',
    },
    {
      icon: <ScanLine size={24} />,
      title: 'Chấm bài bằng OCR',
      description: 'Chuyển đổi bài làm giấy sang kỹ thuật số và chấm điểm trắc nghiệm tự động.',
      link: '/teacher/ocr-grading',
    },
    {
      icon: <FolderKanban size={24} />,
      title: 'Quản lý Tài nguyên',
      description: 'Lưu trữ, tổ chức tài liệu tham khảo và các tài nguyên giảng dạy cá nhân.',
      link: '/teacher/resources',
    },
  ];

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoadingActivities(true);
        const [lessonPlansRes, examsRes] = await Promise.all([
          apiFetch(`${API_URL}/lesson-plans`),
          apiFetch(`${API_URL}/exams`)
        ]);

        const lessonPlansData = await lessonPlansRes.json();
        const examsData = await examsRes.json();

        let combinedActivities = [];

        if (lessonPlansRes.ok && lessonPlansData.status === 'success' && Array.isArray(lessonPlansData.lesson_plans)) {
          const lessonPlanActivities = lessonPlansData.lesson_plans.map(plan => ({
            id: `lp-${plan.lesson_id}`,
            icon: <BookText className="w-5 h-5 text-blue-500 mr-4" />,
            text: 'Đã tạo/cập nhật kế hoạch bài học:',
            title: plan.title,
            date: new Date(plan.created_at),
          }));
          combinedActivities.push(...lessonPlanActivities);
        }

        if (examsRes.ok && Array.isArray(examsData)) {
          const examActivities = examsData.map(exam => ({
            id: `ex-${exam.exam_id}`,
            icon: <FileText className="w-5 h-5 text-green-500 mr-4" />,
            text: 'Đã tạo đề thi mới:',
            title: exam.title,
            date: new Date(exam.created_at),
          }));
          combinedActivities.push(...examActivities);
        }

        combinedActivities.sort((a, b) => b.date - a.date);
        setActivities(combinedActivities.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển - Giáo viên</h1>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="mr-3 text-gray-500" />
          Hoạt động gần đây
        </h2>
        {loadingActivities ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {activities.length > 0 ? activities.map(activity => (
              <li key={activity.id} className="py-3 flex items-center text-sm">
                {activity.icon}
                <span className="text-gray-600">{activity.text}</span>
                <span className="font-semibold text-gray-800 mx-1 truncate" title={activity.title}>"{activity.title}"</span>
                <span className="text-gray-400 ml-auto flex-shrink-0">{formatDistanceToNow(activity.date, { addSuffix: true, locale: vi })}</span>
              </li>
            )) : (
              <p className="text-center text-gray-500 py-4">Chưa có hoạt động nào gần đây.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;