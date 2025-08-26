from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from services.system_config_service import SystemConfigService
from infrastructure.repositories.system_config_repository import SystemConfigRepository
from api.schemas.system_config import SystemConfigSchema
from api.middleware import token_required

repo = SystemConfigRepository(session)
service = SystemConfigService(repo)
schema = SystemConfigSchema()

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/config', methods=['GET'])
@token_required(roles=["admin"])
def get_configs(user_id):
    # TODO: chỉ cho admin
    try:
        configs = service.get_all_configs()
        return jsonify({
            "status": "success",
            "config": schema.dump(configs, many=True)
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/config', methods=['PUT'])
@token_required(roles=["admin"])
def update_config(user_id):
    # TODO: chỉ cho admin
    data = request.get_json()
    errors = schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400
    key = data.get("config_key")
    value = data.get("config_value")
    try:
        updated = service.update_config(key, value)
        return jsonify({
            "status": "success",
            "config": schema.dump(updated)
        }), 200
    except ValueError as ve:
        return jsonify({"status": "error", "message": str(ve)}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
