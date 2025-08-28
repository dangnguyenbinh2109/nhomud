from marshmallow import Schema, fields, validates, ValidationError

class PackageCreateSchema(Schema):
    name = fields.String(required=True)
    description = fields.String(required=False)
    price = fields.Float(required=True)
    duration_days = fields.Integer(required=True)

    @validates("price")
    def validate_price(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("Giá gói phải > 0.")

    @validates("duration_days")
    def validate_duration_days(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("Số ngày hiệu lực phải > 0.")

class PackagePublicSchema(Schema):
    package_id = fields.Integer(dump_only=True)
    name = fields.String()
    description = fields.String()
    price = fields.Float()
    duration_days = fields.Integer()
    created_at = fields.DateTime(dump_only=True)
