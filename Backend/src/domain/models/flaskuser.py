from sqlalchemy import Column, Integer, String, DateTime, Boolean
from infrastructure.databases.base import Base
from datetime import datetime
from typing import Optional
class User:
    def __init__(self, user_name: str, password: str, id: Optional[int] = None, description: Optional[str] = None, status: bool = True, created_at: Optional[datetime] = None, updated_at: Optional[datetime] = None):
        self.id = id
        self.user_name = user_name
        self.password = password
        self.description = description
        self.status = status
        self.created_at = created_at
        self.updated_at = updated_at

    def to_dict(self):
        """Chuyển đổi đối tượng User thành dictionary."""
        return {
            "id": self.id,
            "user_name": self.user_name,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }