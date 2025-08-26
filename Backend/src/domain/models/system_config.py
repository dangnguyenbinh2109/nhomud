from datetime import datetime
from typing import Optional

class SystemConfig:
    def __init__(
        self,
        config_id: Optional[int],
        config_key: str,
        config_value: str,
        updated_at: Optional[datetime] = None
    ):
        self.config_id = config_id
        self.config_key = config_key
        self.config_value = config_value
        self.updated_at = updated_at or datetime.utcnow()

    def update_value(self, new_value: str):
        self.config_value = new_value
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        return {
            "config_id": self.config_id,
            "config_key": self.config_key,
            "config_value": self.config_value,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<SystemConfig {self.config_key}={self.config_value}>"
