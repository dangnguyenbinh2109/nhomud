from marshmallow import Schema, fields, validate

class PromptTemplateSchema(Schema):
    prompt_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    content = fields.Str(required=True, validate=validate.Length(min=10))
    created_by = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    approval_status = fields.Str(dump_only=True)

class PromptTemplateUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=3, max=255))
    content = fields.Str(validate=validate.Length(min=10))