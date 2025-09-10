import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckSquare, Check, X, Loader2, BookCopy, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Dữ liệu mẫu
const mockContent = [
  { id: 101, type: 'lesson_plan', title: 'Bài giảng về Phản ứng Oxi-hóa khử', author: 'staff1', created_at: '2023-11-10T10:00:00Z' },
  { id: 205, type: 'question', title: 'Câu hỏi về chuỗi phản ứng của Benzen', author: 'staff2', created_at: '2023-11-09T14:30:00Z' },
  { id: 102, type: 'lesson_plan', title: 'Tổng quan về Este - Lipit', author: 'staff1', created_at: '2023-11-09T09:15:00Z' },
];

const ContentApproval = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Thay thế bằng API call đến GET /contents/pending
    setTimeout(() => {
      setContents(mockContent);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAction = (contentId, action) => {
    const actionText = action === 'approve' ? 'phê duyệt' : 'từ chối';
    toast.promise(
      // TODO: Thay thế bằng API call đến PUT /contents/:id/approve hoặc /reject
      new Promise(resolve => setTimeout(resolve, 500)),
      {
        loading: `Đang ${actionText}...`,
        success: () => {
          setContents(prev => prev.filter(c => c.id !== contentId));
          return `Đã ${actionText} nội dung #${contentId}`;
        },
        error: 'Có lỗi xảy ra',
      }
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lesson_plan': return <BookCopy className="w-5 h-5 text-blue-500" />;
      case 'question': return <HelpCircle className="w-5 h-5 text-green-500" />;
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
            <li key={content.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4">{getTypeIcon(content.type)}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{content.title}</p>
                  <p className="text-sm text-gray-500">Tạo bởi: {content.author} - {new Date(content.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <button onClick={() => handleAction(content.id, 'approve')} className="text-green-600 hover:text-green-900 p-1" title="Duyệt"><Check size={20} /></button>
                <button onClick={() => handleAction(content.id, 'reject')} className="text-red-600 hover:text-red-900 ml-2 p-1" title="Từ chối"><X size={20} /></button>
              </div>
            </li>
          )) : <p className="text-center text-gray-500 py-10">Không có nội dung nào chờ phê duyệt.</p>}
        </ul>
      )}
    </div>
  );
};

export default ContentApproval;