from typing import Optional
from sqlalchemy.orm import Session
from infrastructure.models.user_model import UserModel
from domain.models.user import User

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