from flask import Flask
from flasgger import Swagger
from config import Config, SwaggerConfig
from cors import init_cors
from infrastructure.databases import init_db, close_session
from infrastructure.databases.seed import seed_roles_and_admin, seed_system_config
from api.middleware import middleware
from api.controllers.todo_controller import bp as todo_bp
from api.controllers.auth_controller import auth_bp
from api.controllers.flaskauth_controller import flaskauth_bp
from api.controllers.user_controller import user_bp
from api.controllers.assignment_exam_controller import assignment_bp, exam_bp
from api.controllers.question_controller import question_bp
from api.controllers.lesson_plan_controller import lesson_bp
from api.controllers.ocr_controller import ocr_bp
from api.controllers.admin_config_controller import admin_bp
from api.controllers.package_controller import package_bp
from api.controllers.order_controller import order_bp
from api.controllers.approval_controller import approval_bp
from api.controllers.prompt_template_controller import prompt_template_bp
from api.controllers.lesson_plan_template_controller import template_bp
from api.controllers.ai_controller import ai_bp
from api.controllers.public_question_controller import public_question_bp
from error_handler import register_error_handlers
from app_logging import setup_logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Swagger(app, config=SwaggerConfig.swagger_config, template=SwaggerConfig.template)
    init_cors(app)

    setup_logging(app)
    register_error_handlers(app)

    # Đăng ký blueprints
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
    app.register_blueprint(package_bp, url_prefix="/packages")
    app.register_blueprint(order_bp, url_prefix="/orders")
    app.register_blueprint(approval_bp, url_prefix="/approvals")
    app.register_blueprint(prompt_template_bp, url_prefix="/prompt-templates")
    app.register_blueprint(template_bp, url_prefix="/lesson-plan-templates")
    app.register_blueprint(ai_bp, url_prefix="/ai")
    app.register_blueprint(public_question_bp, url_prefix="/public") # Giữ nguyên


    init_db(app)
    middleware(app)

    with app.app_context():
        seed_roles_and_admin()
        seed_system_config()

    @app.teardown_appcontext
    def teardown_db(exception=None):
        close_session()

    return app