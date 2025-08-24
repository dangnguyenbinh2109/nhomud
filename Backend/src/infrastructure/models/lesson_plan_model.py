from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class LessonPlanModel(Base):
    __tablename__ = "lesson_plans"
    lesson_id = Column(Integer, primary_key=True)
