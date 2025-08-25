from datetime import datetime
from typing import Optional


class LessonPlan:
    def __init__(
        self,
        lesson_id: Optional[int],
        title: str,
        description: Optional[str] = None,
        created_by: Optional[int] = None,
        created_at: Optional[datetime] = None
    ):
        self.lesson_id = lesson_id
        self.title = title
        self.description = description
        self.created_by = created_by
        self.created_at = created_at or datetime.utcnow()

    def update_title(self, new_title: str):
        self.title = new_title

    def update_description(self, new_description: str):
        self.description = new_description

    def to_dict(self) -> dict:
        return {
            "lesson_id": self.lesson_id,
            "title": self.title,
            "description": self.description,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<LessonPlan lesson_id={self.lesson_id} title='{self.title}'>"
