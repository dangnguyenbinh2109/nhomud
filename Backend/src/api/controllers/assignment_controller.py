from flask import Blueprint, request, jsonify
from api.services.assignment_service import AssignmentService

assignment_bp = Blueprint("assignment", __name__)
assignment_service = AssignmentService()

@assignment_bp.route("", methods=["POST"])
def create_assignment():
    data = request.get_json()
    response = assignment_service.create_assignment(data)
    return jsonify(response), 201

@assignment_bp.route("", methods=["GET"])
def get_assignments():
    response = assignment_service.get_assignments()
    return jsonify(response), 200