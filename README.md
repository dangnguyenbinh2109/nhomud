# 📁 Sơ đồ Cấu trúc File/Thư mục Project PlanbookAI

```
PlanbookAI/
├── 📋 README.md                      # Hướng dẫn project
├── 📋 .gitignore                     # Git ignore rules
├── 📋 docker-compose.yml             # Docker configuration
├── 📋 LICENSE                        # License file
│
├── 🗃️ backend/                       # Flask API Backend
│   ├── 📋 app.py                     # Entry point Flask app
│   ├── 📋 wsgi.py                    # WSGI production entry
│   ├── 📋 requirements.txt           # Python dependencies
│   ├── 📋 config.py                  # Configuration settings
│   ├── 📋 .env.example              # Environment variables template
│   ├── 📋 .flaskenv                 # Flask environment config
│   │
│   ├── 📁 app/                      # Main application package
│   │   ├── 📋 __init__.py           # Flask app factory
│   │   ├── 📋 extensions.py         # Extensions initialization
│   │   │
│   │   ├── 📁 api/                  # API endpoints
│   │   │   ├── 📋 __init__.py       
│   │   │   ├── 📋 auth.py           # Authentication endpoints
│   │   │   ├── 📋 questions.py      # Question bank CRUD
│   │   │   ├── 📋 students.py       # Student management
│   │   │   ├── 📋 teachers.py       # Teacher management
│   │   │   ├── 📋 analytics.py      # Analytics & reports
│   │   │   └── 📋 subjects.py       # Subject/Topic management
│   │   │
│   │   ├── 📁 models/               # Database models
│   │   │   ├── 📋 __init__.py
│   │   │   ├── 📋 user.py           # User model (Teacher/Student)
│   │   │   ├── 📋 question.py       # Question model
│   │   │   ├── 📋 subject.py        # Subject model
│   │   │   ├── 📋 topic.py          # Topic model
│   │   │   ├── 📋 answer.py         # Student answer model
│   │   │   └── 📋 analytics.py      # Analytics data model
│   │   │
│   │   ├── 📁 services/             # Business logic
│   │   │   ├── 📋 __init__.py
│   │   │   ├── 📋 auth_service.py   # Authentication logic
│   │   │   ├── 📋 question_service.py # Question processing
│   │   │   ├── 📋 analytics_service.py # Data analysis
│   │   │   └── 📋 ai_service.py     # AI processing logic
│   │   │
│   │   ├── 📁 utils/                # Utility functions
│   │   │   ├── 📋 __init__.py
│   │   │   ├── 📋 decorators.py     # Custom decorators
│   │   │   ├── 📋 validators.py     # Input validation
│   │   │   ├── 📋 helpers.py        # Helper functions
│   │   │   └── 📋 constants.py      # App constants
│   │   │
│   │   └── 📁 schemas/              # Data serialization
│   │       ├── 📋 __init__.py
│   │       ├── 📋 user_schema.py    # User serialization
│   │       ├── 📋 question_schema.py # Question serialization
│   │       └── 📋 analytics_schema.py # Analytics serialization
│   │
│   ├── 📁 migrations/               # Database migrations
│   │   └── 📁 versions/             # Migration files
│   │
│   ├── 📁 ai/                       # AI/ML Components
│   │   ├── 📋 __init__.py
│   │   ├── 📁 models/               # ML models
│   │   │   ├── 📋 question_generator.py  # Auto question generation
│   │   │   ├── 📋 performance_analyzer.py # Student performance AI
│   │   │   └── 📋 recommendation_engine.py # Question recommendations
│   │   │
│   │   ├── 📁 data/                 # Training data
│   │   │   ├── 📁 raw/              # Raw training data
│   │   │   ├── 📁 processed/        # Processed data
│   │   │   └── 📁 embeddings/       # Vector embeddings
│   │   │
│   │   └── 📁 notebooks/            # Jupyter notebooks
│   │       ├── 📋 data_exploration.ipynb
│   │       ├── 📋 model_training.ipynb
│   │       └── 📋 performance_analysis.ipynb
│   │
│   ├── 📁 tests/                    # Backend tests
│   │   ├── 📋 __init__.py
│   │   ├── 📋 conftest.py           # Test configuration
│   │   ├── 📁 unit/                 # Unit tests
│   │   │   ├── 📋 test_models.py
│   │   │   ├── 📋 test_services.py
│   │   │   └── 📋 test_utils.py
│   │   │
│   │   ├── 📁 integration/          # Integration tests
│   │   │   ├── 📋 test_api.py
│   │   │   └── 📋 test_database.py
│   │   │
│   │   └── 📁 fixtures/             # Test data
│   │       ├── 📋 sample_questions.json
│   │       └── 📋 sample_users.json
│   │
│   └── 📁 scripts/                  # Utility scripts
│       ├── 📋 init_db.py            # Database initialization
│       ├── 📋 seed_data.py          # Sample data seeding  
│       └── 📋 backup_db.py          # Database backup
│
├── 🌐 frontend/                     # React Frontend
│   ├── 📋 package.json              # Node dependencies
│   ├── 📋 package-lock.json         # Lock file
│   ├── 📋 .env.example             # Environment template
│   ├── 📋 .eslintrc.json           # ESLint configuration
│   ├── 📋 .prettierrc              # Prettier configuration
│   ├── 📋 tailwind.config.js       # Tailwind CSS config
│   ├── 📋 vite.config.js           # Vite configuration
│   │
│   ├── 📁 public/                   # Static assets
│   │   ├── 📋 index.html            # HTML template
│   │   ├── 📋 favicon.ico           # Site icon
│   │   ├── 📁 images/               # Static images
│   │   └── 📁 icons/                # Icon assets
│   │
│   ├── 📁 src/                      # Source code
│   │   ├── 📋 main.jsx              # App entry point
│   │   ├── 📋 App.jsx               # Root component
│   │   ├── 📋 index.css             # Global styles
│   │   │
│   │   ├── 📁 components/           # Reusable components
│   │   │   ├── 📁 ui/               # Basic UI components
│   │   │   │   ├── 📋 Button.jsx
│   │   │   │   ├── 📋 Modal.jsx
│   │   │   │   ├── 📋 Input.jsx
│   │   │   │   ├── 📋 Table.jsx
│   │   │   │   └── 📋 Loading.jsx
│   │   │   │
│   │   │   ├── 📁 layout/           # Layout components
│   │   │   │   ├── 📋 Header.jsx
│   │   │   │   ├── 📋 Sidebar.jsx
│   │   │   │   ├── 📋 Footer.jsx
│   │   │   │   └── 📋 Navigation.jsx
│   │   │   │
│   │   │   └── 📁 common/           # Common components
│   │   │       ├── 📋 ErrorBoundary.jsx
│   │   │       ├── 📋 ProtectedRoute.jsx
│   │   │       └── 📋 NotFound.jsx
│   │   │
│   │   ├── 📁 features/             # Feature-based modules
│   │   │   ├── 📁 auth/             # Authentication
│   │   │   │   ├── 📋 Login.jsx
│   │   │   │   ├── 📋 Register.jsx
│   │   │   │   ├── 📋 ForgotPassword.jsx
│   │   │   │   └── 📋 authSlice.js
│   │   │   │
│   │   │   ├── 📁 dashboard/        # Dashboard
│   │   │   │   ├── 📋 TeacherDashboard.jsx
│   │   │   │   ├── 📋 StudentDashboard.jsx
│   │   │   │   └── 📋 Overview.jsx
│   │   │   │
│   │   │   ├── 📁 questions/        # Question management
│   │   │   │   ├── 📋 QuestionList.jsx
│   │   │   │   ├── 📋 QuestionForm.jsx
│   │   │   │   ├── 📋 QuestionEditor.jsx
│   │   │   │   ├── 📋 QuestionBank.jsx
│   │   │   │   └── 📋 questionsSlice.js
│   │   │   │
│   │   │   ├── 📁 students/         # Student management
│   │   │   │   ├── 📋 StudentList.jsx
│   │   │   │   ├── 📋 StudentProfile.jsx
│   │   │   │   ├── 📋 StudentProgress.jsx
│   │   │   │   └── 📋 studentsSlice.js
│   │   │   │
│   │   │   ├── 📁 analytics/        # Analytics & Reports
│   │   │   │   ├── 📋 PerformanceChart.jsx
│   │   │   │   ├── 📋 AnalyticsDashboard.jsx
│   │   │   │   ├── 📋 ReportsGenerator.jsx
│   │   │   │   └── 📋 analyticsSlice.js
│   │   │   │
│   │   │   └── 📁 subjects/         # Subject/Topic management
│   │   │       ├── 📋 SubjectList.jsx
│   │   │       ├── 📋 TopicManager.jsx
│   │   │       └── 📋 subjectsSlice.js
│   │   │
│   │   ├── 📁 services/             # API services
│   │   │   ├── 📋 api.js            # Axios configuration
│   │   │   ├── 📋 authService.js    # Auth API calls
│   │   │   ├── 📋 questionService.js # Question API calls
│   │   │   ├── 📋 studentService.js  # Student API calls
│   │   │   └── 📋 analyticsService.js # Analytics API calls
│   │   │
│   │   ├── 📁 hooks/                # Custom React hooks
│   │   │   ├── 📋 useAuth.js        # Authentication hook
│   │   │   ├── 📋 useApi.js         # API calling hook
│   │   │   ├── 📋 useDebounce.js    # Debounce hook
│   │   │   └── 📋 useLocalStorage.js # Local storage hook
│   │   │
│   │   ├── 📁 store/                # State management
│   │   │   ├── 📋 index.js          # Redux store
│   │   │   ├── 📋 rootReducer.js    # Root reducer
│   │   │   └── 📁 slices/           # Redux slices
│   │   │
│   │   ├── 📁 utils/                # Utilities
│   │   │   ├── 📋 constants.js      # App constants
│   │   │   ├── 📋 helpers.js        # Helper functions
│   │   │   ├── 📋 validators.js     # Form validation
│   │   │   └── 📋 formatters.js     # Data formatters
│   │   │
│   │   └── 📁 styles/               # Styling
│   │       ├── 📋 globals.css       # Global styles
│   │       ├── 📋 components.css    # Component styles
│   │       └── 📋 utilities.css     # Utility classes
│   │
│   └── 📁 tests/                    # Frontend tests
│       ├── 📋 setup.js              # Test setup
│       ├── 📁 __mocks__/            # Test mocks
│       ├── 📁 components/           # Component tests
│       └── 📁 integration/          # Integration tests
│
├── 📊 database/                     # Database related
│   ├── 📋 init.sql                  # Database initialization
│   ├── 📁 migrations/               # SQL migrations
│   ├── 📁 seeds/                    # Sample data
│   │   ├── 📋 chemistry_questions.sql
│   │   ├── 📋 sample_users.sql
│   │   └── 📋 subjects_topics.sql
│   │
│   └── 📁 backups/                  # Database backups
│
├── 📄 docs/                         # Documentation
│   ├── 📋 API.md                    # API documentation
│   ├── 📋 INSTALLATION.md           # Setup guide
│   ├── 📋 DEPLOYMENT.md             # Deployment guide
│   ├── 📋 ARCHITECTURE.md           # System architecture
│   ├── 📁 images/                   # Documentation images
│   └── 📁 tutorials/                # User tutorials
│       ├── 📋 teacher-guide.md
│       └── 📋 student-guide.md
│
├── 🔧 deployment/                   # Deployment configs
│   ├── 📋 Dockerfile.backend        # Backend Docker image
│   ├── 📋 Dockerfile.frontend       # Frontend Docker image
│   ├── 📋 nginx.conf                # Nginx configuration
│   ├── 📁 kubernetes/               # K8s manifests
│   └── 📁 scripts/                  # Deployment scripts
│       ├── 📋 deploy.sh
│       └── 📋 backup.sh
│
├── 🧪 tests/                        # E2E & Integration tests
│   ├── 📋 pytest.ini               # Pytest configuration
│   ├── 📁 e2e/                     # End-to-end tests
│   │   ├── 📋 test_user_flow.py
│   │   └── 📋 test_question_management.py
│   │
│   └── 📁 integration/              # Cross-service tests
│       └── 📋 test_api_frontend.py
│
└── 📋 .github/                      # GitHub workflows
    └── 📁 workflows/                # CI/CD pipelines
        ├── 📋 backend-tests.yml
        ├── 📋 frontend-tests.yml
        └── 📋 deploy.yml
```

