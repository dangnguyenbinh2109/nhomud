# Dự án WebApp PBA
# Architecture
https://ut-team-hv2kf3on.atlassian.net/wiki/spaces/~7120205b3d05977dd147c1990d2e8685e831d6/pages/688130
```bash
────────────────────────────────────────────────────────────────────────────────
├── .git/ 🚫 (auto-hidden)
├── Backend/
│   ├── docs/
│   │   └── flask-clean-architecture.md
│   ├── src/
│   │   ├── .venv/ 🚫 (auto-hidden)
│   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   ├── api/
│   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   ├── controllers/
│   │   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   │   ├── auth_controller.py
│   │   │   │   ├── course_controller.py
│   │   │   │   └── todo_controller.py
│   │   │   ├── schemas/
│   │   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   │   ├── ...  # Marshmallow schemas
│   │   │   │   ├── todo.py
│   │   │   │   └── user.py
│   │   │   ├── middleware.py
│   │   │   ├── requests.py
│   │   │   ├── responses.py
│   │   │   ├── routes.py
│   │   │   └── swagger.py
│   │   ├── domain/
│   │   │   ├── models/
│   │   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   │   ├── ...  # Business logic models
│   │   │   │   ├── course.py
│   │   │   │   ├── icourse_repository.py
│   │   │   │   ├── itodo_repository.py
│   │   │   │   ├── todo.py
│   │   │   │   └── user.py
│   │   │   ├── constants.py
│   │   │   └── exceptions.py
│   │   ├── infrastructure/
│   │   │   ├── databases/
│   │   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py
│   │   │   │   ├── mssql.py
│   │   │   │   └── mysql.py
│   │   │   ├── models/
│   │   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   │   ├── __init__.py
│   │   │   │   ├── appointment_model.py
│   │   │   │   ├── consultant_model.py
│   │   │   │   ├── course_model.py
│   │   │   │   ├── course_register_model.py
│   │   │   │   ├── feedback_model.py
│   │   │   │   ├── program_model.py
│   │   │   │   ├── survey_model.py
│   │   │   │   ├── todo_model.py
│   │   │   │   └── user_model.py
│   │   │   ├── repositories/
│   │   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   │   ├── course_repository.py
│   │   │   │   ├── todo_repository.py
│   │   │   │   └── user_repository.py
│   │   │   └── services/
│   │   │       └── ...  # Services that use third party libraries or services (e.g. email service)
│   │   ├── scripts/
│   │   │   └── run_postgres.sh
│   │   ├── services/
│   │   │   ├── __pycache__/ 🚫 (auto-hidden)
│   │   │   ├── ...  # Services for interacting with the domain (business logic)
│   │   │   ├── course_service.py
│   │   │   └── todo_service.py
│   │   ├── .env 🚫 (auto-hidden)
│   │   ├── README.md
│   │   ├── app.py
│   │   ├── app_logging.py
│   │   ├── config.py
│   │   ├── cors.py
│   │   ├── create_app.py
│   │   ├── default.db
│   │   ├── dependency_container.py
│   │   ├── error_handler.py
│   │   ├── migrations
│   │   ├── requirements.txt
│   │   └── swagger_config.json
│   ├── .gitignore
│   ├── README.md
│   └── default.db
├── Frontend/
│   ├── node_modules/ 🚫 (auto-hidden)
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── setup.sh

────────────────────────────────────────────────────────────────────────────────
Generated by FileTree Pro Extension
```

## Download source code (CMD)
    git clone https://github.com/dangnguyenbinh2109/nhomud.git
## Run app

 - Bước 1: Setup Project (Chỉ cần setup 1 lần)
     ## SetUp (Git Bash):
     		sh setup.sh
 - Bước 2: Chạy môi trường ảo cho Backend:
     ## Run virtual environment (Git Bash):
    		. Backend/.venv/Scripts/activate
 - Bước 3: Chạy Project:
     ## Run (Git Bash):
    		sh run.sh

     Truy câp http://localhost:6868/docs
     Backend Truy câp http://localhost:6868
     Frontend Truy cập http://localhost:5173/



