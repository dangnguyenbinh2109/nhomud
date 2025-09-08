from flask import Blueprint, jsonify
from infrastructure.databases.mssql import session
from services.approval_service import ApprovalService
from api.schemas.approval import ApprovalPublicSchema
from infrastructure.repositories.approval_repository import ApprovalRepository
from api.middleware import token_required

approval_repository = ApprovalRepository(session)
approval_service = ApprovalService(approval_repository)
response_schema = ApprovalPublicSchema()

approval_bp = Blueprint('approval', __name__, url_prefix='/approvals')

@approval_bp.route('/pending', methods=['GET'])
@token_required(roles=["admin", "manager"])
def get_pending(user_id):
    pending = approval_service.get_pending()
    return jsonify({
        'status': 'success',
        'pending_contents': response_schema.dump(pending, many=True)
    }), 200

@approval_bp.route('/<int:approval_id>/approve', methods=['PUT'])
@token_required(roles=["admin", "manager"])
def approve_content(user_id, approval_id):
    result = approval_service.approve(approval_id)
    if not result:
        return jsonify({'status': 'error', 'message': 'Content not found'}), 404
    return jsonify({
        'status': 'success',
        'message': 'Content approved successfully',
        'data': {'id': result.id, 'status': result.status}
    }), 200

@approval_bp.route('/<int:approval_id>/reject', methods=['PUT'])
@token_required(roles=["admin", "manager"])
def reject_content(user_id, approval_id):
    result = approval_service.reject(approval_id)
    if not result:
        return jsonify({'status': 'error', 'message': 'Content not found'}), 404
    return jsonify({
        'status': 'success',
        'message': 'Content rejected',
        'data': {'id': result.id, 'status': result.status}
    }), 200

@approval_bp.route("/approve-all", methods=["POST"])
@token_required
def approve_all(user_id):
    """Duyệt tất cả các yêu cầu đang pending"""
    pending = approval_service.get_pending()
    approved = []

    for a in pending:
        approved_item = approval_service.approve(a.id)
        if approved_item:
            approved.append(approved_item.__dict__)

    return jsonify({
        "status": "success",
        "message": f"{len(approved)} approval(s) approved successfully",
        "data": approved
    }), 200