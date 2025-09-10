import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, PlusCircle, Search, Loader2, Edit, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const PackageModal = ({ packageItem, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: packageItem?.name || '',
    description: packageItem?.description || '',
    price: packageItem?.price || '',
    duration_days: packageItem?.duration_days || '',
  });

  const isEditMode = !!packageItem;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.price || !formData.duration_days) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    onSave(formData, packageItem?.package_id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditMode ? 'Chỉnh sửa Gói' : 'Tạo Gói mới'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên gói</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Thời hạn (ngày)</label>
                <input type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
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

const PackageManager = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/packages`);
      const data = await response.json();
      if (data.status === 'success') {
        setPackages(data.packages);
      } else {
        throw new Error('Failed to fetch packages');
      }
    } catch (error) {
      toast.error(`Lỗi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenModal = (pkg = null) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  const handleSavePackage = async (formData, packageId) => {
    setIsSubmitting(true);
    const isEditMode = !!packageId;
    // Note: API doc says PUT for create, but Postman collection says POST. Using POST as it's more standard.
    const url = isEditMode ? `${API_URL}/packages/${packageId}` : `${API_URL}/packages`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await apiFetch(url, { method, body: JSON.stringify(formData), headers: { 'Content-Type': 'application/json' } });
      const result = await response.json();
      if (result.status === 'success') {
        toast.success(result.message);
        handleCloseModal();
        fetchPackages();
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Bạn có chắc muốn xóa gói này?')) {
      try {
        // Note: API doc says DELETE /packages, but it should be /packages/:id. Assuming the latter.
        const response = await apiFetch(`${API_URL}/packages/${packageId}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status === 'success') {
          toast.success(result.message);
          fetchPackages();
        } else {
          throw new Error(result.message || 'Failed to delete');
        }
      } catch (error) {
        toast.error(`Lỗi: ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link to="/manager/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="mr-3" />
            Quản lý Gói dịch vụ
          </h1>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <PlusCircle className="mr-2 h-5 w-5" />
          Tạo gói mới
        </button>
      </div>

      <div className="overflow-x-auto relative">
        {loading ? (
          <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên gói</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời hạn</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.package_id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                    <div className="text-sm text-gray-500 max-w-sm truncate">{pkg.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration_days} ngày</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(pkg)} className="text-indigo-600 hover:text-indigo-900 p-1"><Edit size={18} /></button>
                    <button onClick={() => handleDeletePackage(pkg.package_id)} className="text-red-600 hover:text-red-900 ml-2 p-1"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && <PackageModal packageItem={editingPackage} onClose={handleCloseModal} onSave={handleSavePackage} loading={isSubmitting} />}
    </div>
  );
};

export default PackageManager;