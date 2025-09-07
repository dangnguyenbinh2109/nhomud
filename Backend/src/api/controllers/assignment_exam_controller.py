from flask import Blueprint, request, jsonify
from api.schemas.assignment_exam import (
    AssignmentCreateSchema, AssignmentPublicSchema,
    ExamCreateSchema, ExamPublicSchema
)
from infrastructure.databases.mssql import session
from infrastructure.repositories.assignment_repository import AssignmentRepository
from infrastructure.repositories.exam_repository import ExamRepository
from infrastructure.models.lesson_plan_model import LessonPlanModel
from services.assignment_exam_service import AssignmentExamService
from api.middleware import token_required
from sqlalchemy.exc import SQLAlchemyError
from infrastructure.models.question_model import QuestionModel
from infrastructure.models.exam_model import ExamModel
from infrastructure.models.exam_question_model import ExamQuestionModel


assignment_bp = Blueprint('assignments', __name__, url_prefix='/assignments')
exam_bp = Blueprint('exams', __name__, url_prefix='/exams')

assignment_repo = AssignmentRepository(session)
exam_repo = ExamRepository(session)
service = AssignmentExamService(assignment_repo, exam_repo)

assignment_create_schema = AssignmentCreateSchema()
assignment_public_schema = AssignmentPublicSchema(many=True)
exam_create_schema = ExamCreateSchema()
exam_public_schema = ExamPublicSchema(many=True)
single_exam_schema = ExamPublicSchema()

@assignment_bp.route('', methods=['POST'])
@token_required
def create_assignment(user_id):
    data = request.get_json()
    errors = assignment_create_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    title = data.get('title')
    description = data.get('description')
    lesson_id = data.get('lesson_id')

    try:
        # ✅ Kiểm tra lesson_id có tồn tại
        lesson = session.query(LessonPlanModel).filter_by(lesson_id=lesson_id).first()
        if not lesson:
            return jsonify({
                "status": "error",
                "message": f"Lesson with id {lesson_id} does not exist"
            }), 404

        # ✅ Tạo assignment
        new_assignment = service.create_assignment(title, description, lesson_id, user_id)

        # ✅ Flush session để đảm bảo assignment_id được sinh
        session.flush()

        return jsonify({
            "status": "success",
            "message": "Assignment created successfully",
            "data": new_assignment.to_dict()
        }), 201

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({
            "status": "error",
            "message": "Database error occurred",
            "details": str(e)
        }), 500


@assignment_bp.route('', methods=['GET'])
@token_required
def get_assignments(user_id):
    assignments = service.get_all_assignments()
    return jsonify(assignment_public_schema.dump(assignments)), 200

@exam_bp.route('', methods=['POST'])
@token_required
def create_exam(user_id):
    data = request.get_json()
    errors = exam_create_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    title = data.get('title')
    subject = data.get('subject')
    questions = data.get('questions', [])

    try:
        # ✅ Kiểm tra tất cả question ID
        if questions:
            existing_questions = session.query(QuestionModel).filter(
                QuestionModel.question_id.in_(questions)
            ).all()
            existing_ids = {q.question_id for q in existing_questions}
            missing_ids = set(questions) - existing_ids

            if missing_ids:
                return jsonify({
                    "status": "error",
                    "message": f"Some questions do not exist: {list(missing_ids)}"
                }), 400

        # ✅ Tạo exam
        new_exam = ExamModel(
            title=title,
            subject=subject,
            created_by=user_id
        )
        session.add(new_exam)
        session.flush()  # Lấy exam_id ngay

        # ✅ Tạo mapping exam-question
        for qid in questions:
            eq = ExamQuestionModel(
                exam_id=new_exam.exam_id,
                question_id=qid
            )
            session.add(eq)

        session.commit()

        return jsonify({
            "status": "success",
            "message": "Exam created successfully",
            "data": single_exam_schema.dump(new_exam)
        }), 201

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({
            "status": "error",
            "message": "Database error occurred",
            "details": str(e)
        }), 500

@exam_bp.route('', methods=['GET'])
@token_required
def get_exams(user_id):
    try:
        exams = session.query(ExamModel).all()
        exam_schema = ExamPublicSchema(many=True)
        return jsonify(exam_schema.dump(exams)), 200
    except SQLAlchemyError as e:
        return jsonify({
            "status": "error",
            "message": "Database error occurred",
            "details": str(e)
        }), 500

