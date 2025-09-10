from flask import Blueprint, request, jsonify
from src.infrastructure.databases.mssql import session
from src.infrastructure.repositories.question_repository import QuestionRepository
from src.services.question_service import QuestionService
from src.api.schemas.question import QuestionCreateSchema, QuestionUpdateSchema, QuestionPublicSchema
from src.api.middleware import token_required

question_repository = QuestionRepository(session)
question_service = QuestionService(question_repository)

question_bp = Blueprint('question', __name__, url_prefix='/questions')

create_schema = QuestionCreateSchema()
update_schema = QuestionUpdateSchema()
public_schema = QuestionPublicSchema()
public_list_schema = QuestionPublicSchema(many=True)

@question_bp.route('', methods=['GET'])
@token_required(roles=["admin", "staff"])
def get_all_questions(user_id):
    questions = question_service.get_all_questions()
    return jsonify({"status": "success", "message": "Question added successfully", "questions": public_list_schema.dump(questions)}), 200

@question_bp.route('', methods=['POST'])
@token_required(roles=["admin", "staff"])
def create_question(user_id):
    data = request.get_json()
    errors = create_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    question = question_service.create_question(
        content=data.get("content"),
        subject=data.get("subject"),
        difficulty_level=data.get("difficulty_level"),
        correct_answer=data.get("correct_answer"),  # <--- thêm dòng này
        created_by=user_id
    )

    return jsonify({
        "status": "success",
        "message": "Question added successfully",
        "data": public_schema.dump(question)
    }), 201


@question_bp.route('/<int:question_id>', methods=['PUT'])
@token_required(roles=["admin", "staff"])
def update_question(user_id, question_id):
    data = request.get_json()
    errors = update_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    updated_question = question_service.update_question(question_id, data)
    if not updated_question:
        return jsonify({"status": "error", "message": "Question not found"}), 404

    return jsonify({"status": "success", "message": "Question updated successfully", "data": public_schema.dump(updated_question)}), 200

@question_bp.route('/<int:question_id>', methods=['DELETE'])
@token_required(roles=["admin", "staff"])
def delete_question(user_id, question_id):
    deleted = question_service.delete_question(question_id)
    if not deleted:
        return jsonify({"status": "error", "message": "Question not found"}), 404

    return jsonify({"status": "success", "message": "Question deleted"}), 200
