from marshmallow import Schema, fields, validates, ValidationError
from utils.validators import is_email

class UserCreateSchema(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)
    email = fields.String(required=False)
    role_id = fields.Integer(required=False)

    @validates("email")
    def validate_email(self, value, **kwargs):
        if value and not is_email(value):
            raise ValidationError("Email không hợp lệ.")


class UserPublicSchema(Schema):
    user_id = fields.Integer(dump_only=True)
    username = fields.String()
    email = fields.String()
    role_id = fields.Integer()
    created_at = fields.DateTime(dump_only=True)
