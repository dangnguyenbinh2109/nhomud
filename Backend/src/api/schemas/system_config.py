from marshmallow import Schema, fields, validates, ValidationError

class SystemConfigSchema(Schema):
    config_id = fields.Integer(dump_only=True)
    config_key = fields.String(required=True)
    config_value = fields.String(required=True)
    updated_at = fields.DateTime(dump_only=True)
