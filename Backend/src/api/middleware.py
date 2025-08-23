# Middleware functions for processing requests and responses
import jwt
from flask import  request, jsonify
from functools import wraps
from config import Config
from infrastructure.databases.mssql import session
from infrastructure.models.user_model import UserModel
from infrastructure.models.role_model import Role

def log_request_info(app):
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())

def handle_options_request():
    return jsonify({'message': 'CORS preflight response'}), 200

def error_handling_middleware(error):
    response = jsonify({'error': str(error)})
    response.status_code = 500
    return response

def add_custom_headers(response):
    response.headers['X-Custom-Header'] = 'Value'
    return response

def middleware(app):
    @app.before_request
    def before_request():
        log_request_info(app)

    @app.after_request
    def after_request(response):
        return add_custom_headers(response)

    @app.errorhandler(Exception)
    def handle_exception(error):
        return error_handling_middleware(error)

    @app.route('/options', methods=['OPTIONS'])
    def options_route():
        return handle_options_request()
    
def token_required(f=None, *, roles=None):
    def decorator(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            token = None
            # Lấy token từ header Authorization
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]

            if not token:
                return jsonify({
                    "error_code": "TOKEN_MISSING",
                    "message": "Token is missing!"
                }), 401

            try:
                payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
                user_id = payload['user_id']
            except jwt.ExpiredSignatureError:
                return jsonify({
                    "error_code": "TOKEN_EXPIRED",
                    "message": "Access token expired!"
                }), 401
            except jwt.InvalidTokenError:
                return jsonify({
                    "error_code": "TOKEN_INVALID",
                    "message": "Invalid token!"
                }), 401

            # Nếu có roles thì check thêm quyền
            if roles:
                user = session.query(UserModel).filter_by(user_id=user_id).first()
                role = session.query(Role).filter_by(role_id=user.role_id).first() if user else None
                session.close()

                if not role or role.name not in roles:
                    return jsonify({
                        "error_code": "FORBIDDEN",
                        "message": "Permission denied!"
                    }), 403

            return func(user_id, *args, **kwargs)
        return decorated

    # Nếu decorator được dùng mà không truyền () thì f chính là hàm cần bọc
    if f:
        return decorator(f)
    return decorator

def refresh_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({'error': 'Thiếu refresh token'}), 401

        token = auth_header.split(" ")[1]
        try:
            decoded = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            if decoded.get('type') != 'refresh':
                return jsonify({'error': 'Token không hợp lệ'}), 401

            return f(decoded.get('user_id'), *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Refresh token đã hết hạn'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token không hợp lệ'}), 401

    return decorated