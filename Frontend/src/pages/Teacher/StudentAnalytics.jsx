import React from 'react';
import { BarChart3 } from 'lucide-react';

const StudentAnalytics = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center"><BarChart3 className="mr-3" />Phân tích Kết quả Học sinh</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">
          Trang này sẽ hiển thị các biểu đồ và số liệu thống kê chi tiết về tiến độ và điểm số
          của học sinh, giúp giáo viên theo dõi và điều chỉnh phương pháp giảng dạy cho phù hợp.
          <br /><strong>Chức năng này đang được phát triển và sẽ sớm được ra mắt.</strong>
        </p>
      </div>
    </div>
  );
};

export default StudentAnalytics;