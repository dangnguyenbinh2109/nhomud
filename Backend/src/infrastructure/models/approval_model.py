from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from infrastructure.databases.base import Base
from datetime import datetime


class ApprovalModel(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(50), nullable=False, index=True)   # Ví dụ: "lesson_plan", "question_bank"
    object_id = Column(Integer, nullable=False, index=True) # ID của object cần duyệt
    title = Column(String(255), nullable=True)
    content = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
