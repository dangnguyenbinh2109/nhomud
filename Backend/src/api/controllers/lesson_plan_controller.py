from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from infrastructure.repositories.lesson_plan_repository import LessonPlanRepository
from infrastructure.repositories.approval_repository import ApprovalRepository
from services.lesson_plan_service import LessonPlanService
from services.approval_service import ApprovalService
from api.schemas.lesson_plan import LessonPlanCreateSchema, LessonPlanUpdateSchema, LessonPlanPublicSchema
from api.middleware import token_required

# Khởi tạo repository + service
lesson_plan_repository = LessonPlanRepository(session)
approval_repository = ApprovalRepository(session)
approval_service = ApprovalService(approval_repository)
lesson_plan_service = LessonPlanService(lesson_plan_repository, approval_service)

create_schema = LessonPlanCreateSchema()
update_schema = LessonPlanUpdateSchema()
public_schema = LessonPlanPublicSchema()
public_list_schema = LessonPlanPublicSchema(many=True)

lesson_bp = Blueprint("lesson_plan", __name__, url_prefix="/lesson-plans")


@lesson_bp.route("", methods=["POST"])
@token_required
def create_lesson_plan(user_id):
    data = request.get_json()
    errors = create_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    lesson = lesson_plan_service.create_lesson_plan(
        title=data["title"],
        description=data.get("description"),
        created_by=user_id
    )
    return jsonify({
        "status": "success",
        "message": "Lesson plan created successfully",
        "data": public_schema.dump(lesson)
    }), 201


@lesson_bp.route("", methods=["GET"])
@token_required
def get_all_lesson_plans(user_id):
    lessons = lesson_plan_service.get_all_lesson_plans()
    return jsonify({
        "status": "success",
        "message": "Lesson plans retrieved successfully",
        "lesson_plans": public_list_schema.dump(lessons)
    }), 200


@lesson_bp.route("/<int:lesson_id>", methods=["GET"])
@token_required
def get_lesson_plan(user_id, lesson_id):
    lesson = lesson_plan_service.get_lesson_plan_by_id(lesson_id)
    if not lesson:
        return jsonify({"status": "error", "message": "Lesson plan not found or not approved"}), 404
    return jsonify({
        "status": "success",
        "message": "Lesson plan retrieved successfully",
        "data": public_schema.dump(lesson)
    }), 200


@lesson_bp.route("/<int:lesson_id>", methods=["PUT"])
@token_required
def update_lesson_plan(user_id, lesson_id):
    data = request.get_json()
    errors = update_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400

    lesson = lesson_plan_service.update_lesson_plan(
        lesson_id=lesson_id,
        title=data["title"],
        description=data.get("description")
    )
    if not lesson:
        return jsonify({"status": "error", "message": "Lesson plan not found or not approved"}), 404

    return jsonify({
        "status": "success",
        "message": "Lesson plan updated successfully",
        "data": public_schema.dump(lesson)
    }), 200


@lesson_bp.route("/<int:lesson_id>", methods=["DELETE"])
@token_required
def delete_lesson_plan(user_id, lesson_id):
    success = lesson_plan_service.delete_lesson_plan(lesson_id)
    if not success:
        return jsonify({"status": "error", "message": "Lesson plan not found or not approved"}), 404
    return jsonify({
        "status": "success",
        "message": "Lesson plan deleted successfully"
    }), 200
