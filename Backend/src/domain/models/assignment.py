from datetime import datetime
from typing import Optional

class Assignment:
    def __init__(
        self,
        assignment_id: Optional[int],
        title: str,
        description: Optional[str],
        lesson_id: int,
        created_by: int,
        created_at: Optional[datetime] = None
    ):
        self.assignment_id = assignment_id
        self.title = title
        self.description = description
        self.lesson_id = lesson_id
        self.created_by = created_by
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> dict:
        return {
            "assignment_id": self.assignment_id,
            "title": self.title,
            "description": self.description,
            "lesson_id": self.lesson_id,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Assignment assignment_id={self.assignment_id} title='{self.title}'>"
