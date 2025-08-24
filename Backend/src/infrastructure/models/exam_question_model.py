from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class ExamQuestionModel(Base):
    __tablename__ = "exam_questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id"))
    question_id = Column(Integer, ForeignKey("questions.question_id"))

    exam = relationship("ExamModel", back_populates="questions")
