from sqlalchemy import Column, Integer, String
from infrastructure.databases.base import Base

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"<Role(name={self.name})>"
