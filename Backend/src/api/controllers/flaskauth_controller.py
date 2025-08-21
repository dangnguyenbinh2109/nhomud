import jwt
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from infrastructure.models.flaskuser_model import UserModel
from infrastructure.databases.mssql import session
from services.flaskuser_service import UserService
from api.schemas.flaskuser import UserSchema, UserPublicSchema
from config import Config
from infrastructure.repositories.flaskuser_repository import UserRepository
from api.middleware import token_required

user_repository = UserRepository(session)
user_service = UserService(user_repository)
request_schema = UserSchema()
response_schema = UserPublicSchema()

flaskauth_bp = Blueprint('flaskauth', __name__, url_prefix='/flaskauth')

@flaskauth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_name = data.get('user_name')
    password = data.get('password')

    # Gọi hàm authenticate_user để xác thực người dùng
    user = user_service.authenticate_user(user_name, password)

    if not user:
        # Nếu user là None, đăng nhập thất bại
        return jsonify({'error': 'Invalid credentials'}), 401

    # Nếu user hợp lệ, tạo JWT
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(hours=2) # Token hết hạn sau 2 giờ
    }
    
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token
    }), 200

@flaskauth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user_name = data.get('user_name')
    password = data.get('password')
    description = data.get('description')

    current_time = datetime.utcnow() # Lấy thời gian hiện tại

    try:
        user_service.create_user(
            user_name=user_name,
            password=password,
            description=description,
            created_at=current_time,
            updated_at=current_time
        )
        return jsonify({'message': 'User created successfully'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    
@flaskauth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({
        'message': 'Logout successful. Please remove the token on the client side.'
    }), 200

@flaskauth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('user_name')
    user = user_service.get_user_by_username(email)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    reset_token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        },
        Config.SECRET_KEY,
        algorithm='HS256'
    )
    # TODO: Gửi reset_token qua email cho user (ở đây trả về luôn để test)
    return jsonify({'message': 'Reset token generated', 'reset_token': reset_token}), 200

@flaskauth_bp.route('/reset-password', methods=['POST'])
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

# Dùng để test token @token_required
@flaskauth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(response_schema.dump(user)), 200

