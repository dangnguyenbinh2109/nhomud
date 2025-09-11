from flask import Blueprint, jsonify
from services.question_service import QuestionService
from infrastructure.repositories.question_repository import QuestionRepository
from services.approval_service import ApprovalService
from infrastructure.repositories.approval_repository import ApprovalRepository
from infrastructure.databases.mssql import session
from api.schemas.question import QuestionPublicSchema
from api.schemas.assignment_exam import PublicExamWithIDsSchema
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import SQLAlchemyError
from infrastructure.models.exam_model import ExamModel

public_question_bp = Blueprint('public_questions', __name__)

# Khởi tạo service cần thiết
approval_repo = ApprovalRepository(session)
approval_service = ApprovalService(approval_repo)
question_repo = QuestionRepository(session)
question_service = QuestionService(question_repo, approval_service)

# Khởi tạo schema
public_questions_schema = QuestionPublicSchema(many=True)
single_exam_with_ids_schema = PublicExamWithIDsSchema()

@public_question_bp.route('/questions', methods=['GET'])
def get_public_questions():
    """
    Endpoint công khai để lấy danh sách câu hỏi đã được duyệt.
    Quan trọng: Service sẽ đảm bảo không trả về đáp án đúng.
    """
    try:
        questions = question_service.get_all_public_questions()
        # Sử dụng schema để serialize dữ liệu
        return jsonify({
            "status": "success",
            "questions": public_questions_schema.dump(questions)
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@public_question_bp.route('/exams/<int:exam_id>', methods=['GET'])
def get_public_exam(exam_id):
    """
    Endpoint công khai để bất kỳ ai cũng có thể xem chi tiết đề thi.
    Schema sẽ đảm bảo không lộ đáp án.
    """
    try:
        exam = (
            session.query(ExamModel)
            .options(joinedload(ExamModel.questions)) # Tải sẵn các câu hỏi liên quan
            .filter(ExamModel.exam_id == exam_id)
            .first()
        )

        if not exam:
            return jsonify({"status": "error", "message": "Exam not found"}), 404

        exam_data = single_exam_with_ids_schema.dump(exam)

        return jsonify({
            "status": "success",
            "data": exam_data
        }), 200

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"status": "error", "message": "Database error occurred", "details": str(e)}), 500
