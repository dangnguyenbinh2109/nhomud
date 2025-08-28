from marshmallow import Schema, fields

class SubscriptionSchema(Schema):
    subscription_id = fields.Int()
    user_id = fields.Int()
    package_id = fields.Int()
    start_date = fields.DateTime()
    end_date = fields.DateTime()

class OrderSchema(Schema):
    order_id = fields.Int()
    user_id = fields.Int()
    package_id = fields.Int()
    status = fields.Str()
    created_at = fields.DateTime()
    paid_at = fields.DateTime(allow_none=True)

class OrderWithSubscriptionSchema(OrderSchema):
    subscription = fields.Nested(SubscriptionSchema, allow_none=True)
