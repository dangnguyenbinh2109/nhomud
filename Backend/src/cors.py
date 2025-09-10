# src/cors.py
from flask import Flask
from flask_cors import CORS


def init_cors(app: Flask) -> None:
    """
    Bật CORS cho toàn bộ API.
    - Cho phép FE ở http://localhost:5173 (vite) và http://localhost:3000 (tuỳ em)
    - Nếu muốn mở hết: origins="*"
    """
    CORS(
        app,
        resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
        supports_credentials=True,
        max_age=86400,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    )
