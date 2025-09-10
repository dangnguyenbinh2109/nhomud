import React from 'react';
import { Users, Settings, BookCopy, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const AdminDashboard = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: 'Quản lý người dùng',
      description: 'Tạo, cập nhật, quản lý tài khoản và phân quyền cho người dùng.',
      link: '/admin/user-management',
    },
    {
      icon: <Settings size={24} />,
      title: 'Cấu hình hệ thống',
      description: 'Thiết lập các cài đặt và hành vi toàn cục của ứng dụng.',
      link: '/admin/system-settings',
    },
    {
      icon: <BookCopy size={24} />,
      title: 'Quản lý khung chương trình',
      description: 'Thiết kế và quản lý các mẫu kế hoạch bài học (mục tiêu, hoạt động, đánh giá).',
      link: '/admin/lesson-plan-templates',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Theo dõi doanh thu',
      description: 'Xem báo cáo về đăng ký, doanh số và tổng doanh thu.',
      link: '/admin/revenue',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển - Quản trị viên</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* You can add a recent activity section here later, similar to other dashboards */}
    </div>
  );
};

export default AdminDashboard;