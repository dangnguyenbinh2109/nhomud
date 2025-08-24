from marshmallow import Schema, fields

class AssignmentCreateSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=False)
    lesson_id = fields.Integer(required=True)

class AssignmentPublicSchema(Schema):
    assignment_id = fields.Integer()
    title = fields.String()
    description = fields.String()
    lesson_id = fields.Integer()
    created_by = fields.Integer()
    created_at = fields.DateTime()

class ExamCreateSchema(Schema):
    title = fields.String(required=True)
    subject = fields.String(required=True)
    questions = fields.List(fields.Integer(), required=False)

class ExamPublicSchema(Schema):
    exam_id = fields.Integer()
    title = fields.String()
    subject = fields.String()
    created_by = fields.Integer()
    created_at = fields.DateTime()
    questions = fields.Method("get_question_ids")

    def get_question_ids(self, obj):
        return [eq.question_id for eq in obj.questions]
