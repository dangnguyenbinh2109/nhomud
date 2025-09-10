import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckSquare, Check, X, Loader2, BookCopy, HelpCircle, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const RejectModal = ({ onConfirm, onCancel, loading }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối.');
      return;
    }
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Lý do từ chối</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
          className="w-full border-gray-300 rounded-md shadow-sm"
          placeholder="Nội dung chưa rõ ràng, cần chỉnh sửa lại..."
        ></textarea>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Hủy</button>
          <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 flex items-center">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentApproval = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingItem, setRejectingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_URL}/approvals/pending`);
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setContents(result.pending_contents || []);
      } else {
        throw new Error(result.message || 'Không thể tải dữ liệu');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const handleApprove = async (item) => {
    const toastId = toast.loading('Đang duyệt...');
    try {
      const response = await apiFetch(`${API_URL}/approvals/${item.id}/approve`, { method: 'PUT' });
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        toast.success(result.message, { id: toastId });
        setContents(prev => prev.filter(c => c.id !== item.id));
      } else {
        throw new Error(result.message || 'Thao tác thất bại');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`, { id: toastId });
    }
  };

  const handleReject = async (reason) => {
    if (!rejectingItem) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Đang từ chối...');

    try {
      const response = await apiFetch(`${API_URL}/approvals/${rejectingItem.id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        toast.success(result.message, { id: toastId });
        setContents(prev => prev.filter(c => c.id !== rejectingItem.id));
        setRejectingItem(null);
      } else {
        throw new Error(result.message || 'Thao tác thất bại');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lesson_plan': return <BookCopy className="w-5 h-5 text-blue-500" />;
      case 'question': return <HelpCircle className="w-5 h-5 text-green-500" />;
      case 'prompt_template': return <Bot className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/manager/dashboard" className="p-2 rounded-full hover:bg-gray-100" title="Quay lại Dashboard">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <CheckSquare className="mr-3" />
          Phê duyệt Nội dung
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {contents.length > 0 ? contents.map(content => (
            <li key={content.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center min-w-0">
                <div className="mr-4 flex-shrink-0">{getTypeIcon(content.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{content.title}</p>
                  <p className="text-sm text-gray-500">Tạo bởi User ID: {content.created_by} - {new Date(content.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-1 italic max-w-xl truncate" title={content.content}>{content.content}</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <button onClick={() => handleApprove(content)} className="text-green-600 hover:text-green-900 p-1" title="Duyệt"><Check size={20} /></button>
                <button onClick={() => setRejectingItem(content)} className="text-red-600 hover:text-red-900 ml-2 p-1" title="Từ chối"><X size={20} /></button>
              </div>
            </li>
          )) : <p className="text-center text-gray-500 py-10">Không có nội dung nào chờ phê duyệt.</p>}
        </ul>
      )}

      {rejectingItem && (
        <RejectModal onConfirm={handleReject} onCancel={() => setRejectingItem(null)} loading={isSubmitting} />
      )}
    </div>
  );
};

export default ContentApproval;