from marshmallow import Schema, fields

class ExamQuestionSchema(Schema):
    """
    Schema for question data when viewed inside a public exam.
    It deliberately OMITS the 'correct_answer'.
    """
    question_id = fields.Integer(dump_only=True)
    content = fields.String()
    subject = fields.String()
    difficulty_level = fields.String()

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
    questions = fields.Nested(ExamQuestionSchema, many=True)

class PublicExamWithIDsSchema(Schema):
    """
    Schema for public exam view, returns only question IDs.
    """
    exam_id = fields.Integer()
    title = fields.String()
    subject = fields.String()
    created_at = fields.DateTime()
    questions = fields.Method("get_question_ids")

    def get_question_ids(self, obj):
        return [q.question_id for q in obj.questions]
