import jwt
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from infrastructure.databases.mssql import session
from services.user_service import UserService
from api.schemas.user import UserCreateSchema, UserPublicSchema
from config import Config
from infrastructure.repositories.user_repository import UserRepository
from infrastructure.models.role_model import Role
from api.middleware import token_required, refresh_token_required

user_repository = UserRepository(session)
user_service = UserService(user_repository)
request_schema = UserCreateSchema()
response_schema = UserPublicSchema()

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Xác thực user
    try:
        user = user_service.authenticate_user(username, password)
    except ValueError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 404

    if not user:
        return jsonify({'status': 'error', 'message': 'Sai mật khẩu.'}), 401

    # Lấy role name từ role_id
    role = session.query(Role).filter_by(role_id=user.role_id).first()
    role_name = role.name if role else None

    # Access Token: 2 giờ
    payload = {
        'user_id': user.user_id,
        'exp': datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

    # Refresh Token: 7 ngày
    refresh_payload = {
        'user_id': user.user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'type': 'refresh'
    }
    refresh_token = jwt.encode(refresh_payload, Config.SECRET_KEY, algorithm='HS256')

    return jsonify({
        'status': 'success',
        'token': token,
        'refresh_token': refresh_token,
        'user': {
            'user_id': user.user_id,
            'username': user.username,
            'role': role_name
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def signup():
    data = request.get_json()
    errors = request_schema.validate(data)
    if errors:
        first_errors = [msgs[0] for msgs in errors.values()]
        return jsonify({'status': 'error', 'message': "; ".join(first_errors)}), 400

    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    # Lấy role "teacher" hoặc tạo nếu chưa có
    role = session.query(Role).filter_by(name="teacher").first()
    if not role:
        role = Role(name="teacher")
        session.add(role)
        session.flush()

    role_id = role.role_id

    try:
        # Tạo user mới
        user = user_service.create_user(
            username=username,
            password=password,
            email=email,
            role_id=role_id
        )

        # Lấy role name từ role_id
        role_name = role.name

        return jsonify({
            'status': 'success',
            'message': 'Tạo tài khoản thành công, bạn có thể đăng nhập bây giờ',
            'data': {
                'user_id': user.user_id,
                'username': user.username,
                'role': role_name
            }
        }), 201

    except ValueError as e:
        return jsonify({'status': 'error', 'message': str(e)}), 409

@auth_bp.route('/refresh', methods=['POST'])
@refresh_token_required
def refresh_token(user_id):
    new_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=2)
    }
    new_token = jwt.encode(new_payload, Config.SECRET_KEY, algorithm='HS256')

    return jsonify({'token': new_token}), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({
        'message': 'Logout successful. Please remove the token on the client side.'
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = user_service.get_user_by_username(email)  # Có thể đổi sang get_user_by_email nếu cần
    if not user:
        return jsonify({'error': 'User not found'}), 404

    reset_token = jwt.encode(
        {
            'user_id': user.user_id,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        },
        Config.SECRET_KEY,
        algorithm='HS256'
    )
    return jsonify({'message': 'Reset token generated', 'reset_token': reset_token}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')
    try:
        payload = jwt.decode(reset_token, Config.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user_service.update_password(user_id, new_password)
        return jsonify({'message': 'Password reset successful'}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Reset token expired'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid reset token'}), 400

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user_id):
    try:
        user = user_service.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        data = response_schema.dump(user)
        print("Dump result:", data)
        return jsonify(data), 200
    except Exception as e:
        print("Error in /me:", e)
        return jsonify({'error': str(e)}), 500