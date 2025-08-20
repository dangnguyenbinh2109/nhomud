import jwt
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from infrastructure.models.user_model import UserModel
from infrastructure.databases.mssql import session
from services.user_service import UserService
from api.schemas.user import UserSchema, UserPublicSchema
from config import Config
from infrastructure.repositories.user_repository import UserRepository
from api.middleware import token_required

user_repository = UserRepository(session)
user_service = UserService(user_repository)
request_schema = UserSchema()
response_schema = UserPublicSchema()

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
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

@auth_bp.route('/signup', methods=['POST'])
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
    
@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({
        'message': 'Logout successful. Please remove the token on the client side.'
    }), 200


#Dùng để test token @token_required
@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user_id):
    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(response_schema.dump(user)), 200
