from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Unicode, UnicodeText
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base
from datetime import datetime


class LessonPlanModel(Base):
    __tablename__ = "lesson_plans"

    lesson_id = Column(Integer, primary_key=True, index=True)
    title = Column(Unicode(255), nullable=False)
    description = Column(UnicodeText, nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("UserModel", backref="lesson_plans")
