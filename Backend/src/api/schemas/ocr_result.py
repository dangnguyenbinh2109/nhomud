from marshmallow import Schema, fields

class OCRResultSchema(Schema):
    ocr_id = fields.Int(dump_only=True)
    exam_id = fields.Int(required=True)
    student_name = fields.Str()
    score = fields.Float()
    processed_at = fields.DateTime(dump_only=True)
    raw_text = fields.Str(allow_none=True)