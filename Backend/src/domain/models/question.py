from typing import Optional
from datetime import datetime


class Question:
    def __init__(
        self,
        question_id: Optional[int],
        content: str,
        subject: Optional[str],
        difficulty_level: Optional[str],
        correct_answer: Optional[str],
        created_by: Optional[int],
        created_at: datetime,
        approval_status: Optional[str] = None
    ):
        self.question_id = question_id
        self.content = content
        self.subject = subject
        self.difficulty_level = difficulty_level
        self.correct_answer = correct_answer
        self.created_by = created_by
        self.created_at = created_at
        self.approval_status = approval_status