from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Unicode, UnicodeText
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class LessonPlanTemplateModel(Base):
    __tablename__ = 'lesson_plan_templates'

    template_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Unicode(255), nullable=False, unique=True)
    description = Column(UnicodeText, nullable=True)
    
    # Dùng kiểu JSON để lưu cấu trúc linh hoạt của template
    # Ví dụ: {"objectives": [], "activities": [], "assessments": []}
    structure = Column(JSON, nullable=False)

    created_by = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())