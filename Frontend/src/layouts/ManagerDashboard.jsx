import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, CheckSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

// Reusable StatCard component
const StatCard = ({ icon, title, value, link, linkText, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
    {link && (
      <div className="mt-4">
        <Link to={link} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          {linkText} &rarr;
        </Link>
      </div>
    )}
  </div>
);

// Custom hook to fetch dashboard stats
const useManagerDashboardStats = () => {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    pendingContent: 0,
    totalPackages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sử dụng Promise.allSettled để xử lý lỗi của từng API một cách độc lập
        const results = await Promise.allSettled([
          apiFetch(`${API_URL}/orders`),
          apiFetch(`${API_URL}/contents/pending`),
          apiFetch(`${API_URL}/packages`),
        ]);

        let pendingOrdersCount = 0;
        let pendingContentCount = 0;
        let totalPackagesCount = 0;

        // Xử lý kết quả của API /orders
        if (results[0].status === 'fulfilled') {
          const ordersData = await results[0].value.json();
          pendingOrdersCount = ordersData.orders?.filter(o => o.status === 'pending').length || 0;
        }

        // Xử lý kết quả của API /contents/pending (sẽ thất bại nhưng không làm dừng chương trình)
        if (results[1].status === 'fulfilled') {
          const contentData = await results[1].value.json();
          pendingContentCount = contentData.length || 0;
        }

        // Xử lý kết quả của API /packages
        if (results[2].status === 'fulfilled') {
          const packagesData = await results[2].value.json();
          totalPackagesCount = packagesData.packages?.length || 0;
        }

        setStats({
          pendingOrders: pendingOrdersCount,
          pendingContent: pendingContentCount,
          totalPackages: totalPackagesCount,
        });

      } catch (err) {
        toast.error("Không thể tải dữ liệu cho dashboard.");
        console.error("Failed to fetch manager dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, loading };
};

const ManagerDashboard = () => {
  const { stats, loading } = useManagerDashboardStats();

  const statsCards = [
    {
      icon: <ShoppingCart size={32} className="text-orange-500" />,
      title: 'Đơn hàng chờ duyệt',
      value: loading ? <Loader2 className="animate-spin" /> : stats.pendingOrders,
      link: '/manager/orders',
      linkText: 'Quản lý đơn hàng',
      color: 'border-orange-500',
    },
    {
      icon: <CheckSquare size={32} className="text-purple-500" />,
      title: 'Nội dung chờ duyệt',
      value: loading ? <Loader2 className="animate-spin" /> : stats.pendingContent,
      link: '/manager/content-approval',
      linkText: 'Phê duyệt nội dung',
      color: 'border-purple-500',
    },
    {
      icon: <Package size={32} className="text-teal-500" />,
      title: 'Tổng số gói dịch vụ',
      value: loading ? <Loader2 className="animate-spin" /> : stats.totalPackages,
      link: '/manager/packages',
      linkText: 'Quản lý gói',
      color: 'border-teal-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển - Manager</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;