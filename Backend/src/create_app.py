# src/create_app.py
from flask import Flask, jsonify
from flasgger import Swagger
from flask_swagger_ui import get_swaggerui_blueprint
from dotenv import load_dotenv

from src.utils.env_loader import load_env
from src.cors import init_cors
from src.api.middleware import middleware         # 👈 dùng middleware (không phải setup_middleware)
from src.api.swagger import spec

# Blueprints
from src.api.controllers.todo_controller import bp as todo_bp
from src.api.controllers.auth_controller import auth_bp
from src.api.controllers.flaskauth_controller import flaskauth_bp
from src.api.controllers.user_controller import user_bp
from src.api.controllers.assignment_exam_controller import assignment_bp, exam_bp
from src.api.controllers.question_controller import question_bp
from src.api.controllers.lesson_plan_controller import lesson_bp
from src.api.controllers.ocr_controller import ocr_bp
from src.api.controllers.admin_config_controller import admin_bp

from src.infrastructure.databases import init_db
from src.infrastructure.databases.seed import seed_roles_and_admin, seed_system_config


def create_app():
    # env
    load_env()
    load_dotenv()

    app = Flask(__name__)
    Swagger(app)
    init_cors(app)

    # blueprints
    app.register_blueprint(todo_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(flaskauth_bp, url_prefix="/flaskauth")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(assignment_bp, url_prefix="/assignments")
    app.register_blueprint(exam_bp, url_prefix="/exams")
    app.register_blueprint(question_bp, url_prefix="/questions")
    app.register_blueprint(lesson_bp, url_prefix="/lesson-plans")
    app.register_blueprint(ocr_bp, url_prefix="/ocr")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    # swagger ui
    SWAGGER_URL = "/docs"
    API_URL = "/swagger.json"
    swaggerui = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={"app_name": "PlanbookAI API"})
    app.register_blueprint(swaggerui, url_prefix=SWAGGER_URL)

    # DB + middleware
    try:
        init_db(app)
    except Exception as e:
        print(f"[init_db] {e}")

    middleware(app)  # 👈 gọi middleware ở đây

    # seed
    with app.app_context():
        try:
            seed_roles_and_admin()
            seed_system_config()
        except Exception as e:
            print(f"[seed] {e}")

    @app.route("/swagger.json")
    def swagger_json():
        return jsonify(spec.to_dict())

    return app
