from flask import Blueprint, request, jsonify
from api.services.exam_service import ExamService

exam_bp = Blueprint("exam", __name__)
exam_service = ExamService()

# POST /exams  → Tạo kỳ thi mới
@exam_bp.route("/", methods=["POST"])
def create_exam():
    data = request.get_json()
    exam = exam_service.create_exam(data)
    return jsonify({"message": "Exam created successfully", "exam": exam}), 201

# GET /exams  → Lấy danh sách kỳ thi
@exam_bp.route("/", methods=["GET"])
def get_exams():
    exams = exam_service.get_exams()
    return jsonify(exams), 200

# PUT /exams/<id> → Cập nhật kỳ thi
@exam_bp.route("/<int:exam_id>", methods=["PUT"])
def update_exam(exam_id):
    data = request.get_json()
    updated_exam = exam_service.update_exam(exam_id, data)
    if updated_exam:
        return jsonify({"message": "Exam updated successfully", "exam": updated_exam}), 200
    return jsonify({"message": "Exam not found"}), 404