from datetime import datetime
from typing import Optional

class User:
    def __init__(
        self,
        user_id: Optional[int],
        username: str,
        password_hash: str,
        email: Optional[str] = None,
        role_id: Optional[int] = None,
        created_at: Optional[datetime] = None
    ):
        self.user_id = user_id
        self.username = username
        self.password_hash = password_hash
        self.email = email
        self.role_id = role_id
        self.created_at = created_at or datetime.utcnow()

    def change_password(self, new_password_hash: str):
        self.password_hash = new_password_hash

    def change_email(self, new_email: str):
        self.email = new_email

    def assign_role(self, role_id: int):
        self.role_id = role_id

    def to_dict(self) -> dict:
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "role_id": self.role_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<User user_id={self.user_id} username='{self.username}'>"