## Create file .env in folder Backend/.env
    
    # Flask settings
    FLASK_ENV=development
    SECRET_KEY=your_secret_key
    
    # SQL Server settings
    DB_USER=sa
    DB_PASSWORD=Aa@123456
    DB_HOST=127.0.0.1
    DB_PORT=1433
    DB_NAME=FlaskApiDB
    
    
    DATABASE_URI = "mssql+pymssql://sa:Aa%40123456@127.0.0.1:1433/FlaskApiDB"
    GEMINI_URL = "GEMINI_URL"
    GEMINI_KEY = "GEMINI_KEY"
    
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

<details>
<summary>Code PlantUML</summary>

```@startuml
actor Guest
actor User
actor Student
actor Teacher
actor Staff
actor Manager
actor Admin

Guest <|-- User
User <|-- Student
User <|-- Teacher
User <|-- Staff
User <|-- Manager
User <|-- Admin

rectangle "Hệ thống" as System {
}

Guest -- System : access (đăng ký / đăng nhập)
Student -- System : uses (làm bài tập, thi, xem kết quả)
Teacher -- System : uses (quản lý kế hoạch, bài tập, đề thi, chấm điểm OCR)
Staff -- System : uses (quản lý ngân hàng câu hỏi)
Manager -- System : manages (quản lý gói dịch vụ, đơn hàng, duyệt nội dung)
Admin -- System : manages (quản lý người dùng, cấu hình hệ thống)
@enduml
```

</details>

![Biểu đồ tác nhân](docs/diagrams/bieu_do_tac_nhan.png)

# Các tác nhân và chức năng chính trong hệ thống

## 1. Admin
- Quản lý người dùng: Thêm, cập nhật, xóa/khóa tài khoản, gán quyền.
- Cấu hình hệ thống: Thiết lập tham số hệ thống, quản lý phân quyền, sao lưu và phục hồi dữ liệu.
- Quản lý khung chương trình: Thiết kế và quản lý mẫu kế hoạch bài học (mục tiêu, hoạt động, đánh giá).
- Theo dõi doanh thu: Xem báo cáo đăng ký, doanh số và tổng doanh thu.

## 2. Manager
- Quản lý gói dịch vụ: Tạo, cập nhật, xóa/ngừng, xem danh sách gói dịch vụ.
- Quản lý đơn hàng: Xem, duyệt/xác nhận, hủy đơn hàng, xuất báo cáo đơn hàng.
- Phê duyệt nội dung: Xem nội dung chờ duyệt, phê duyệt hoặc từ chối nội dung.

## 3. Staff
- Quản lý ngân hàng câu hỏi: Thêm, sửa, xóa, tìm kiếm, xem danh sách câu hỏi.
- Quản lý kế hoạch bài học: Tạo, sửa, xóa, xem danh sách kế hoạch bài học mẫu.
- Quản lý bài tập: Tạo, sửa, xóa, xem danh sách bài tập.

## 4. Teacher
- Quản lý kế hoạch bài học: Tạo, sửa, xóa, xem danh sách kế hoạch cá nhân.
- Quản lý bài tập: Tạo, sửa, xóa, xem danh sách, giao bài tập cho học sinh.
- Quản lý đề thi: Tạo, sửa, xóa, xem danh sách, xuất/import đề thi.
- Chấm thi tự động bằng OCR: Upload bài làm, nhận dạng OCR, so sánh đáp án, tự động chấm điểm, xuất báo cáo.

### Biểu đồ Use Case

<details>

<summary>Code PlantUML</summary>

