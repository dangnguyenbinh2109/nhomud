from sqlalchemy import Column, Integer, String, DateTime
from src.infrastructure.databases.base import Base
from datetime import datetime

class SystemConfigModel(Base):
    __tablename__ = "system_config"

    config_id = Column(Integer, primary_key=True, index=True)
    config_key = Column(String(100), nullable=False, unique=True)
    config_value = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
