from flask import Blueprint, jsonify
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import SQLAlchemyError
from infrastructure.databases.mssql import session
from infrastructure.models.exam_model import ExamModel
from api.schemas.assignment_exam import ExamPublicSchema

public_exam_bp = Blueprint('public_exam_routes', __name__) # Đổi tên để tránh xung đột

# Sử dụng lại schema đã có, nhưng chúng ta sẽ đảm bảo nó không dump đáp án
single_exam_schema = ExamPublicSchema()

@public_exam_bp.route('/exams/<int:exam_id>', methods=['GET'])
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

        # Schema ExamPublicSchema đã được cấu hình để không trả về correct_answer
        exam_data = single_exam_schema.dump(exam)

        return jsonify({
            "status": "success",
            "data": exam_data
        }), 200

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify({"status": "error", "message": "Database error occurred", "details": str(e)}), 500