```@startuml "Use Case Diagram - Hệ thống PlanbookAI"

actor Guest
actor User
actor Teacher
actor Staff
actor Manager
actor Admin

Guest <|-- User
User <|-- Teacher
User <|-- Staff
User <|-- Manager
User <|-- Admin

rectangle "Hệ thống PlanbookAI" {
  
  package "Chức năng chung" {
    usecase "Đăng ký tài khoản mới" as UC_Register
    usecase "Đăng nhập hệ thống" as UC_Login
  }

  package "Quản lý nội dung" {
    usecase "Duyệt nội dung" as UC_ContentApprove
    usecase "Quản lý ngân hàng câu hỏi" as UC_QuestionBank
    usecase "Quản lý kế hoạch bài học" as UC_LessonPlan
    usecase "Quản lý bài tập" as UC_Assignment
    usecase "Quản lý đề thi" as UC_Exam
  }

  package "Chức năng nâng cao" {
    usecase "Quản lý gói dịch vụ" as UC_ServicePack
    usecase "Chấm điểm tự động bằng OCR" as UC_OCR
    usecase "Quản lý đơn hàng" as UC_Order
  }

  package "Chức năng Admin" {
    usecase "Cấu hình hệ thống" as UC_SystemConfig
    usecase "Quản lý người dùng" as UC_UserManagement
  }
}

' Liên kết Guest
Guest --> UC_Register
Guest --> UC_Login

' Liên kết Student/User chung
User --> UC_Login
User --> UC_Register

' Liên kết Teacher
Teacher --> UC_LessonPlan
Teacher --> UC_Assignment
Teacher --> UC_Exam
Teacher --> UC_OCR
Teacher --> UC_Order

' Liên kết Staff
Staff --> UC_QuestionBank

' Liên kết Manager
Manager --> UC_ContentApprove
Manager --> UC_ServicePack
Manager --> UC_Order

' Liên kết Admin
Admin --> UC_UserManagement
Admin --> UC_SystemConfig

@enduml
```
</details>

![Biểu đồ usecase tổng quát](docs/diagrams/bieu_do_usecase_tong_quat.png)

### Biểu đồ Use Case chi tiết

#### Chức năng Admin

<details>

<summary>Code PlantUML</summary>

```@startuml "Use Case Diagram - Chức năng Admin"

actor Admin

rectangle "Hệ thống PlanbookAI - Chức năng Admin" {
  
  package "Quản lý người dùng" {
    usecase "Thêm người dùng" as UC_AddUser
    usecase "Cập nhật thông tin" as UC_UpdateUser
    usecase "Xóa / Khóa tài khoản" as UC_DeleteUser
    usecase "Gán quyền người dùng" as UC_AssignRole
  }

  package "Cấu hình hệ thống" {
    usecase "Quản lý tham số hệ thống" as UC_SystemParams
    usecase "Quản lý phân quyền" as UC_Permissions
    usecase "Sao lưu & Phục hồi dữ liệu" as UC_BackupRestore
  }
}

' Liên kết các Use Case với Admin
Admin --> UC_AddUser
Admin --> UC_UpdateUser
Admin --> UC_DeleteUser
Admin --> UC_AssignRole

Admin --> UC_SystemParams
Admin --> UC_Permissions
Admin --> UC_BackupRestore

@enduml
```
</details>

![Biểu đồ usecase chức năng admin](docs/diagrams/bieu_do_usecase_admin.png)

### Chức năng Manager

<details>

<summary>Code PlantUML</summary>

```@startuml "Use Case Diagram - Chức năng Manager"

actor Manager

rectangle "Hệ thống PlanbookAI - Chức năng Manager" {
  
  package "Quản lý gói dịch vụ" {
    usecase "Tạo gói dịch vụ" as UC_CreatePackage
    usecase "Cập nhật gói dịch vụ" as UC_UpdatePackage
    usecase "Xóa / Ngừng gói dịch vụ" as UC_DeletePackage
    usecase "Xem danh sách gói dịch vụ" as UC_ViewPackage
  }

  package "Quản lý đơn hàng" {
    usecase "Xem đơn hàng" as UC_ViewOrder
    usecase "Duyệt / Xác nhận đơn hàng" as UC_ApproveOrder
    usecase "Hủy đơn hàng" as UC_CancelOrder
    usecase "Xuất báo cáo đơn hàng" as UC_ReportOrder
  }

  package "Duyệt nội dung" {
    usecase "Xem nội dung chờ duyệt" as UC_ViewContent
    usecase "Phê duyệt nội dung" as UC_ApproveContent
    usecase "Từ chối nội dung" as UC_RejectContent
  }
}

' Liên kết với actor Manager
Manager --> UC_CreatePackage
Manager --> UC_UpdatePackage
Manager --> UC_DeletePackage
Manager --> UC_ViewPackage

Manager --> UC_ViewOrder
Manager --> UC_ApproveOrder
Manager --> UC_CancelOrder
Manager --> UC_ReportOrder

Manager --> UC_ViewContent
Manager --> UC_ApproveContent
Manager --> UC_RejectContent

@enduml
```

</details>

