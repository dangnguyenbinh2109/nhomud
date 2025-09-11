from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Unicode, UnicodeText
from sqlalchemy.sql import func
from infrastructure.databases.base import Base

class PromptTemplateModel(Base):
    __tablename__ = 'prompt_templates'

    prompt_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Unicode(255), nullable=False, unique=True)
    content = Column(UnicodeText, nullable=False)
    created_by = Column(Integer, ForeignKey('users.user_id'), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            'prompt_id': self.prompt_id,
            'name': self.name,
            'content': self.content,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }