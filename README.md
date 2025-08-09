# Dự án Website Đặt lịch hẹn Tiệm Làm Tóc

**Code name:** `virgo-14`

## I. Tổng quan dự án

### Mục tiêu

Mục tiêu của dự án là xây dựng PlanbookAI – cổng công cụ AI hỗ trợ giáo viên trung học phổ thông trong việc lập kế hoạch bài giảng, tạo và chấm bài thi, quản lý tài nguyên giảng dạy, từ đó giảm tải công việc thủ công, nâng cao hiệu quả và chất lượng giảng dạy.

### Phạm vi

Phát triển PlanbookAI tập trung hỗ trợ giáo viên Hóa học trung học phổ thông với các chức năng chính gồm: quản lý ngân hàng câu hỏi, tạo bài tập và đề thi trắc nghiệm, chấm điểm tự động bằng OCR, lưu trữ và tổ chức tài nguyên giảng dạy, đồng thời cung cấp phân tích kết quả học tập của học sinh.

### Giả định và ràng buộc

- Giáo viên và người dùng mục tiêu có kỹ năng cơ bản về máy tính và Internet.
- Hạ tầng mạng và thiết bị (máy tính, máy quét, camera) đáp ứng yêu cầu vận hành hệ thống.
- Dữ liệu câu hỏi, tài liệu giảng dạy được cung cấp đầy đủ và hợp lệ từ phía người dùng.
- Thời gian phát triển giới hạn, nên giai đoạn đầu chỉ áp dụng cho môn Hóa học THPT.
- Hệ thống phải tuân thủ kiến trúc và công nghệ đã chọn (Spring Boot, ReactJS, MySQL, RESTful API).
- Chức năng OCR ban đầu chỉ hỗ trợ định dạng đề thi trắc nghiệm.
- Tài nguyên và dữ liệu được lưu trữ phải đảm bảo tính bảo mật và quyền riêng tư.
## II. Yêu cầu chức năng
### Các tác nhân
- Gồm 4 tác nhân chính: Admin, Manager, Staff, Teacher.
