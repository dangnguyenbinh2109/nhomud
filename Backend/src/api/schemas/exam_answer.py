from marshmallow import Schema, fields

class ExamAnswerSchema(Schema):
    id = fields.Integer(dump_only=True)
    exam_id = fields.Integer(required=True)
    question_id = fields.Integer(required=True)
    correct_answer = fields.String(required=True)
