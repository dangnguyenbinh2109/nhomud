import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, Search, Loader2, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6868';
const ROLES = ['admin', 'manager', 'staff', 'teacher'];

const UserModal = ({ user, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'teacher',
  });

  const isEditMode = !!user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, user?.user_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required disabled={isEditMode} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isEditMode} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" />
            </div>
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vai trò</label>
              <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
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

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/users`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        throw new Error('Invalid data structure from API');
      }
    } catch (e) {
      setError(e.message);
      toast.error(`Lỗi tải dữ liệu: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData, userId) => {
    setIsSubmitting(true);
    const isEditMode = !!userId;
    const url = isEditMode ? `${API_URL}/users/${userId}` : `${API_URL}/users`;
    const method = isEditMode ? 'PUT' : 'POST';

    const payload = isEditMode ? { role: formData.role } : formData;

    try {
      const response = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.status === 'success') {
        toast.success(result.message || `Đã ${isEditMode ? 'cập nhật' : 'tạo'} người dùng thành công!`);
        handleCloseModal();
        fetchUsers(); // Tải lại danh sách
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
    } catch (e) {
      toast.error(`Lỗi: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.username}"?`)) {
      const toastId = toast.loading('Đang xóa người dùng...');
      try {
        const response = await apiFetch(`${API_URL}/users/${user.user_id}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (response.ok && result.status === 'success') {
          toast.success(result.message, { id: toastId });
          setUsers(prevUsers => prevUsers.filter(u => u.user_id !== user.user_id));
        } else {
          throw new Error(result.message || 'Không thể xóa người dùng');
        }
      } catch (e) {
        toast.error(`Lỗi: ${e.message}`, { id: toastId });
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3" />
          Quản lý người dùng
        </h1>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="mr-2 h-5 w-5" />
          Thêm người dùng mới
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            className="pl-10 pr-4 py-2 border rounded-md w-80 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(user)} className="text-indigo-600 hover:text-indigo-900 p-1">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900 ml-2 p-1">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          loading={isSubmitting}
        />
      )}
    </div>
  );
};

export default UserManagementPage;