import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6868';

// Custom hook to fetch and aggregate user report data
const useUserReports = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all necessary data in parallel
                const results = await Promise.allSettled([
                    apiFetch(`${API_URL}/users`),
                    apiFetch(`${API_URL}/lesson-plans`),
                    apiFetch(`${API_URL}/exams`),
                    apiFetch(`${API_URL}/assignments`),
                ]);

                const [usersRes, lessonsRes, examsRes, assignmentsRes] = results;

                const usersData = usersRes.status === 'fulfilled' && usersRes.value.ok ? await usersRes.value.json() : { status: 'error' };
                const lessonsData = lessonsRes.status === 'fulfilled' && lessonsRes.value.ok ? await lessonsRes.value.json() : { lesson_plans: [] };
                const examsData = examsRes.status === 'fulfilled' && examsRes.value.ok ? await examsRes.value.json() : [];
                const assignmentsData = assignmentsRes.status === 'fulfilled' && assignmentsRes.value.ok ? await assignmentsRes.value.json() : [];

                if (usersData.status !== 'success') throw new Error('Failed to fetch users');

                // Aggregate data
                const createCounter = (items) => (items || []).reduce((acc, item) => {
                    acc[item.created_by] = (acc[item.created_by] || 0) + 1;
                    return acc;
                }, {});

                const lessonsCount = createCounter(lessonsData.lesson_plans);
                const examsCount = createCounter(examsData);
                const assignmentsCount = createCounter(assignmentsData);

                // Combine into a single report
                const combinedReport = usersData.users.map(user => ({
                    ...user,
                    lessonCount: lessonsCount[user.user_id] || 0,
                    examCount: examsCount[user.user_id] || 0,
                    assignmentCount: assignmentsCount[user.user_id] || 0,
                }));

                setReportData(combinedReport);

            } catch (e) {
                setError(e.message);
                toast.error(`Lỗi tải báo cáo: ${e.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { reportData, loading, error };
};

const UserReportsPage = () => {
    const { reportData, loading, error } = useUserReports();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                <BarChart3 className="mr-3" />
                Báo cáo hoạt động người dùng
            </h1>

            <div className="overflow-x-auto relative">
                {loading && <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>}
                {error && <div className="text-red-500 text-center p-4">Lỗi: {error}</div>}
                {!loading && !error && (
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kế hoạch bài giảng</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Đề thi đã tạo</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bài tập đã tạo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reportData.map((user) => (
                                <tr key={user.user_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{user.lessonCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{user.examCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{user.assignmentCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserReportsPage;