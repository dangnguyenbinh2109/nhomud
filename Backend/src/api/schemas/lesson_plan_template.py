from marshmallow import Schema, fields, validate

class LessonPlanTemplateSchema(Schema):
    template_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    description = fields.Str(required=False, allow_none=True)
    
    # `structure` là một JSON object, ví dụ: {"objectives": "string", "activities": "list"}
    structure = fields.Dict(keys=fields.Str(), values=fields.Raw(), required=True)
    
    created_by = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class LessonPlanTemplateUpdateSchema(Schema):
    name = fields.Str(required=False, validate=validate.Length(min=3, max=255))
    description = fields.Str(required=False, allow_none=True)
    structure = fields.Dict(keys=fields.Str(), values=fields.Raw(), required=False)