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
        user_name: str,
        password: str,
        description: Optional[str] = None,
        created_at: datetime = None,
        updated_at: datetime = None
    ) -> User:
        existing_user = self.repository.find_by_username(user_name)
        if existing_user:
            raise ValueError("Username already exists.")
        
        hashed_password = generate_password_hash(password)
        
        new_user = User(
            user_name=user_name,
            password=password, # Lưu mật khẩu gốc vào đối tượng domain
            description=description,
            status=True,
            created_at=created_at,
            updated_at=updated_at
        )
        
        # Lưu vào DB thông qua repository
        return self.repository.create(new_user, hashed_password) # Sửa ở đây
    
    def authenticate_user(self, user_name: str, password: str) -> Optional[User]:
        """
        Xác thực người dùng dựa trên user_name và mật khẩu.
        """
        user_model = self.repository.find_by_username(user_name)
        
        if user_model and check_password_hash(user_model.password, password):
            # Nếu xác thực thành công, trả về đối tượng User domain
            return User(
                id=user_model.id, # Lấy id từ UserModel và truyền vào User
                user_name=user_model.user_name,
                password=user_model.password,
                description=user_model.description,
                status=user_model.status,
                created_at=user_model.created_at,
                updated_at=user_model.updated_at
            )
        
        return None