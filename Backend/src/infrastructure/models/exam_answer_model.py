from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base

class ExamAnswerModel(Base):
    __tablename__ = "exam_answers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.question_id"), nullable=False)
    correct_answer = Column(String(10), nullable=False)

    # relationship nếu muốn truy vấn dễ hơn
    exam = relationship("ExamModel", backref="exam_answers")
    question = relationship("QuestionModel", backref="exam_answers")