## 📝 Mô tả các thư mục chính:

### 🗃️ **Backend (Flask API)**
- **app/**: Chứa core application logic
- **api/**: REST API endpoints theo tính năng
- **models/**: Database models với SQLAlchemy
- **services/**: Business logic layer
- **ai/**: AI/ML components riêng biệt
- **tests/**: Comprehensive testing structure

### 🌐 **Frontend (React)**
- **src/features/**: Feature-based organization
- **components/**: Reusable UI components
- **services/**: API integration layer
- **hooks/**: Custom React hooks
- **store/**: Redux state management

### 📊 **Database**
- **migrations/**: Database schema changes
- **seeds/**: Sample data cho development
- **backups/**: Database backup files

### 📄 **Documentation**
- **API.md**: RESTful API documentation
- **ARCHITECTURE.md**: System design overview
- **tutorials/**: User guides cho teachers/students

### 🔧 **Deployment**
- **Docker**: Containerization cho backend/frontend
- **kubernetes/**: K8s deployment manifests
- **nginx.conf**: Reverse proxy configuration

## 🔄 **Luồng phát triển:**
1. **Backend**: Flask API → Models → Services → Tests
2. **Frontend**: Components → Features → API Integration → Testing
3. **AI**: Data Processing → Model Training → Integration
4. **Deployment**: Docker → CI/CD → Production

Cấu trúc này tuân thủ **best practices** cho full-stack development với Flask + React và tối ưu hóa cho dự án AI trong giáo dục.