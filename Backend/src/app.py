from flask import Flask, jsonify
from api.swagger import spec
from api.controllers.todo_controller import bp as todo_bp
from api.controllers.auth_controller import auth_bp
from api.controllers.flaskauth_controller import flaskauth_bp
from api.controllers.user_controller import user_bp
from api.middleware import middleware
from api.responses import success_response
from infrastructure.databases import init_db
from config import Config
from flasgger import Swagger
from config import SwaggerConfig
from flask_swagger_ui import get_swaggerui_blueprint
from cors import init_cors
from api.controllers.assignment_exam_controller import assignment_bp, exam_bp
from infrastructure.databases.seed import seed_roles_and_admin, seed_system_config
from api.controllers.question_controller import question_bp
from api.controllers.lesson_plan_controller import lesson_bp
from api.controllers.ocr_controller import ocr_bp
from api.controllers.admin_config_controller import admin_bp
from dotenv import load_dotenv
from utils.env_loader import load_env
load_env()
load_dotenv()

def create_app():
    app = Flask(__name__)
    Swagger(app)
    init_cors(app)

    # Đăng ký blueprint trước
    app.register_blueprint(todo_bp)

     # Thêm Swagger UI blueprint
    SWAGGER_URL = '/docs'
    API_URL = '/swagger.json'
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={'app_name': "Todo API"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(flaskauth_bp, url_prefix="/flaskauth")
    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(assignment_bp, url_prefix="/assignments")
    app.register_blueprint(exam_bp, url_prefix="/exams")
    app.register_blueprint(question_bp, url_prefix="/questions")
    app.register_blueprint(lesson_bp, url_prefix="/lesson-plans")
    app.register_blueprint(ocr_bp, url_prefix="/ocr")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    try:
        init_db(app)
    except Exception as e:
        print(f"Error initializing database: {e}")

    # Register middleware
    middleware(app)

    with app.app_context():
        seed_roles_and_admin()   # đảm bảo roles mặc định tồn tại
        seed_system_config()

    # Register routes
    with app.test_request_context():
        for rule in app.url_map.iter_rules():
            # Thêm các endpoint khác nếu cần
            if rule.endpoint.startswith(('todo.', 'course.', 'user.')):
                view_func = app.view_functions[rule.endpoint]
                #print(f"Adding path: {rule.rule} -> {view_func}")
                spec.path(view=view_func)

    @app.route("/swagger.json")
    def swagger_json():
        return jsonify(spec.to_dict())

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=6868, debug=True)