from src.infrastructure.databases.mssql import SessionLocal
from src.infrastructure.models.role_model import Role
from werkzeug.security import generate_password_hash
from src.infrastructure.models.user_model import UserModel
from src.infrastructure.models.system_config_model import SystemConfigModel
from datetime import datetime

def seed_roles_and_admin():
    session = SessionLocal()

    try:
        # Seed roles
        default_roles = ["admin", "teacher", "staff", "manager"]
        for role_name in default_roles:
            existing = session.query(Role).filter_by(name=role_name).first()
            if not existing:
                role = Role(name=role_name)
                session.add(role)

        session.commit()

        # Danh sách users mặc định
        default_users = [
            {"username": "admin", "email": "admin@planbookai.com", "role": "admin"},
            {"username": "teacher1", "email": "teacher1@planbookai.com", "role": "teacher"},
            {"username": "staff1", "email": "staff1@planbookai.com", "role": "staff"},
            {"username": "manager1", "email": "manager1@planbookai.com", "role": "manager"},
            {"username": "user1", "email": "user1@planbookai.com", "role": "teacher"},  # ví dụ user thường
        ]

        for u in default_users:
            existing_user = session.query(UserModel).filter_by(username=u["username"]).first()
            if not existing_user:
                role_obj = session.query(Role).filter_by(name=u["role"]).first()
                hashed = generate_password_hash("123456")  # mật khẩu mặc định
                new_user = UserModel(
                    username=u["username"],
                    password_hash=hashed,
                    email=u["email"],
                    role_id=role_obj.role_id
                )
                session.add(new_user)
                print(f"✅ Seed user {u['username']} thành công.")
            else:
                pass
                #print(f"⚠️ User {u['username']} đã tồn tại.")

        session.commit()

    finally:
        session.close()

def seed_system_config():
    session = SessionLocal()

    try:
        # Các cấu hình mặc định
        default_configs = [
            {"config_key": "max_upload_size", "config_value": "10MB"},
            {"config_key": "allow_ocr", "config_value": "true"},
            {"config_key": "default_language", "config_value": "en"},
            {"config_key": "session_timeout_minutes", "config_value": "120"},
            {"config_key": "theme", "config_value": "light"},
        ]

        for cfg in default_configs:
            existing = session.query(SystemConfigModel).filter_by(config_key=cfg["config_key"]).first()
            if not existing:
                new_cfg = SystemConfigModel(
                    config_key=cfg["config_key"],
                    config_value=cfg["config_value"],
                    updated_at=datetime.utcnow()
                )
                session.add(new_cfg)
                print(f"✅ Seed config '{cfg['config_key']}' thành công.")
            else:
                pass
                #print(f"⚠️ Config '{cfg['config_key']}' đã tồn tại, bỏ qua.")

        session.commit()

    finally:
        session.close()

if __name__ == "__main__":
    seed_roles_and_admin()
    seed_system_config()
