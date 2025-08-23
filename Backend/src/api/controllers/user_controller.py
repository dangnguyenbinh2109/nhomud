from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from services.user_service import UserService
from api.schemas.user import UserCreateSchema, UserPublicSchema, UserUpdateSchema
from infrastructure.repositories.user_repository import UserRepository
from api.middleware import token_required
from infrastructure.models.role_model import Role
from infrastructure.models.user_model import UserModel

user_repository = UserRepository(session)
user_service = UserService(user_repository)

user_bp = Blueprint("users", __name__, url_prefix="/users")

request_create_schema = UserCreateSchema()
request_update_schema = UserUpdateSchema()
response_schema = UserPublicSchema()
response_many_schema = UserPublicSchema(many=True)


@user_bp.route("", methods=["GET"])
@token_required(roles=["admin"])
def get_users(user_id):
    users = user_service.get_all_users()
    return jsonify({
        "status": "success",
        "users": response_many_schema.dump(users)
    }), 200


@user_bp.route("", methods=["POST"])
@token_required(roles=["admin"])
def create_user(user_id):
    data = request.get_json()
    errors = request_create_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    try:
        # Lấy role từ input
        role_name = data.get("role")
        role_id = data.get("role_id")

        role = None
        if role_name:  # Ưu tiên tìm theo tên role
            role = session.query(Role).filter_by(name=role_name.lower()).first()
        if not role and role_id:  # Nếu chưa tìm được thì fallback sang id
            role = session.query(Role).filter_by(role_id=role_id).first()

        if not role:
            session.close()
            return jsonify({
                "status": "error",
                "message": "Role not found"
            }), 400

        # Tạo user
        user = user_service.create_user(
            username=data["username"],
            password=data["password"],
            email=data.get("email"),
            role_id=role.role_id
        )
        session.close()

        return jsonify({
            "status": "success",
            "message": "User created successfully",
            "data": response_schema.dump(user)
        }), 201

    except ValueError as e:
        return jsonify({"status": "error", "message": str(e)}), 409


@user_bp.route("/<int:user_id>", methods=["PUT"])
@token_required(roles=["admin"])
def update_user(current_user_id, user_id):
    data = request.get_json()
    errors = request_update_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    try:
        # Nếu admin đang update chính mình thì KHÔNG cho đổi role
        if current_user_id == user_id and ("role" in data or "role_id" in data):
            return jsonify({
                "status": "error",
                "message": "Bạn không thể thay đổi quyền của chính mình."
            }), 403

        # Lấy role từ input
        role_name = data.get("role")
        role_id = data.get("role_id")

        role = None
        if role_name:  # Ưu tiên tìm theo tên role
            role = session.query(Role).filter_by(name=role_name.lower()).first()
        if not role and role_id:  # Nếu chưa tìm được thì fallback sang id
            role = session.query(Role).filter_by(role_id=role_id).first()

        if role:
            data["role_id"] = role.role_id
        else:
            # Không có role hợp lệ thì bỏ qua update role
            data.pop("role_id", None)

        # Update user
        updated_user = user_service.update_user(
            user_id=user_id,
            email=data.get("email"),
            role_id=data.get("role_id"),
            password=data.get("password")
        )

        session.close()

        if not updated_user:
            return jsonify({"status": "error", "message": "Không tìm thấy người dùng."}), 404

        user = session.query(UserModel).filter_by(user_id=user_id).first()

        return jsonify({
            "status": "success",
            "message": "Cập nhật người dùng thành công.",
            "data": response_schema.dump(user)
        }), 200

    except ValueError as e:
        session.close()
        return jsonify({"status": "error", "message": str(e)}), 400



@user_bp.route("/<int:user_id>", methods=["DELETE"])
@token_required(roles=["admin"])
def delete_user(current_user_id, user_id):
    # Không cho admin tự xoá chính mình
    if current_user_id == user_id:
        return jsonify({
            "status": "error",
            "message": "Bạn không thể xóa chính mình."
        }), 403

    # Lấy thông tin user trước khi xoá
    user = session.query(UserModel).filter_by(user_id=user_id).first()
    if not user:
        return jsonify({"status": "error", "message": "Không tìm thấy người dùng."}), 404

    email = user.email
    username = user.username
    success = user_service.delete_user(user_id)

    if success:
        return jsonify({
            "status": "success",
            "message": f"Đã xóa thành công người dùng {username} có email là {email}"
        }), 200
    else:
        return jsonify({"status": "error", "message": "Xóa thất bại"}), 400
