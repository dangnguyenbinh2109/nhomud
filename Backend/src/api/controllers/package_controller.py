from flask import Blueprint, request, jsonify
from infrastructure.databases.mssql import session
from services.package_service import PackageService
from infrastructure.repositories.package_repository import PackageRepository
from api.schemas.package import PackageCreateSchema, PackagePublicSchema
from api.middleware import token_required

package_repository = PackageRepository(session)
package_service = PackageService(package_repository)
request_schema = PackageCreateSchema()
response_schema = PackagePublicSchema()
response_many_schema = PackagePublicSchema(many=True)

package_bp = Blueprint("packages", __name__, url_prefix="/packages")

@package_bp.route("", methods=["POST"])
@token_required(roles=["admin", "manager"])
def create_package(user_id):
    """
    Tạo package mới
    ---
    post:
      summary: Tạo package mới
      description: Tạo mới một package
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                price:
                  type: number
      responses:
        201:
          description: Package created
        400:
          description: Validation error
    """
    data = request.get_json()
    errors = request_schema.validate(data)
    if errors:
        return jsonify({"status": "error", "message": errors}), 400
    
    package = package_service.create_package(
        name=data["name"],
        description=data.get("description"),
        price=data["price"],
        duration_days=data["duration_days"]
    )
    return jsonify({
        "status": "success",
        "message": "Package created successfully",
        "data": response_schema.dump(package)
    }), 201

@package_bp.route("", methods=["GET"])
@token_required
def get_packages(user_id):
    """
    Lấy tất cả package
    ---
    get:
      summary: Lấy tất cả package
      description: Trả về danh sách package
      security:
        - bearerAuth: []
      responses:
        200:
          description: List of packages
    """
    packages = package_service.get_all_packages()
    return jsonify({
        "status": "success",
        "packages": response_many_schema.dump(packages)
    }), 200

@package_bp.route("/<int:package_id>", methods=["PUT"])
@token_required(roles=["admin", "manager"])
def update_package(user_id, package_id):
    data = request.get_json()
    package = package_service.update_package(package_id, data)
    if not package:
        return jsonify({"status": "error", "message": "Package not found"}), 404
    return jsonify({
        "status": "success",
        "message": "Package updated successfully",
        "data": response_schema.dump(package)
    }), 200

@package_bp.route("/<int:package_id>", methods=["DELETE"])
@token_required(roles=["admin", "manager"])
def delete_package(user_id, package_id):
    success = package_service.delete_package(package_id)
    if not success:
        return jsonify({"status": "error", "message": "Package not found"}), 404
    return jsonify({
        "status": "success",
        "message": "Package deleted successfully"
    }), 200
