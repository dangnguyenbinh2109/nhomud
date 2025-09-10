export default function Footer() {
    return (
        <footer className="bg-[#1b588f] text-gray-300 py-10 px-6 mt-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                
                {/* Logo + giới thiệu */}
                <div>
                    <h2 className="text-2xl font-bold text-white">PlanbookAI</h2>
                    <p className="mt-4 text-sm leading-6 text-justify">
                        PlanbookAI là cổng công cụ AI hỗ trợ giáo viên trung học phổ thông 
                        trong việc lập kế hoạch giảng dạy, tạo và chấm bài thi, quản lý tài nguyên. 
                        Giúp giảm tải công việc thủ công, nâng cao hiệu quả và chất lượng dạy học.
                    </p>    
                </div>

                {/* Liên kết nhanh */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Liên kết nhanh</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white">Trang chủ</a></li>
                        <li><a href="#" className="hover:text-white">Tính năng</a></li>
                        <li><a href="#" className="hover:text-white">Tài nguyên</a></li>
                        <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Thông tin liên hệ */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
                    <p className="text-sm">Email: <a href="mailto:support@planbookai.com" className="hover:text-white">support@planbookai.com</a></p>
                    <p className="text-sm">Hotline: 0123 456 789</p>
                </div>
            </div>

            {/* Bản quyền */}
            <div className="border-t border-b-blue-950 mt-10 pt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} PlanbookAI. All rights reserved.
            </div>
        </footer>
    );
}