![Biểu đồ usecase chức năng manager](docs/diagrams/bieu_do_usecase_manager.png)


### Chức năng Staff

<details>

<summary>Code PlantUML</summary>

```@startuml "Use Case Diagram - Chức năng Staff"

actor Staff

rectangle "Hệ thống PlanbookAI - Chức năng Staff" {

  package "Quản lý ngân hàng câu hỏi" {
    usecase "Thêm câu hỏi" as UC_AddQuestion
    usecase "Chỉnh sửa câu hỏi" as UC_EditQuestion
    usecase "Xóa câu hỏi" as UC_DeleteQuestion
    usecase "Tìm kiếm/Lọc câu hỏi" as UC_SearchQuestion
    usecase "Xem danh sách câu hỏi" as UC_ViewQuestion
  }

  package "Quản lý kế hoạch bài học" {
    usecase "Tạo kế hoạch bài học" as UC_AddLessonPlan
    usecase "Chỉnh sửa kế hoạch" as UC_EditLessonPlan
    usecase "Xóa kế hoạch" as UC_DeleteLessonPlan
    usecase "Xem danh sách kế hoạch" as UC_ViewLessonPlan
  }

  package "Quản lý bài tập" {
    usecase "Tạo bài tập" as UC_AddExercise
    usecase "Chỉnh sửa bài tập" as UC_EditExercise
    usecase "Xóa bài tập" as UC_DeleteExercise
    usecase "Xem danh sách bài tập" as UC_ViewExercise
  }
}

' Liên kết actor Staff
Staff --> UC_AddQuestion
Staff --> UC_EditQuestion
Staff --> UC_DeleteQuestion
Staff --> UC_SearchQuestion
Staff --> UC_ViewQuestion

Staff --> UC_AddLessonPlan
Staff --> UC_EditLessonPlan
Staff --> UC_DeleteLessonPlan
Staff --> UC_ViewLessonPlan

Staff --> UC_AddExercise
Staff --> UC_EditExercise
Staff --> UC_DeleteExercise
Staff --> UC_ViewExercise

@enduml

```
</details>

![Biểu đồ usecase chức năng staff](docs/diagrams/bieu_do_usecase_staff.png)

### Chức năng Teacher

<details>

<summary>Code PlantUML</summary>

```@startuml "Use Case Diagram - Teacher"

actor Teacher

rectangle "Hệ thống" {

  (Tạo kế hoạch) as UC_AddLessonPlan
  (Chỉnh sửa kế hoạch) as UC_EditLessonPlan
  (Xóa kế hoạch) as UC_DeleteLessonPlan
  (Xem danh sách kế hoạch) as UC_ViewLessonPlan

  (Tạo bài tập) as UC_AddExercise
  (Chỉnh sửa bài tập) as UC_EditExercise
  (Xóa bài tập) as UC_DeleteExercise
  (Xem danh sách bài tập) as UC_ViewExercise
  (Giao bài tập cho học sinh) as UC_AssignExercise

  (Tạo đề thi) as UC_AddExam
  (Chỉnh sửa đề thi) as UC_EditExam
  (Xóa đề thi) as UC_DeleteExam
  (Xem danh sách đề thi) as UC_ViewExam
  (Xuất/Import đề thi) as UC_ExportExam

  (Upload bài làm) as UC_UploadAnswer
  (Nhận dạng OCR) as UC_OCRProcess
  (So sánh đáp án) as UC_CompareAnswer
  (Tính điểm tự động) as UC_AutoGrade
  (Xuất kết quả & báo cáo) as UC_Report
}

Teacher --> UC_AddLessonPlan
Teacher --> UC_EditLessonPlan
Teacher --> UC_DeleteLessonPlan
Teacher --> UC_ViewLessonPlan

Teacher --> UC_AddExercise
Teacher --> UC_EditExercise
Teacher --> UC_DeleteExercise
Teacher --> UC_ViewExercise
Teacher --> UC_AssignExercise

Teacher --> UC_AddExam
Teacher --> UC_EditExam
Teacher --> UC_DeleteExam
Teacher --> UC_ViewExam
Teacher --> UC_ExportExam

Teacher --> UC_UploadAnswer
UC_UploadAnswer --> UC_OCRProcess : <<include>>
UC_OCRProcess --> UC_CompareAnswer : <<include>>
UC_CompareAnswer --> UC_AutoGrade : <<include>>
UC_AutoGrade --> UC_Report : <<include>>

@enduml
```
</details>

