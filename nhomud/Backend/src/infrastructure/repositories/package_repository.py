from typing import List, Optional
from sqlalchemy.orm import Session
from infrastructure.models.package_model import PackageModel
from domain.models.package import Package

class PackageRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, package: Package) -> PackageModel:
        new_package = PackageModel(
            name=package.name,
            description=package.description,
            price=package.price,
            duration_days=package.duration_days,
            created_at=package.created_at
        )
        self.db_session.add(new_package)
        self.db_session.commit()
        return new_package

    def get_all(self) -> List[PackageModel]:
        return self.db_session.query(PackageModel).all()

    def get_by_id(self, package_id: int) -> Optional[PackageModel]:
        return self.db_session.query(PackageModel).filter_by(package_id=package_id).first()

    def update(self, package_id: int, data: dict) -> Optional[PackageModel]:
        package = self.get_by_id(package_id)
        if not package:
            return None
        for key, value in data.items():
            setattr(package, key, value)
        self.db_session.commit()
        return package

    def delete(self, package_id: int) -> bool:
        package = self.get_by_id(package_id)
        if not package:
            return False
        self.db_session.delete(package)
        self.db_session.commit()
        return True
