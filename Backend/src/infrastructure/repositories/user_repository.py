from typing import Optional, List
from sqlalchemy.orm import Session
from infrastructure.models.user_model import UserModel
from domain.models.user import User
from dotenv import load_dotenv
from utils.env_loader import load_env
load_env()
load_dotenv()
class UserRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, user: User, hashed_password: str) -> UserModel:
        new_user_model = UserModel(
            username=user.username,
            password_hash=hashed_password,
            email=user.email,
            role_id=user.role_id,
            created_at=user.created_at
        )
        self.db_session.add(new_user_model)
        self.db_session.commit()
        return new_user_model

    def find_by_username(self, username: str) -> Optional[UserModel]:
        return self.db_session.query(UserModel).filter_by(username=username).first()

    def find_by_email(self, email: str) -> Optional[UserModel]:
        return self.db_session.query(UserModel).filter_by(email=email).first()

    def get_by_id(self, user_id: int) -> Optional[UserModel]:
        return self.db_session.query(UserModel).filter_by(user_id=user_id).first()

    def get_all(self) -> List[UserModel]:
        return self.db_session.query(UserModel).all()

    def update(self, user_id: int, data: dict) -> Optional[UserModel]:
        user = self.get_by_id(user_id)
        if not user:
            return None
        for key, value in data.items():
            setattr(user, key, value)
        self.db_session.commit()
        return user
    
    def delete(self, user_id: int) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False
        self.db_session.delete(user)
        self.db_session.commit()
        return True

    def update_password(self, user_id: int, hashed_password: str) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False
        user.password_hash = hashed_password
        self.db_session.commit()
        return True
