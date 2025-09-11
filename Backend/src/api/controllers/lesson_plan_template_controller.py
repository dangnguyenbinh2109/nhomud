from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from services.lesson_plan_template_service import LessonPlanTemplateService
from infrastructure.repositories.lesson_plan_template_repository import LessonPlanTemplateRepository
from api.schemas.lesson_plan_template import LessonPlanTemplateSchema, LessonPlanTemplateUpdateSchema
from api.middleware import token_required

# Khởi tạo
template_repo = LessonPlanTemplateRepository(session)
template_service = LessonPlanTemplateService(template_repo)

template_bp = Blueprint("lesson_plan_templates", __name__, url_prefix="/lesson-plan-templates")

# Schemas
template_schema = LessonPlanTemplateSchema()
templates_schema = LessonPlanTemplateSchema(many=True)
template_update_schema = LessonPlanTemplateUpdateSchema()

@template_bp.route("", methods=["POST"])
@token_required(roles=["admin"])
def create_template(user_id):
    """Tạo một mẫu kế hoạch bài học mới (chỉ admin)."""
    data = request.get_json()
    errors = template_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    try:
        new_template = template_service.create_template(
            name=data["name"],
            description=data.get("description"),
            structure=data["structure"],
            created_by=user_id
        )
        return jsonify({
            "status": "success",
            "message": "Tạo mẫu kế hoạch bài học thành công.",
            "data": template_schema.dump(new_template)
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@template_bp.route("", methods=["GET"])
@token_required(roles=["admin", "manager", "staff", "teacher"]) # Cho phép các role khác xem
def get_all_templates(user_id):
    """Lấy danh sách tất cả các mẫu kế hoạch bài học."""
    templates = template_service.get_all_templates()
    return jsonify({
        "status": "success",
        "data": templates_schema.dump(templates)
    }), 200

@template_bp.route("/<int:template_id>", methods=["PUT"])
@token_required(roles=["admin"])
def update_template(user_id, template_id):
    """Cập nhật một mẫu kế hoạch bài học (chỉ admin)."""
    data = request.get_json()
    errors = template_update_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    updated_template = template_service.update_template(template_id, data)

    if not updated_template:
        return jsonify({"status": "error", "message": "Không tìm thấy mẫu."}), 404

    return jsonify({
        "status": "success",
        "message": "Cập nhật mẫu thành công.",
        "data": template_schema.dump(updated_template)
    }), 200

@template_bp.route("/<int:template_id>", methods=["DELETE"])
@token_required(roles=["admin"])
def delete_template(user_id, template_id):
    """Xóa một mẫu kế hoạch bài học (chỉ admin)."""
    success = template_service.delete_template(template_id)
    if success:
        return jsonify({
            "status": "success",
            "message": f"Đã xóa thành công mẫu có ID {template_id}."
        }), 200
    else:
        return jsonify({"status": "error", "message": "Không tìm thấy mẫu hoặc xóa thất bại."}), 404