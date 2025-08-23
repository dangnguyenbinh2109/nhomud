from werkzeug.security import generate_password_hash, check_password_hash
from domain.models.user import User
from infrastructure.repositories.user_repository import UserRepository
from typing import Optional
from datetime import datetime
from utils.validators import is_email
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
            raise ValueError("Tên người dùng đã tồn tại, vui lòng sử dụng tên người dùng khác.")
        existing_email = self.repository.find_by_email(email)
        if existing_email:
            raise ValueError("Email đã tồn tại, vui lòng nhập email khác.")
        
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

        user_model = self.repository.find_by_email(username)
        if not user_model:
            user_model = self.repository.find_by_username(username)
        if not user_model:
            raise ValueError("Người dùng " + username + " chưa được đăng ký.")
        
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
    
    def get_all_users(self):
        return self.repository.get_all()

    def update_user(self, user_id: int, email: Optional[str] = None, role_id: Optional[int] = None, password: Optional[str] = None) -> Optional[User]:
        data = {}
        if email:
            if not is_email(email):
                raise ValueError("Email không hợp lệ.")
            data["email"] = email
        if role_id:
            data["role_id"] = role_id
        if password:
            from werkzeug.security import generate_password_hash
            data["password_hash"] = generate_password_hash(password)

        updated_user = self.repository.update(user_id, data)
        if not updated_user:
            return None

        return User(
            user_id=updated_user.user_id,
            username=updated_user.username,
            password_hash=updated_user.password_hash,
            email=updated_user.email,
            role_id=updated_user.role_id,
            created_at=updated_user.created_at
        )

    def delete_user(self, user_id: int) -> bool:
        return self.repository.delete(user_id)