![Biểu đồ usecase chức năng teacher](docs/diagrams/bieu_do_usecase_teacher.png)


### Quy trình hoạt động tiêu biểu

#### Quản lý bài tập (Teacher)

<details>
<summary>Code PlantUML</summary>

```@startuml
|Teacher|
start
:Đăng nhập hệ thống;
:Truy cập chức năng Quản lý bài tập;

|Hệ thống|
:Hiển thị menu Quản lý bài tập;

|Teacher|
partition "Lựa chọn hành động" {
  if ("Tạo bài tập mới?") then (yes)
    :Nhập nội dung, câu hỏi, đáp án, deadline;
    |Hệ thống|
    :Lưu bài tập vào DB;
  elseif ("Chỉnh sửa bài tập?") then (yes)
    :Chọn bài tập cần sửa;
    :Chỉnh sửa nội dung/đáp án/deadline;
    |Hệ thống|
    :Cập nhật vào DB;
  elseif ("Xóa bài tập?") then (yes)
    :Chọn bài tập cần xóa;
    :Xác nhận xóa;
    |Hệ thống|
    :Xóa khỏi DB;
  elseif ("Xem danh sách?") then (yes)
    |Hệ thống|
    :Hiển thị danh sách bài tập;
  else ("Giao bài tập")
    :Chọn bài tập và lớp/học sinh;
    |Hệ thống|
    :Gửi thông báo và lưu lịch giao;
  endif
}

stop
@enduml
```
</details>

![Quy trình quản lý bài tập](docs/diagrams/quy_trinh_quan_ly_bai_tap.png)

### Quy trình chấm thi bằng OCR (Teacher)

<details>

<summary>Code PlantUML</summary>

``` @startuml
|Teacher|
start
:Đăng nhập hệ thống;
:Chọn chức năng "Chấm điểm OCR";
:Upload ảnh bài làm;

|Hệ thống|
:Nhận file ảnh;
:Thực hiện OCR -> trích xuất text;
:So khớp nội dung với đáp án trong DB;
:Chấm điểm tự động;
:Hiển thị kết quả chấm cho Teacher;
: Lưu kết quả vào DB;

|Teacher|
: Xem kết quả chấm;
stop
@enduml
```
</details>

![Quy trình chấm thi bằng OCR](docs/diagrams/quy_trinh_cham_diem.png)

### Quy trình phê duyệt nội dung (Manager)

<details>

<summary>Code PlantUML</summary>

``` @startuml
|Manager|
start
:Đăng nhập hệ thống;
:Chọn chức năng "Duyệt nội dung";
:Hiển thị danh sách nội dung chờ duyệt;
:Chọn 1 nội dung để xem chi tiết;

|Manager|
if (Quyết định duyệt?) then (Phê duyệt)
  :Phê duyệt nội dung;
  |Hệ thống|
  :Cập nhật trạng thái = "Đã duyệt";
  :Thông báo cho người tạo;
else (Từ chối)
  :Nhập lý do từ chối;
  |Hệ thống|
  :Cập nhật trạng thái = "Từ chối";
  :Thông báo cho người tạo;
endif

|Manager|
stop
@enduml
```
</details>

![Quy trình phê duyệt nội dung](docs/diagrams/quy_trinh_phe_duyet_noi_dung.png)

### Luồng xử lý
## 1. Luồng Quản lý người dùng (Admin)
<details>

<summary>Code PlantUML</summary>

