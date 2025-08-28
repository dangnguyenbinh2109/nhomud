from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, Text
from infrastructure.databases.base import Base
from datetime import datetime

class PackageModel(Base):
    __tablename__ = "packages"

    package_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(DECIMAL(18, 2), nullable=False)
    duration_days = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
