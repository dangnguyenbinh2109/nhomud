# PlanbookAI - Cổng Công Cụ AI Dành Cho Giáo Viên THPT

**PlanbookAI** là một ứng dụng fullstack được thiết kế để hỗ trợ giáo viên trung học phổ thông trong việc quản lý công việc giảng dạy và hành chính thông qua các công cụ AI thông minh.

## 📋 Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Cài Đặt và Chạy](#cài-đặt-và-chạy)
- [API Documentation](#api-documentation)
- [Tính Năng Chính](#tính-năng-chính)
- [Quy Trình Phát Triển](#quy-trình-phát-triển)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Giới Thiệu

PlanbookAI giải quyết các vấn đề chính mà giáo viên THPT đang gặp phải:

- **Thiếu tự động hóa**: Hệ thống hiện tại không có tự động hóa thông minh, giáo viên phải thực hiện nhiều công việc bằng tay
- **Khó truy cập tài nguyên**: Khó khăn trong việc tìm kiếm và sử dụng các mẫu, tài liệu giảng dạy phù hợp
- **Quản lý thời gian**: Cần cân bằng giữa trách nhiệm giảng dạy và công việc hành chính

### Tính Năng Chính

- ✅ **Lập kế hoạch bài học** với hỗ trợ AI
- ✅ **Chấm điểm tự động** và quản lý kết quả học tập
- ✅ **Theo dõi điểm danh** thông minh
- ✅ **Tạo báo cáo** tự động
- ✅ **Quản lý người dùng** với phân quyền vai trò
- ✅ **Tích hợp công cụ AI** để nâng cao hiệu quả làm việc

## 🛠 Công Nghệ Sử Dụng

### Backend
- **Flask** - Python web framework
- **Flask-RESTful** - REST API development
- **SQLAlchemy** - ORM cho database
- **PostgreSQL/MySQL** - Cơ sở dữ liệu
- **JWT** - Authentication
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API/Redux** - State management
- **Material-UI/Tailwind CSS** - UI components

### DevOps & Tools
- **Docker** - Containerization
- **Git** - Version control
- **GitHub Actions** - CI/CD
- **Swagger/OpenAPI** - API documentation

## 📁 Cấu Trúc Dự Án

```
planbook-ai/
├── .gitignore
├── README.md
├ requirements.txt
├── docker-compose.yml
├── Tao_project_tren_GitHub.txt
├── TCP_client.py
├── TCP_server.py
├── UDP_client.py
├── UDP_server.py
│
├── docs/                          # Tài liệu dự án
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── SETUP.md
│
├── backend/                       # Flask API Server
│   ├── .env.example               # Mẫu biến môi trường
│   ├── requirements.txt           # Thư viện Python
│   ├── run.py                     # Điểm khởi chạy ứng dụng
│   ├── migrations/                # (sẽ do Alembic sinh ra)
│   ├── tests/                     # Unit & integration tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_grades.py
│   │   └── test_lessons.py
│   │
│   └── app/                       # Mã nguồn chính
│       ├── __init__.py            # Flask app factory
│       ├── config.py              # Thiết lập cấu hình
│       │
│       ├── models/                # Database models
│       │   ├── __init__.py
│       │   ├── attendance.py
│       │   ├── grade.py
│       │   ├── lesson.py
│       │   └── user.py
│       │
│       ├── routes/                # REST endpoints
│       │   ├── __init__.py
│       │   ├── auth.py
│       │   ├── grades.py
│       │   ├── lessons.py
│       │   ├── reports.py
│       │   └── users.py
│       │
│       ├── services/              # Business logic
│       │   ├── __init__.py
│       │   ├── ai_service.py
│       │   ├── auth_service.py
│       │   ├── lesson_service.py
│       │   └── report_service.py
│       │
│       └── utils/                 # Hàm tiện ích & middleware
│           ├── __init__.py
│           ├── decorators.py
│           ├── helpers.py
│           └── validators.py
│
├── frontend/                      # Ứng dụng React 18+
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── public/                    # Tài nguyên tĩnh
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       ├── setupTests.js
│       │
│       ├── contexts/              # React Context API
│       │   ├── AppContext.js
│       │   └── AuthContext.js
│       │
│       ├── hooks/                 # Custom hooks
│       │   ├── useApi.js
│       │   ├── useAuth.js
│       │   └── useLocalStorage.js
│       │
│       ├── services/              # Gọi API
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── gradeService.js
│       │   └── lessonService.js
│       │
│       └── utils/                 # Hàm tiện ích
│           ├── constants.js
│           ├── helpers.js
│           └── validation.js
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Python 3.8+
- Node.js 16+
- PostgreSQL/MySQL
- Git

### 1. Clone Repository
```bash
git clone https://github.com/dangnguyenbinh2109/nhomud.git
cd planbook-ai
```

### 2. Cài Đặt Backend (Flask)

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Trên Windows
venv\Scripts\activate
# Trên macOS/Linux  
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình environment variables
cp .env.example .env
# Chỉnh sửa file .env với thông tin database và cấu hình

# Chạy database migrations
flask db upgrade

# Khởi động server
python run.py
```

Backend sẽ chạy tại: `http://localhost:5000`

### 3. Cài Đặt Frontend (React)

```bash
# Mở terminal mới và di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Cấu hình environment variables
cp .env.example .env
# Chỉnh sửa file .env với API endpoint

# Khởi động development server
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 4. Chạy với Docker (Tùy chọn)

```bash
# Khởi động toàn bộ ứng dụng với Docker Compose
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng ứng dụng
docker-compose down
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/login     # Đăng nhập
POST /api/auth/register  # Đăng ký
POST /api/auth/logout    # Đăng xuất
GET  /api/auth/me        # Thông tin user hiện tại
```

### User Management
```
GET    /api/users        # Danh sách users
POST   /api/users        # Tạo user mới
GET    /api/users/:id    # Chi tiết user
PUT    /api/users/:id    # Cập nhật user
DELETE /api/users/:id    # Xóa user
```

### Lesson Planning
```
GET    /api/lessons      # Danh sách kế hoạch bài học
POST   /api/lessons      # Tạo kế hoạch mới
GET    /api/lessons/:id  # Chi tiết kế hoạch
PUT    /api/lessons/:id  # Cập nhật kế hoạch
DELETE /api/lessons/:id  # Xóa kế hoạch
```

### Grade Management
```
GET    /api/grades       # Danh sách điểm
POST   /api/grades       # Thêm điểm mới
PUT    /api/grades/:id   # Cập nhật điểm
DELETE /api/grades/:id   # Xóa điểm
```

### Attendance
```
GET    /api/attendance         # Danh sách điểm danh
POST   /api/attendance         # Tạo điểm danh
PUT    /api/attendance/:id     # Cập nhật điểm danh
```

### Reports
```
GET    /api/reports/academic   # Báo cáo học tập
GET    /api/reports/attendance # Báo cáo điểm danh
GET    /api/reports/summary    # Báo cáo tổng hợp
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

## 🔄 Quy Trình Phát Triển

### 1. Workflow Git
```bash
# Tạo branch mới cho feature
git checkout -b feature/ten-tinh-nang

# Commit changes
git add .
git commit -m "feat: thêm tính năng XYZ"

# Push và tạo Pull Request
git push origin feature/ten-tinh-nang
```

### 2. Coding Standards

#### Backend (Python)
- Sử dụng **PEP 8** style guide
- Sử dụng **Black** formatter
- Sử dụng **Flake8** linter
- Viết docstring cho functions/classes
- Coverage test tối thiểu 80%

#### Frontend (React)
- Sử dụng **ESLint** và **Prettier**
- Sử dụng **TypeScript** cho type safety
- Sử dụng functional components với hooks
- Tên component viết PascalCase
- Tên file kebab-case

### 3. Testing

#### Backend Testing
```bash
# Chạy unit tests
python -m pytest tests/

# Chạy với coverage
python -m pytest --cov=app tests/

# Chạy integration tests
python -m pytest tests/integration/
```

#### Frontend Testing
```bash
# Chạy unit tests
npm test

# Chạy e2e tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### 4. Database Migrations

```bash
# Tạo migration mới
flask db migrate -m "Mô tả thay đổi"

# Áp dụng migration
flask db upgrade

# Rollback migration
flask db downgrade
```

## 🚀 Deployment

### 1. Production Environment

```bash
# Build frontend cho production
cd frontend
npm run build

# Setup production backend
cd backend
pip install -r requirements.txt
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### 2. Environment Variables

#### Backend (.env)
```
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost/planbook_ai
JWT_SECRET_KEY=your-jwt-secret
AI_API_KEY=your-ai-api-key
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=production
```

## 🤝 Contributing

### Cách Đóng Góp

1. **Fork** repository
2. **Tạo branch** cho feature (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Tạo Pull Request**

### Code Review Process

- Mọi Pull Request cần ít nhất 1 approval
- Code phải pass tất cả tests
- Code phải tuân thủ coding standards
- Documentation phải được cập nhật nếu cần

### Bug Reports

Khi báo lỗi, vui lòng bao gồm:
- Mô tả chi tiết lỗi
- Steps to reproduce
- Expected behavior
- Screenshots (nếu có)
- Environment details

## 📖 Documentation

- [API Documentation](docs/API.md) - Chi tiết về REST API
- [Setup Guide](docs/SETUP.md) - Hướng dẫn cài đặt chi tiết
- [Contributing Guide](docs/CONTRIBUTING.md) - Hướng dẫn đóng góp
- [Architecture](docs/ARCHITECTURE.md) - Kiến trúc hệ thống

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: support@planbook-ai.com
- **Website**: https://planbook-ai.com
- **Issues**: [GitHub Issues](https://github.com/dangnguyenbinh2109/nhomud/issues)

## 🎯 Roadmap

### Phiên bản 1.0 (Q1 2025)
- ✅ Quản lý người dùng cơ bản
- ✅ Lập kế hoạch bài học
- ✅ Quản lý điểm số
- ✅ Điểm danh học sinh

### Phiên bản 2.0 (Q2 2025)
- 🔄 Tích hợp AI ChatBot
- 🔄 Tạo đề thi tự động
- 🔄 Phân tích học tập thông minh
- 🔄 Mobile responsive

### Phiên bản 3.0 (Q3 2025)
- 📋 Tích hợp với hệ thống trường học
- 📋 Báo cáo analytics nâng cao
- 📋 Multi-language support
- 📋 Offline capability

---

**Made with ❤️ by PlanbookAI Team**