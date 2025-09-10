import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, ShoppingCart, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6868';

const statusMapping = {
  paid: { text: 'Thành công', color: 'bg-green-100 text-green-800' },
  pending: { text: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-800' },
  cancelled: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const useRevenueStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    newCustomers: 0,
    orders: [],
    orderCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          apiFetch(`${API_URL}/orders`),
          apiFetch(`${API_URL}/packages`),
          apiFetch(`${API_URL}/users`),
        ]);

        const [ordersResult, packagesResult, usersResult] = results;

        let ordersData = { orders: [] };
        if (ordersResult.status === 'fulfilled' && ordersResult.value.ok) {
            const data = await ordersResult.value.json();
            if (data.status === 'success') ordersData = data;
        }

        let packagesData = { packages: [] };
        if (packagesResult.status === 'fulfilled' && packagesResult.value.ok) {
            const data = await packagesResult.value.json();
            if (data.status === 'success') packagesData = data;
        }

        let usersData = { users: [] };
        if (usersResult.status === 'fulfilled' && usersResult.value.ok) {
            const data = await usersResult.value.json();
            if (data.status === 'success') usersData = data;
        }

        const packagesMap = new Map(packagesData.packages?.map(p => [p.package_id, p.price]) || []);
        const paidOrders = ordersData.orders?.filter(order => order.status === 'paid' && order.paid_at) || [];

        const totalRevenue = paidOrders.reduce((sum, order) => sum + (packagesMap.get(order.package_id) || 0), 0);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyRevenue = paidOrders
          .filter(order => {
            const paidDate = new Date(order.paid_at);
            return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
          })
          .reduce((sum, order) => sum + (packagesMap.get(order.package_id) || 0), 0);

        const newCustomers = usersData.users?.filter(user => {
            const createdDate = new Date(user.created_at);
            return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length || 0;

        setStats({
          totalRevenue,
          monthlyRevenue,
          newCustomers,
          orders: ordersData.orders || [],
          orderCount: ordersData.orders?.length || 0,
        });

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { stats, loading, error };
};

const Revenue = () => {
  const { stats, loading, error } = useRevenueStats();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [displayOrders, setDisplayOrders] = useState([]);

  useEffect(() => {
    // Initialize display orders when stats are loaded
    if (stats.orders) {
      setDisplayOrders(stats.orders);
    }
  }, [stats.orders]);

  const handleFilter = () => {
    let filtered = stats.orders;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Set to start of the day
      filtered = filtered.filter(order => new Date(order.created_at) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of the day
      filtered = filtered.filter(order => new Date(order.created_at) <= end);
    }

    setDisplayOrders(filtered);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setDisplayOrders(stats.orders);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <DollarSign className="mr-3" />
          Báo cáo Doanh thu
        </h1>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm" />
          <span className="text-gray-500">đến</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm" />
          <button 
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Lọc
          </button>
          <button 
            onClick={clearFilter}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
          >
            Xóa lọc
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<DollarSign size={32} className="text-green-500" />} title="Tổng doanh thu" value={loading ? <Loader2 className="animate-spin" /> : `${stats.totalRevenue.toLocaleString('vi-VN')} VNĐ`} color="border-green-500" />
        <StatCard icon={<TrendingUp size={32} className="text-blue-500" />} title="Doanh thu tháng này" value={loading ? <Loader2 className="animate-spin" /> : `${stats.monthlyRevenue.toLocaleString('vi-VN')} VNĐ`} color="border-blue-500" />
        <StatCard icon={<Users size={32} className="text-yellow-500" />} title="Khách hàng mới" value={loading ? <Loader2 className="animate-spin" /> : stats.newCustomers} color="border-yellow-500" />
        <StatCard icon={<ShoppingCart size={32} className="text-purple-500" />} title="Tổng đơn hàng" value={loading ? <Loader2 className="animate-spin" /> : stats.orderCount} color="border-purple-500" />
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Giao dịch gần đây</h2>
        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          )}
          {error && <div className="text-red-500 text-center p-4">Lỗi: {error}</div>}
          {!loading && !error && (
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayOrders.map((order) => {
                  const statusInfo = statusMapping[order.status] || { text: order.status, color: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.order_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.package_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.paid_at ? new Date(order.paid_at).toLocaleDateString('vi-VN') : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenue;