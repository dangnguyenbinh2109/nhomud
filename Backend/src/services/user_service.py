from werkzeug.security import generate_password_hash, check_password_hash
from domain.models.user import User
from infrastructure.repositories.user_repository import UserRepository
from typing import Optional
from datetime import datetime

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def create_user(
        self,
        username: str,
        password: str,
        email: Optional[str] = None,
        role_id: Optional[int] = None
    ) -> User:
        # Kiểm tra username đã tồn tại
        existing_user = self.repository.find_by_username(username)
        if existing_user:
            raise ValueError("Username already exists.")
        
        # Hash password
        hashed_password = generate_password_hash(password)
        
        # Tạo domain object
        new_user = User(
            user_id=None,
            username=username,
            password_hash=hashed_password,
            email=email,
            role_id=role_id,
            created_at=datetime.utcnow()
        )
        
        # Lưu vào DB thông qua repository
        created_user_model = self.repository.create(new_user, hashed_password)

        # Chuyển về domain object (không trả mật khẩu)
        return User(
            user_id=created_user_model.user_id,
            username=created_user_model.username,
            password_hash=created_user_model.password_hash,
            email=created_user_model.email,
            role_id=created_user_model.role_id,
            created_at=created_user_model.created_at
        )

    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """
        Xác thực người dùng dựa trên username và mật khẩu.
        """
        user_model = self.repository.find_by_username(username)
        
        if user_model and check_password_hash(user_model.password_hash, password):
            return User(
                user_id=user_model.user_id,
                username=user_model.username,
                password_hash=user_model.password_hash,
                email=user_model.email,
                role_id=user_model.role_id,
                created_at=user_model.created_at
            )
        
        return None

    def get_user_by_username(self, username: str) -> Optional[User]:
        """
        Lấy thông tin người dùng theo username.
        """
        user_model = self.repository.find_by_username(username)
        if user_model:
            return User(
                user_id=user_model.user_id,
                username=user_model.username,
                password_hash=user_model.password_hash,
                email=user_model.email,
                role_id=user_model.role_id,
                created_at=user_model.created_at
            )
        return None

    def update_password(self, user_id: int, new_password: str) -> bool:
        """
        Cập nhật mật khẩu mới cho người dùng.
        """
        hashed_password = generate_password_hash(new_password)
        return self.repository.update_password(user_id, hashed_password)

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        user_model = self.repository.get_by_id(user_id)
        if user_model:
            return User(
                user_id=user_model.user_id,
                username=user_model.username,
                password_hash=user_model.password_hash,
                email=user_model.email,
                role_id=user_model.role_id,
                created_at=user_model.created_at
            )
        return None