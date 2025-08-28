from datetime import datetime
from typing import Optional
from domain.models.user_subscription import UserSubscription

class Order:
    def __init__(
        self,
        order_id: Optional[int],
        user_id: int,
        package_id: int,
        status: str = "pending",
        created_at: Optional[datetime] = None,
        paid_at: Optional[datetime] = None,
        subscription: Optional[UserSubscription] = None
    ):
        self.order_id = order_id
        self.user_id = user_id
        self.package_id = package_id
        self.status = status
        self.created_at = created_at or datetime.utcnow()
        self.paid_at = paid_at
        self.subscription = subscription  # ✅

    def approve(self):
        self.status = "paid"
        self.paid_at = datetime.utcnow()

    def cancel(self):
        self.status = "cancelled"

    def __repr__(self):
        return f"<Order id={self.order_id} status='{self.status}'>"
