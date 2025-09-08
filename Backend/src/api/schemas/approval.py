from marshmallow import Schema, fields

class ApprovalPublicSchema(Schema):
    id = fields.Integer()
    type = fields.String()
    title = fields.String()
    content = fields.String()
    created_by = fields.Integer()
    status = fields.String()
    created_at = fields.DateTime()
