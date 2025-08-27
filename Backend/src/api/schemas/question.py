from marshmallow import Schema, fields, validates, ValidationError

class QuestionCreateSchema(Schema):
    content = fields.String(required=True)
    subject = fields.String(required=False)
    difficulty_level = fields.String(required=False)
    correct_answer = fields.String(required=True)  # Thêm field đáp án đúng

class QuestionUpdateSchema(Schema):
    content = fields.String(required=False)
    subject = fields.String(required=False)
    difficulty_level = fields.String(required=False)
    correct_answer = fields.String(required=False)  # Có thể update đáp án

class QuestionPublicSchema(Schema):
    question_id = fields.Integer(dump_only=True)
    content = fields.String()
    subject = fields.String()
    difficulty_level = fields.String()
    correct_answer = fields.String()  # Trả về đáp án nếu cần
    created_by = fields.Integer()
    created_at = fields.DateTime(dump_only=True)
