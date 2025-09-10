from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from src.infrastructure.databases.base import Base
from datetime import datetime

class ExamModel(Base):
    __tablename__ = "exams"

    exam_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("UserModel", backref="exams")
    questions = relationship("ExamQuestionModel", back_populates="exam")
    def to_dict(self):
        return {
            "exam_id": self.exam_id,
            "title": self.title,
            "subject": self.subject,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "questions": [q.question_id for q in self.questions] if hasattr(self, 'questions') else []
        }
