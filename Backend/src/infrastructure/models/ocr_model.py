from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base
from datetime import datetime

class OCRResultModel(Base):
    __tablename__ = "ocr_results"

    ocr_id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.exam_id"), nullable=False)
    student_name = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)
    processed_at = Column(DateTime, default=datetime.utcnow)

    exam = relationship("ExamModel", backref="ocr_results")