@exam_bp.route('/<int:exam_id>', methods=['PUT'])
@token_required
def update_exam(user_id, exam_id):
    data = request.get_json()
    errors = exam_create_schema.validate(data)  # có thể dùng schema riêng cho update nếu muốn
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    try:
        # Tìm exam
        exam = session.query(ExamModel).filter_by(exam_id=exam_id).first()
        if not exam:
            return jsonify({"status": "error", "message": "Exam not found"}), 404

        # Chỉ cho phép creator sửa
        if exam.created_by != user_id:
            return jsonify({"status": "error", "message": "Permission denied"}), 403

        # Cập nhật thông tin cơ bản
        exam.title = data.get('title', exam.title)
        exam.subject = data.get('subject', exam.subject)

        # Xử lý danh sách câu hỏi mới
        new_questions = data.get('questions', None)
        if new_questions is not None:
            # Xóa tất cả mapping cũ
            session.query(ExamQuestionModel).filter_by(exam_id=exam.exam_id).delete()

            # Kiểm tra tồn tại question_id
            valid_questions = (
                session.query(QuestionModel.question_id)
                .filter(QuestionModel.question_id.in_(new_questions))
                .all()
            )
            valid_ids = [q[0] for q in valid_questions]

            # Nếu thiếu question nào → báo lỗi
            missing_ids = set(new_questions) - set(valid_ids)
            if missing_ids:
                session.rollback()
                return jsonify({
                    "status": "error",
                    "message": f"Some questions do not exist: {list(missing_ids)}"
                }), 400

            # Thêm mapping mới
            for qid in valid_ids:
                session.add(ExamQuestionModel(exam_id=exam.exam_id, question_id=qid))

        session.commit()

        return jsonify({
            "status": "success",
            "message": "Exam updated successfully",
            "data": single_exam_schema.dump(exam)
        }), 200

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({
            "status": "error",
            "message": "Database error occurred",
            "details": str(e)
        }), 500


@exam_bp.route('/<int:exam_id>', methods=['DELETE'])
@token_required
def delete_exam(user_id, exam_id):
    try:
        # Tìm exam
        exam = session.query(ExamModel).filter_by(exam_id=exam_id).first()
        if not exam:
            return jsonify({"status": "error", "message": "Exam not found"}), 404

        # Chỉ cho phép người tạo xóa
        if exam.created_by != user_id:
            return jsonify({"status": "error", "message": "Chỉ cho phép người tạo xóa."}), 403

        # Xóa các bản ghi liên quan trong ExamQuestionModel trước
        session.query(ExamQuestionModel).filter_by(exam_id=exam_id).delete()

        # Xóa các bản ghi ocr_results liên quan (cascade delete)
        from infrastructure.models.ocr_model import OCRResultModel
        session.query(OCRResultModel).filter_by(exam_id=exam_id).delete()

        # Xóa exam
        session.delete(exam)
        session.commit()

        return jsonify({
            "status": "success",
            "message": "Exam deleted successfully"
        }), 200

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"status": "error", "message": "Database error occurred", "details": str(e)}), 500

    
# ✅ Route tạo question để test
@exam_bp.route('/questions', methods=['POST'])
@token_required
def create_question_test(user_id):
    data = request.get_json()
    content = data.get('content')
    subject = data.get('subject')

    if not content or not subject:
        return jsonify({
            "status": "error",
            "message": "Both 'content' and 'subject' are required"
        }), 400

    try:
        # ✅ Kiểm tra user tồn tại trước khi insert
        from infrastructure.models.user_model import UserModel
        user = session.query(UserModel).filter_by(user_id=user_id).first()
        if not user:
            return jsonify({
                "status": "error",
                "message": f"User with id {user_id} does not exist"
            }), 404

        # ✅ Tạo question mới
        new_question = QuestionModel(
            content=content,
            subject=subject,
            created_by=user_id
        )
        session.add(new_question)
        session.commit()

        return jsonify({
            "status": "success",
            "message": "Question created successfully",
            "data": {
                "question_id": new_question.question_id,
                "content": new_question.content,
                "subject": new_question.subject
            }
        }), 201

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({
            "status": "error",
            "message": "Database error occurred",
            "details": str(e)
        }), 500