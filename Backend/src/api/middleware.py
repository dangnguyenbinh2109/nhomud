# src/api/middleware.py
"""
Middleware & auth decorators cho Flask.
- before_request: log gọn gàng
- after_request: add custom headers
- error handler: gói lỗi về JSON
- token_required: xác thực access token (HS256)
- refresh_token_required: xác thực refresh token (HS256, type='refresh')
"""

from functools import wraps
from typing import Callable, Iterable, Optional

import jwt
from flask import request, jsonify

from src.config import Config
from src.infrastructure.databases.mssql import SessionLocal
from src.infrastructure.models.user_model import UserModel
from src.infrastructure.models.role_model import Role


def _log_request(app) -> None:
    # Tránh log file lớn (multipart) và preflight
    if request.method == "OPTIONS":
        return
    try:
        app.logger.debug("👉 %s %s", request.method, request.path)
        # log header gọn
        app.logger.debug("Headers: %s", {k: v for k, v in request.headers.items()})
    except Exception:
        pass


def _json_error(message: str, status: int):
    resp = jsonify({"error": message})
    resp.status_code = status
    return resp


def middleware(app):
    """Đăng ký middleware vào Flask app."""

    @app.before_request
    def _before():
        _log_request(app)

    @app.after_request
    def _after(response):
        # ví dụ add custom header
        response.headers["X-App"] = "PlanbookAI"
        return response

    @app.errorhandler(Exception)
    def _on_error(err: Exception):
        # Đừng nuốt traceback trong dev; chỉ trả JSON ngắn gọn
        app.logger.exception(err)
        return _json_error(str(err), 500)

    # Preflight fallback (CORS chính dùng ở src/cors.py)
    @app.route("/__preflight__", methods=["OPTIONS"])
    def _preflight():
        return jsonify({"ok": True}), 200


def _open_session():
    """Mở session SQLAlchemy chuẩn, nhớ close ở finally."""
    return SessionLocal()


def token_required(fn: Optional[Callable] = None, *, roles: Optional[Iterable[str]] = None):
    """
    Dùng:
    @token_required
    def route(user_id): ...

    hoặc:
    @token_required(roles=["admin", "teacher"])
    def route(user_id): ...
    """

    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Lấy Bearer token
            auth = request.headers.get("Authorization", "")
            token = auth.split(" ", 1)[1] if auth.startswith("Bearer ") else None
            if not token:
                return _json_error("Token is missing!", 401)

            try:
                payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if not user_id:
                    return _json_error("Invalid token payload!", 401)
            except jwt.ExpiredSignatureError:
                return _json_error("Access token expired!", 401)
            except jwt.InvalidTokenError:
                return _json_error("Invalid token!", 401)

            # Nếu khai báo roles thì check quyền
            if roles:
                db = _open_session()
                try:
                    user = db.query(UserModel).filter_by(user_id=user_id).first()
                    role = db.query(Role).filter_by(role_id=user.role_id).first() if user else None
                finally:
                    db.close()

                if not role or role.name not in roles:
                    return _json_error("Permission denied!", 403)

            # Tiêm user_id vào tham số đầu tiên của handler
            return func(user_id, *args, **kwargs)

        return wrapper

    # Nếu decorator được dùng không có (), fn là handler
    return decorator if fn is None else decorator(fn)


def refresh_token_required(func: Callable):
    """Xác thực refresh token (type='refresh')."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.split(" ", 1)[1] if auth.startswith("Bearer ") else None
        if not token:
            return _json_error("Thiếu refresh token", 401)

        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            if payload.get("type") != "refresh":
                return _json_error("Token không hợp lệ", 401)
            user_id = payload.get("user_id")
            if not user_id:
                return _json_error("Token payload không hợp lệ", 401)
        except jwt.ExpiredSignatureError:
            return _json_error("Refresh token đã hết hạn", 401)
        except jwt.InvalidTokenError:
            return _json_error("Token không hợp lệ", 401)

        return func(user_id, *args, **kwargs)

    return wrapper
