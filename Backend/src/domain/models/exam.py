from datetime import datetime
from typing import Optional, List

class Exam:
    def __init__(
        self,
        exam_id: Optional[int],
        title: str,
        subject: str,
        created_by: int,
        questions: Optional[List[int]] = None,
        created_at: Optional[datetime] = None
    ):
        self.exam_id = exam_id
        self.title = title
        self.subject = subject
        self.created_by = created_by
        self.questions = questions or []
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> dict:
        return {
            "exam_id": self.exam_id,
            "title": self.title,
            "subject": self.subject,
            "created_by": self.created_by,
            "questions": self.questions,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Exam exam_id={self.exam_id} title='{self.title}'>"