``` @startuml
actor "Admin" as admin
participant "Giao diện" as ui
participant "Hệ thống" as system
database "CSDL" as db

admin -> ui: 1. Truy cập trang quản lý người dùng
activate ui
ui -> system: 2. Gửi yêu cầu lấy danh sách user

activate system
system -> db: 3. Truy vấn tất cả user
activate db
db --> system: 4. Trả về danh sách user
deactivate db
system --> ui: 5. Trả về dữ liệu user
ui --> admin: 6. Hiển thị danh sách người dùng

alt Admin chọn "Thêm/Sửa" user
    admin -> ui: 7. Nhập thông tin user mới/cập nhật
    ui -> system: 8. Gửi yêu cầu thêm/sửa user
    system -> db: 9. Thực hiện thêm/cập nhật dữ liệu
    db --> system: 10. Xác nhận thành công
    system --> ui: 11a. Trả về kết quả thành công
    ui --> admin: 12a. Hiển thị thông báo thành công
else Admin chọn "Xóa" user
    admin -> ui: 7b. Xác nhận xóa user
    ui -> system: 8b. Gửi yêu cầu xóa user
    system -> db: 9b. Thực hiện xóa dữ liệu user
    db --> system: 10b. Xác nhận thành công
    system --> ui: 11b. Trả về kết quả thành công
    ui --> admin: 12b. Cập nhật danh sách user
end

deactivate system
deactivate ui
@enduml
```
</details>

![Luồng quản lý người dùng](docs/diagrams/luong_quan_ly_nguoi_dung.png)


## 2. Luồng Quản lý ngân hàng câu hỏi (Staff)
<details>

<summary>Code PlantUML</summary>

``` @startuml "Biểu đồ trình tự Quản lý ngân hàng câu hỏi (Staff)"
actor "Nhân viên" as staff
participant "Giao diện" as ui
participant "Hệ thống" as system
database "CSDL" as db

staff -> ui: 1. Truy cập trang ngân hàng câu hỏi
activate ui
ui -> system: 2. Gửi yêu cầu lấy danh sách câu hỏi

activate system
system -> db: 3. Truy vấn danh sách câu hỏi
activate db
db --> system: 4. Trả về dữ liệu câu hỏi
deactivate db
system --> ui: 5. Trả về danh sách câu hỏi
ui --> staff: 6. Hiển thị danh sách câu hỏi

alt Thêm mới câu hỏi
    staff -> ui: 7a. Nhập nội dung + đáp án + mức độ
    ui -> system: 8a. Gửi yêu cầu thêm mới
    system -> db: 9a. Lưu dữ liệu câu hỏi
    db --> system: 10a. Xác nhận lưu thành công
    system --> ui: 11a. Trả về kết quả thành công
    ui --> staff: 12a. Hiển thị thông báo thành công
else Cập nhật câu hỏi
    staff -> ui: 7b. Chỉnh sửa nội dung/đáp án
    ui -> system: 8b. Gửi yêu cầu cập nhật
    system -> db: 9b. Cập nhật dữ liệu câu hỏi
    db --> system: 10b. Xác nhận cập nhật thành công
    system --> ui: 11b. Trả về kết quả thành công
    ui --> staff: 12b. Hiển thị thông báo thành công
else Xóa câu hỏi
    staff -> ui: 7c. Chọn câu hỏi cần xóa
    ui -> system: 8c. Gửi yêu cầu xóa
    system -> db: 9c. Xóa dữ liệu câu hỏi
    db --> system: 10c. Xác nhận xóa thành công
    system --> ui: 11c. Trả về kết quả thành công
    ui --> staff: 12c. Cập nhật danh sách câu hỏi
end

deactivate system
deactivate ui
@enduml
```
</details>

![Luồng quản lý ngân hàng câu hỏi](docs/diagrams/luong_ngan_hang_cau_hoi.png)


## 3. Luồng xử lý Chấm thi bằng OCR (Teacher)
<details>

<summary>Code PlantUML</summary>

``` @startuml "Biểu đồ trình tự Chấm điểm tự động bằng OCR (Teacher)"
actor "Giáo viên" as teacher
participant "Giao diện" as ui
participant "Hệ thống" as system
participant "Dịch vụ OCR" as ocr
database "CSDL" as db

teacher -> ui: 1. Truy cập chức năng chấm điểm tự động
ui -> teacher: 2. Hiển thị form upload bài làm

teacher -> ui: 3. Upload ảnh/scan bài làm
ui -> system: 4. Gửi file bài làm

activate system
system -> ocr: 5. Gọi dịch vụ OCR để nhận diện văn bản
activate ocr
ocr --> system: 6. Trả về nội dung đã nhận dạng
deactivate ocr

system -> db: 7. Lấy đáp án chuẩn từ ngân hàng câu hỏi
activate db
db --> system: 8. Trả về dữ liệu đáp án
deactivate db

system -> system: 9. So sánh bài làm với đáp án\nTính điểm tự động
system -> db: 10. Lưu kết quả chấm điểm
db --> system: 11. Xác nhận lưu thành công

system --> ui: 12. Trả về kết quả chấm điểm
ui --> teacher: 13. Hiển thị điểm + chi tiết bài làm

deactivate system
@enduml
```
</details>

