import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/orders`);
      const data = await response.json();
      if (data.status === 'success') {
        setOrders(data.orders);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error(`Lỗi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, action) => {
    const toastId = toast.loading(`Đang ${action === 'approve' ? 'duyệt' : 'hủy'} đơn hàng...`);
    try {
      const response = await apiFetch(`${API_URL}/orders/${orderId}/${action}`, { method: 'PUT' });
      const result = await response.json();
      if (result.status === 'success') {
        toast.success(result.message, { id: toastId });
        fetchOrders(); // Refresh the list
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`, { id: toastId });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đã thanh toán</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Chờ duyệt</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Đã hủy</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/manager/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingCart className="mr-3" />
          Quản lý Đơn hàng
        </h1>
      </div>

      <div className="overflow-x-auto relative">
        {loading ? (
          <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.order_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {order.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(order.order_id, 'approve')} className="text-green-600 hover:text-green-900 p-1" title="Duyệt"><Check size={18} /></button>
                        <button onClick={() => handleUpdateStatus(order.order_id, 'cancel')} className="text-red-600 hover:text-red-900 ml-2 p-1" title="Hủy"><X size={18} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;