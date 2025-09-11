from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Unicode, UnicodeText
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base
from datetime import datetime

class QuestionModel(Base):
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, index=True)
    content = Column(UnicodeText, nullable=False)
    subject = Column(Unicode(100), nullable=True)
    difficulty_level = Column(Unicode(50), nullable=True)
    correct_answer = Column(Unicode(255), nullable=True)  # Thêm cột đáp án đúng
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("UserModel", backref="questions")
