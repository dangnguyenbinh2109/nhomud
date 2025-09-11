from marshmallow import Schema, fields, validate

class AIGeneratePromptSchema(Schema):
    prompt = fields.Str(required=True, validate=validate.Length(min=1))