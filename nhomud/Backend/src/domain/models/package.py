from datetime import datetime
from typing import Optional

class Package:
    def __init__(
        self,
        package_id: Optional[int],
        name: str,
        description: Optional[str],
        price: float,
        duration_days: int,
        created_at: Optional[datetime] = None
    ):
        self.package_id = package_id
        self.name = name
        self.description = description
        self.price = price
        self.duration_days = duration_days
        self.created_at = created_at or datetime.utcnow()

    def update_info(self, name: str, description: str, price: float, duration_days: int):
        self.name = name
        self.description = description
        self.price = price
        self.duration_days = duration_days

    def to_dict(self) -> dict:
        return {
            "package_id": self.package_id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "duration_days": self.duration_days,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Package package_id={self.package_id} name='{self.name}'>"
