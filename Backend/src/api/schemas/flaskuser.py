from marshmallow import Schema, fields

class UserSchema(Schema):

    user_name = fields.String(required=True)
    password = fields.String(required=True)
    description = fields.String(required=False)
    status = fields.Boolean(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class UserPublicSchema(Schema):

    user_name = fields.String(required=True)
    description = fields.String(required=False)
    status = fields.Boolean(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)