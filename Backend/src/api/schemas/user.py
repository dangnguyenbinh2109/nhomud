from marshmallow import Schema, fields, validates, ValidationError
from marshmallow import post_dump
from utils.validators import is_email
from infrastructure.models.role_model import Role
from infrastructure.databases.mssql import session

class UserCreateSchema(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)
    email = fields.String(required=False)
    role_id = fields.Integer(required=False)
    role = fields.String(required=True)

    @validates("email")
    def validate_email(self, value, **kwargs):
        if value and not is_email(value):
            raise ValidationError("Email không hợp lệ.")

class UserUpdateSchema(Schema):
    email = fields.String(required=False)
    role_id = fields.Integer(required=False)
    role = fields.String(required=True)
    password = fields.String(required=False)
    
    @validates("email")
    def validate_email(self, value, **kwargs):
        if value and not is_email(value):
            raise ValidationError("Email không hợp lệ.")

class UserPublicSchema(Schema):
    user_id = fields.Integer(dump_only=True)
    username = fields.String()
    email = fields.String()
    role_id = fields.Integer()
    role = fields.Method("get_role_name")   # ✅ Lấy tên role bằng Method field
    created_at = fields.DateTime(dump_only=True)

    def get_role_name(self, obj):
        if obj.role_id:
            role = session.query(Role).filter_by(role_id=obj.role_id).first()
            return role.name if role else None
        return None
