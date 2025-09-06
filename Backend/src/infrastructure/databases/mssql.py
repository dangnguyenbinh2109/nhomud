from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import Config
from infrastructure.databases.base import Base
from sqlalchemy.orm import sessionmaker, scoped_session

# Database configuration
DATABASE_URI = Config.DATABASE_URI
engine = create_engine(DATABASE_URI)

session_factory = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

session = scoped_session(session_factory)
def init_mssql(app):
    Base.metadata.create_all(bind=engine)

def close_session():
    session.remove()