from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from infrastructure.databases.mssql import Base
from datetime import datetime

class QuestionModel(Base):
    __tablename__ = 'questions'

    question_id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    created_by = Column(Integer, ForeignKey('users.user_id'))
    created_at = Column(DateTime, default=datetime.utcnow)
