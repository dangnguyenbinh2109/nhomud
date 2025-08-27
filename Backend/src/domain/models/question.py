from datetime import datetime
from typing import Optional

class Question:
    def __init__(
        self,
        question_id: Optional[int],
        content: str,
        subject: Optional[str] = None,
        difficulty_level: Optional[str] = None,
        correct_answer: Optional[str] = None,   # Thêm field correct_answer
        created_by: Optional[int] = None,
        created_at: Optional[datetime] = None
    ):
        self.question_id = question_id
        self.content = content
        self.subject = subject
        self.difficulty_level = difficulty_level
        self.correct_answer = correct_answer
        self.created_by = created_by
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> dict:
        return {
            "question_id": self.question_id,
            "content": self.content,
            "subject": self.subject,
            "difficulty_level": self.difficulty_level,
            "correct_answer": self.correct_answer,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Question id={self.question_id} subject='{self.subject}'>"
