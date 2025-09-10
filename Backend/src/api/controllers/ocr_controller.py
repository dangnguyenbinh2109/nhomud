# api/ocr_controller.py
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from src.infrastructure.repositories.ocr_repository import OCRRepository
from src.infrastructure.databases.mssql import session
from src.services.ocr_service import OCRService
from src.api.middleware import token_required

ocr_bp = Blueprint("ocr", __name__, url_prefix="/ocr")

@ocr_bp.route("/upload", methods=["POST"])
@token_required
def upload_exam_sheet(user_id):
    data = request.get_json()
    exam_id = data.get("exam_id")  # có thể None
    student_name = data.get("student_name")
    image_base64 = data.get("image_base64")

    if not image_base64:
        return jsonify({"status": "error", "message": "Thiếu image_base64"}), 400

    try:
        ocr_service = OCRService(OCRRepository(session), session)
        
        if exam_id:
            try:
                result = ocr_service.grade_exam_from_image(exam_id, student_name, image_base64)
                return jsonify({
                    "status": "success",
                    "message": "OCR processed successfully",
                    "data": result.to_dict()
                }), 200
            except IntegrityError as e:
                # Bắt lỗi FK, exam_id không tồn tại
                session.rollback()  # rollback transaction
                return jsonify({
                    "status": "error",
                    "message": f"Bài thi không tồn tại trong hệ thống."
                }), 400
        else:
            # Nếu không có exam_id, chỉ đọc nội dung từ ảnh
            text_only = ocr_service.read_text_from_image(image_base64)
            return jsonify({
                "status": "success",
                "message": "OCR read image content successfully",
                "data": {"text": text_only}
            }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Đã có lỗi xảy ra. Vui lòng thử lại. Chi tiết: {str(e)}"
        }), 500
