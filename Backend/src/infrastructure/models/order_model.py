from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from infrastructure.databases.base import Base
from datetime import datetime

class OrderModel(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.package_id"), nullable=False)
    status = Column(String(50), default="pending")  # pending, paid, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime, nullable=True)

    user = relationship("UserModel", backref="orders")
    package = relationship("PackageModel", backref="orders")