![Luồng chấm điểm bằng OCR](docs/diagrams/luong_cham_diem_ocr.png)

## III. Yêu cầu phi chức năng

### 1. Hiệu suất
* Thời gian tải trang không quá 3 giây. 
* Thời gian phản hồi API không quá 1 giây.  
* Hỗ trợ đồng thời ít nhất 30 người dùng.  
* Hệ thống phản hồi nhanh và có khả năng mở rộng linh hoạt.  

### 2. Bảo mật
* Sử dụng JWT (JSON Web Token) cho xác thực và phân quyền.  
* Mã hóa dữ liệu nhạy cảm trong cơ sở dữ liệu.  
* Bảo vệ chống tấn công SQL Injection, XSS, CSRF.  
* Logging đầy đủ các hoạt động quan trọng.  
* Backup dữ liệu định kỳ.  

### 3. Khả năng mở rộng
* Kiến trúc module hóa, dễ thêm tính năng mới.  
* Khả năng tích hợp với hệ thống bên thứ ba (Supabase, Gemini AI, …).  
* Dễ dàng nâng cấp phiên bản và triển khai bằng Docker, AWS.  
* Documentation đầy đủ cho developers.  

### 4. Giao diện người dùng
* Thiết kế responsive cho mọi kích thước màn hình (desktop, tablet, mobile).  
* Thời gian làm quen sử dụng hệ thống không quá 30 phút.  
* Giao diện trực quan, nhất quán trên toàn bộ hệ thống.  
* Hỗ trợ tiếng Việt (có thể mở rộng đa ngôn ngữ).  

### 5. Tương thích
* Hoạt động trên các trình duyệt phổ biến (Chrome, Firefox, Safari, Edge).  
* Tương thích với thiết bị di động iOS và Android.  
* Hỗ trợ các phiên bản trình duyệt trong vòng 2 năm trở lại.  
* Tối ưu cho kết nối mạng chậm.  

### 6. Độ tin cậy
* Uptime tối thiểu 99.9%.  
* Thời gian phục hồi sau sự cố < 4 giờ.  
* Backup dữ liệu hàng ngày.  
* Có phương án dự phòng khi hệ thống gặp sự cố.  

### 7. Khả năng bảo trì
* Code được viết theo chuẩn clean code.  
* Có tài liệu kỹ thuật chi tiết.  
* Dễ dàng rollback khi cần thiết.  
* Cấu trúc dự án rõ ràng để thuận tiện bảo trì và mở rộng.  

## IV. Công nghệ

### 1. Backend
* **Spring Boot** – phát triển API RESTful.  
* **PYTHON** – ngôn ngữ lập trình chính cho backend.  
* **JWT (JSON Web Token)** – xác thực và phân quyền.  

### 2. Frontend
* **ReactJS** – xây dựng giao diện người dùng.  
* **TailwindCSS / ShadCN UI** – thiết kế giao diện trực quan, responsive.  

### 3. Cơ sở dữ liệu
* **MySQL** – lưu trữ dữ liệu quan hệ (ngân hàng câu hỏi, kế hoạch bài học, người dùng…).  

### 4. Tích hợp dịch vụ bên thứ ba
* **Supabase** – quản lý xác thực, lưu trữ file, backend-as-a-service.  
* **Gemini AI** – hỗ trợ sinh nội dung AI (bài tập, đề thi, kế hoạch giảng dạy).  

### 5. Triển khai & hạ tầng
* **Docker** – container hóa ứng dụng.  
* **AWS** – triển khai trên môi trường cloud, đảm bảo khả năng mở rộng.  
* **N-Tier Architecture** – tách biệt các tầng (Controller – Service – Repository – Database).  

### 6. Công cụ phát triển
* **GitHub** – quản lý mã nguồn, version control.  
* **PlantUML** – vẽ sơ đồ Use Case, Activity, Sequence.  
* **Postman** – kiểm thử API.  
## V. Yêu cầu thiết kế
......
