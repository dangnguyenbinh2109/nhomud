import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  // Data cho biểu đồ tiến độ phát triển (LineChart)
  const progressData = [
    { name: "T2", commits: 12 },
    { name: "T3", commits: 19 },
    { name: "T4", commits: 8 },
    { name: "T5", commits: 15 },
    { name: "T6", commits: 22 },
    { name: "T7", commits: 18 },
    { name: "CN", commits: 14 },
  ];

  // Data cho biểu đồ phân bố Components (PieChart)
  const componentData = [
    { name: "UI Components", value: 25 },
    { name: "Pages", value: 12 },
    { name: "Utilities", value: 8 },
    { name: "Hooks", value: 2 },
  ];
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Tổng Components</p>
              <p className="text-3xl font-bold text-gray-800">47</p>
              <p className="text-green-500 text-sm">+12% so với tháng trước</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🧩</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Bundle Size</p>
              <p className="text-3xl font-bold text-gray-800">2.4MB</p>
              <p className="text-red-500 text-sm">+5% so với tuần trước</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Test Coverage</p>
              <p className="text-3xl font-bold text-gray-800">87%</p>
              <p className="text-green-500 text-sm">+3% so với tuần trước</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Build Time</p>
              <p className="text-3xl font-bold text-gray-800">45s</p>
              <p className="text-green-500 text-sm">-8s so với trước</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tiến độ phát triển</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="commits"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bố Components</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={componentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {componentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Component UserProfile đã được cập nhật</p>
              <p className="text-gray-500 text-sm">2 giờ trước • Nguyễn Văn A</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Build #127 hoàn thành thành công</p>
              <p className="text-gray-500 text-sm">4 giờ trước • CI/CD Pipeline</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Test coverage tăng lên 87%</p>
              <p className="text-gray-500 text-sm">1 ngày trước • Trần Thị B</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
