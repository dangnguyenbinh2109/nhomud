from typing import Optional
from datetime import datetime


class LessonPlan:
    def __init__(
        self,
        lesson_id: Optional[int],
        title: str,
        description: str,
        created_by: int,
        created_at: datetime,
        approval_status: Optional[str] = None
    ):
        self.lesson_id = lesson_id
        self.title = title
        self.description = description
        self.created_by = created_by
        self.created_at = created_at
        self.approval_status = approval_status