from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base
from datetime import datetime

class QuestionModel(Base):
    __tablename__ = "questions"

    question_id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    subject = Column(String(100), nullable=True)
    difficulty_level = Column(String(50), nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("UserModel", backref="questions")
