from sqlalchemy import Column, Integer, ForeignKey, DateTime
from infrastructure.databases.base import Base
from datetime import datetime

class UserSubscriptionModel(Base):
    __tablename__ = "user_subscriptions"

    subscription_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.package_id"), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
