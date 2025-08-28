from datetime import datetime
from typing import Optional

class UserSubscription:
    def __init__(
        self,
        subscription_id: Optional[int],
        user_id: int,
        package_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ):
        self.subscription_id = subscription_id
        self.user_id = user_id
        self.package_id = package_id
        self.start_date = start_date or datetime.utcnow()
        self.end_date = end_date

    def to_dict(self):
        return {
            "subscription_id": self.subscription_id,
            "user_id": self.user_id,
            "package_id": self.package_id,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None
        }
