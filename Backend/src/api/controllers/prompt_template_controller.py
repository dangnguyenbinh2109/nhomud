from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from infrastructure.repositories.prompt_template_repository import PromptTemplateRepository
from infrastructure.repositories.approval_repository import ApprovalRepository
from services.prompt_template_service import PromptTemplateService
from services.approval_service import ApprovalService
from api.schemas.prompt_template import PromptTemplateSchema, PromptTemplateUpdateSchema
from api.middleware import token_required
from sqlalchemy.exc import IntegrityError

prompt_template_bp = Blueprint("prompt_templates", __name__, url_prefix="/prompt-templates")

# Khởi tạo repository và service
prompt_repo = PromptTemplateRepository(session)
approval_repo = ApprovalRepository(session)
approval_service = ApprovalService(approval_repo)
prompt_service = PromptTemplateService(prompt_repo, approval_service)

schema = PromptTemplateSchema()
update_schema = PromptTemplateUpdateSchema()
many_schema = PromptTemplateSchema(many=True)

@prompt_template_bp.route("", methods=["POST"])
@token_required(roles=["staff", "admin"])
def create_prompt_template(user_id):
    data = request.get_json()
    errors = schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    try:
        prompt = prompt_service.create_prompt_template(
            name=data["name"],
            content=data["content"],
            created_by=user_id
        )
        return jsonify({
            "status": "success",
            "message": "Prompt template created successfully. Pending approval.",
            "data": schema.dump(prompt)
        }), 201
    except IntegrityError:
        session.rollback()
        return jsonify({"status": "error", "message": "Database integrity error."}), 500
    except Exception as e:
        session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@prompt_template_bp.route("", methods=["GET"])
@token_required
def get_all_prompt_templates(user_id):
    prompts = prompt_service.get_all_prompt_templates()
    return jsonify({
        "status": "success",
        "data": many_schema.dump(prompts)
    }), 200

@prompt_template_bp.route("/approved", methods=["GET"])
@token_required
def get_approved_prompt_templates(user_id):
    """Lấy danh sách các mẫu prompt đã được phê duyệt."""
    prompts = prompt_service.get_approved_prompt_templates()
    return jsonify({
        "status": "success",
        "data": many_schema.dump(prompts)
    }), 200


@prompt_template_bp.route("/<int:prompt_id>", methods=["GET"])
@token_required(roles=["staff", "admin", "manager"])
def get_prompt_template_by_id(user_id, prompt_id):
    prompt = prompt_service.get_prompt_template_by_id(prompt_id)
    if not prompt:
        return jsonify({"status": "error", "message": "Prompt template not found."}), 404
    return jsonify({
        "status": "success",
        "data": schema.dump(prompt)
    }), 200

@prompt_template_bp.route("/<int:prompt_id>", methods=["PUT"])
@token_required(roles=["staff", "admin"])
def update_prompt_template(user_id, prompt_id):
    data = request.get_json()
    errors = update_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    try:
        updated_prompt = prompt_service.update_prompt_template(
            prompt_id=prompt_id,
            data=data,
            user_id=user_id,
            user_roles=request.current_user_roles
        )
        if not updated_prompt:
            return jsonify({"status": "error", "message": "Prompt template not found."}), 404
        return jsonify({
            "status": "success",
            "message": "Prompt template updated successfully.",
            "data": schema.dump(updated_prompt)
        }), 200
    except IntegrityError:
        session.rollback()
        return jsonify({"status": "error", "message": f"Prompt template name may already exist."}), 409
    except PermissionError as e:
        return jsonify({"status": "error", "message": str(e)}), 403
    except Exception as e:
        session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@prompt_template_bp.route("/<int:prompt_id>", methods=["DELETE"])
@token_required(roles=["staff", "admin"])
def delete_prompt_template(user_id, prompt_id):
    try:
        success = prompt_service.delete_prompt_template(prompt_id, user_id, request.current_user_roles)
        if success:
            return jsonify({"status": "success", "message": "Prompt template deleted successfully."}), 200
        else:
            return jsonify({"status": "error", "message": "Prompt template not found or failed to delete."}), 404
    except PermissionError as e:
        return jsonify({"status": "error", "message": str(e)}), 403
    except Exception as e:
        session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500