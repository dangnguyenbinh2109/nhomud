import React, { useState, useEffect } from 'react';
import { BookCopy, Database, Bot, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

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

const StaffDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const features = [
    {
      icon: <BookCopy size={24} />,
      title: 'Quản lý Kế hoạch bài học mẫu',
      description: 'Xây dựng các kế hoạch bài học dựa trên mẫu có sẵn.',
      link: '/staff/lesson-plans',
    },
    {
      icon: <Database size={24} />,
      title: 'Quản lý Ngân hàng câu hỏi',
      description: 'Tạo và quản lý câu hỏi theo môn, chủ đề, cấp độ.',
      link: '/staff/question-bank',
    },
    {
      icon: <Bot size={24} />,
      title: 'Quản lý Mẫu prompt AI',
      description: 'Tạo, đọc, cập nhật, xóa các mẫu prompt cho AI.',
      link: '/staff/prompt-templates',
    },
  ];

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoadingActivities(true);
        const [promptsRes, questionsRes, lessonPlansRes] = await Promise.all([
          apiFetch(`${API_URL}/prompt-templates`),
          apiFetch(`${API_URL}/questions`),
          apiFetch(`${API_URL}/lesson-plans`),
        ]);

        const promptsData = await promptsRes.json();
        const questionsData = await questionsRes.json();
        const lessonPlansData = await lessonPlansRes.json();

        let combinedActivities = [];

        // Xử lý Mẫu prompt
        if (promptsRes.ok && promptsData?.status === 'success' && Array.isArray(promptsData.data)) {
          const promptActivities = promptsData.data.map(prompt => ({
            id: `prompt-${prompt.prompt_id}`,
            icon: <Bot className="w-5 h-5 text-purple-500 mr-4" />,
            text: 'Đã tạo/cập nhật mẫu prompt:',
            title: prompt.name,
            date: new Date(prompt.updated_at || prompt.created_at),
          }));
          combinedActivities.push(...promptActivities);
        }

        // Xử lý Ngân hàng câu hỏi
        if (questionsRes.ok && questionsData?.status === 'success' && Array.isArray(questionsData.questions)) {
          const questionActivities = questionsData.questions.map(q => ({
            id: `question-${q.question_id}`,
            icon: <Database className="w-5 h-5 text-green-500 mr-4" />,
            text: 'Đã tạo/cập nhật câu hỏi:',
            title: q.content,
            date: new Date(q.updated_at || q.created_at),
          }));
          combinedActivities.push(...questionActivities);
        }

        // Xử lý Kế hoạch bài học
        if (lessonPlansRes.ok && lessonPlansData?.status === 'success' && Array.isArray(lessonPlansData.lesson_plans)) {
          const lessonPlanActivities = lessonPlansData.lesson_plans.map(plan => ({
            id: `lp-${plan.lesson_id}`,
            icon: <BookCopy className="w-5 h-5 text-blue-500 mr-4" />,
            text: 'Đã tạo/cập nhật kế hoạch bài học:',
            title: plan.title,
            date: new Date(plan.updated_at || plan.created_at),
          }));
          combinedActivities.push(...lessonPlanActivities);
        }

        // Sắp xếp và lấy 5 hoạt động gần nhất
        combinedActivities.sort((a, b) => b.date - a.date);
        setActivities(combinedActivities.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
        toast.error("Không thể tải hoạt động gần đây.");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển - Nhân viên</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Activity className="mr-3 text-gray-500" />
          Hoạt động gần đây
        </h2>
        {loadingActivities ? (
          <div className="flex justify-center items-center h-24"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {activities.length > 0 ? activities.map(activity => (
              <li key={activity.id} className="py-3 flex items-center text-sm">{activity.icon}<span className="text-gray-600">{activity.text}</span><span className="font-semibold text-gray-800 mx-1 truncate" title={activity.title}>"{activity.title}"</span><span className="text-gray-400 ml-auto flex-shrink-0">{formatDistanceToNow(activity.date, { addSuffix: true, locale: vi })}</span></li>
            )) : (<p className="text-center text-gray-500 py-4">Chưa có hoạt động nào gần đây.</p>)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;