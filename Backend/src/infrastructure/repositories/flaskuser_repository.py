from src.domain.models.itodo_repository import ITodoRepository
from src.domain.models.todo import Todo
from typing import List, Optional
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.config import Config
from sqlalchemy import Column, Integer, String, DateTime,Boolean
from src.infrastructure.databases import Base
from src.infrastructure.models.flaskuser_model import FlaskUserModel
from src.domain.models.flaskuser import User
from dotenv import load_dotenv
from src.utils.env_loader import load_env
load_env()
load_dotenv()

class UserRepository:
    __tablename__ = 'flask_user'
    __table_args__ = {'extend_existing': True}  # Thêm dòng này

    def __init__(self, db_session):
        self.db_session = db_session

    def create(self, user: User, hashed_password: str) -> FlaskUserModel:
        new_user_model = FlaskUserModel(
            user_name=user.user_name,
            password=hashed_password,
            description=user.description,
            status=user.status,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
        self.db_session.add(new_user_model)
        self.db_session.commit()
        return new_user_model

    def find_by_username(self, user_name: str) -> FlaskUserModel:
        return self.db_session.query(FlaskUserModel).filter_by(user_name=user_name).first()
    
    def get_by_id(self, user_id):
        return self.db_session.query(FlaskUserModel).filter_by(id=user_id).first()

    