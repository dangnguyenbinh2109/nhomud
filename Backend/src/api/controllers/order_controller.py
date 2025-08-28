from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from infrastructure.repositories.order_repository import OrderRepository
from infrastructure.repositories.user_subscription_repository import UserSubscriptionRepository
from services.order_service import OrderService
from api.schemas.order import OrderSchema, SubscriptionSchema, OrderWithSubscriptionSchema
from api.middleware import token_required

order_bp = Blueprint("orders", __name__, url_prefix="/orders")

order_repository = OrderRepository(session)
subscription_repository = UserSubscriptionRepository(session)
order_service = OrderService(order_repository, subscription_repository)

order_schema = OrderSchema()
order_list_schema = OrderSchema(many=True)
order_with_sub_schema = OrderWithSubscriptionSchema()

@order_bp.route("", methods=["POST"])
@token_required
def create_order(user_id):
    """
    Tạo order mới
    ---
    post:
      summary: Tạo order mới
      description: Tạo mới một order
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                package_id:
                  type: integer
                quantity:
                  type: integer
      responses:
        201:
          description: Order created
        400:
          description: Validation error
    """
    data = request.get_json()
    package_id = data.get("package_id")
    if not package_id:
        return jsonify({"status": "error", "message": "Package ID is required"}), 400

    order = order_service.create_order(user_id=user_id, package_id=package_id)
    return jsonify({
        "status": "success",
        "message": "Order created successfully",
        "data": order_schema.dump(order)
    }), 201

@order_bp.route("", methods=["GET"])
@token_required(roles=["admin", "manager"])
def get_orders(user_id):
    """
    Lấy tất cả order
    ---
    get:
      summary: Lấy tất cả order
      description: Trả về danh sách order
      security:
        - bearerAuth: []
      responses:
        200:
          description: List of orders
    """
    orders = order_service.list_orders()
    return jsonify({
        "status": "success",
        "orders": order_list_schema.dump(orders)
    }), 200


@order_bp.route("/<int:order_id>/approve", methods=["PUT"])
@token_required(roles=["admin", "manager"])
def approve_order(user_id, order_id):
    order = order_service.approve_order(order_id)
    if not order:
        return jsonify({"status": "error", "message": "Order not found"}), 404
    return jsonify({
        "status": "success",
        "message": "Order approved and subscription activated",
        "data": order_with_sub_schema.dump(order)
    }), 200


@order_bp.route("/<int:order_id>/cancel", methods=["PUT"])
@token_required(roles=["admin", "manager"])
def cancel_order(user_id, order_id):
    order = order_service.cancel_order(order_id)
    if not order:
        return jsonify({"status": "error", "message": "Order not found"}), 404
    return jsonify({
        "status": "success",
        "message": "Order cancelled successfully",
        "data": order_schema.dump(order)
    }), 200
