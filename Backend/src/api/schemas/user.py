from marshmallow import Schema, fields

class UserCreateSchema(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)  # plaintext password input
    email = fields.String(required=False)
    role_id = fields.Integer(required=False)


class UserPublicSchema(Schema):
    user_id = fields.Integer(dump_only=True)
    username = fields.String()
    email = fields.String()
    role_id = fields.Integer()
    created_at = fields.DateTime(dump_only=True)