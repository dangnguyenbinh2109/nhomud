from datetime import datetime
from typing import Optional

class Approval:
    def __init__(
        self,
        id: Optional[int],
        type: str,
        title: Optional[str],
        content: Optional[str],
        created_by: int,
        status: str = "pending",
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.type = type
        self.title = title
        self.content = content
        self.created_by = created_by
        self.status = status
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "title": self.title,
            "content": self.content,
            "created_by": self.created_by,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
