from infrastructure.databases.mssql import SessionLocal
from infrastructure.models.role_model import Role
from werkzeug.security import generate_password_hash
from infrastructure.models.user_model import UserModel

def seed_roles_and_admin():
    session = SessionLocal()  # 👉 tạo session mới

    try:
        # Seed roles
        default_roles = ["admin", "teacher", "staff", "manager"]
        for role_name in default_roles:
            existing = session.query(Role).filter_by(name=role_name).first()
            if not existing:
                role = Role(name=role_name)
                session.add(role)

        session.commit()

        # Seed admin user
        admin = session.query(UserModel).filter_by(username="admin").first()
        if not admin:
            admin_role = session.query(Role).filter_by(name="admin").first()
            hashed = generate_password_hash("123456")
            admin = UserModel(
                username="admin",
                password_hash=hashed,
                email="admin@planbookai.com",
                role_id=admin_role.role_id
            )
            session.add(admin)
            session.commit()
            print("✅ Seed admin thành công.")
        else:
            print("⚠️ Admin đã tồn tại.")

    finally:
        session.close()


if __name__ == "__main__":
    seed_roles_and_admin()
