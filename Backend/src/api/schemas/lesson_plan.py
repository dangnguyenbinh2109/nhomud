from marshmallow import Schema, fields


class LessonPlanCreateSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=False)


class LessonPlanUpdateSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=False)


class LessonPlanPublicSchema(Schema):
    lesson_id = fields.Integer(dump_only=True)
    title = fields.String()
    description = fields.String()
    created_by = fields.Integer()
    created_at = fields.DateTime(dump_only=True)
