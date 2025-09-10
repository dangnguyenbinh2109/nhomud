import React, { useState, useEffect } from 'react';
import { Settings, Loader2, Save, Edit, X } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const SystemConfigPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [currentValue, setCurrentValue] = useState('');

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/admin/config`);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.config)) {
        setConfigs(data.config);
      } else {
        throw new Error('Failed to fetch system configurations.');
      }
    } catch (error) {
      toast.error(`Lỗi tải cấu hình: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleEdit = (config) => {
    setEditingKey(config.config_key);
    setCurrentValue(config.config_value);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setCurrentValue('');
  };

  const handleSave = async (key) => {
    const toastId = toast.loading('Đang lưu thay đổi...');
    try {
      const response = await apiFetch(`${API_URL}/admin/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config_key: key, config_value: currentValue }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Cập nhật cấu hình thành công!', { id: toastId });
        setEditingKey(null);
        fetchConfigs(); // Refresh data
      } else {
        throw new Error(result.message || 'Không thể cập nhật cấu hình.');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
        <Settings className="mr-3" />
        Cấu hình hệ thống
      </h1>

      {loading ? (
        <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>
      ) : (
        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.config_id} className="p-4 border rounded-md flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="font-semibold text-gray-800">{config.config_key}</p>
                <p className="text-sm text-gray-500">Cập nhật lần cuối: {new Date(config.updated_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {editingKey === config.config_key ? (
                  <>
                    <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="form-input px-2 py-1 border-gray-300 rounded-md shadow-sm" />
                    <button onClick={() => handleSave(config.config_key)} className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-gray-100" title="Lưu"><Save size={18} /></button>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100" title="Hủy"><X size={18} /></button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-800 font-mono bg-gray-100 px-3 py-1.5 rounded-md">{config.config_value}</span>
                    <button onClick={() => handleEdit(config)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-gray-100" title="Chỉnh sửa"><Edit size={18} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemConfigPage;