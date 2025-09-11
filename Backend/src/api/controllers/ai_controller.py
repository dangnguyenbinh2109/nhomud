from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from api.schemas.ai_schema import AIGeneratePromptSchema
from api.middleware import token_required

ai_bp = Blueprint("ai", __name__, url_prefix="/ai")

# Khởi tạo service và schema
ai_service = AIService()
ai_schema = AIGeneratePromptSchema()

@ai_bp.route("/generate-from-prompt", methods=["POST"])
@token_required(roles=["teacher", "admin", "manager"]) # Cho phép teacher và các quyền cao hơn
def generate_from_prompt(user_id):
    """
    Nhận một prompt từ người dùng và trả về kết quả từ Gemini AI.
    """
    data = request.get_json()
    errors = ai_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    try:
        user_prompt = data["prompt"]
        ai_response = ai_service.generate_from_prompt(user_prompt)
        
        return jsonify({
            "status": "success",
            "data": ai_response
        }), 200
    except ValueError as e: # Lỗi cấu hình
        return jsonify({"status": "error", "message": str(e)}), 500
    except Exception as e: # Lỗi từ API của Gemini hoặc lỗi mạng
        return jsonify({"status": "error", "message": f"Lỗi khi gọi AI service: {str(e)}"}), 502