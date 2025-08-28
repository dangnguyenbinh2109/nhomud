from domain.models.package import Package
from infrastructure.repositories.package_repository import PackageRepository
from typing import List, Optional
from datetime import datetime

class PackageService:
    def __init__(self, repository: PackageRepository):
        self.repository = repository

    def create_package(self, name: str, description: str, price: float, duration_days: int) -> Package:
        new_package = Package(
            package_id=None,
            name=name,
            description=description,
            price=price,
            duration_days=duration_days,
            created_at=datetime.utcnow()
        )
        created_package = self.repository.create(new_package)
        return Package(
            package_id=created_package.package_id,
            name=created_package.name,
            description=created_package.description,
            price=float(created_package.price),
            duration_days=created_package.duration_days,
            created_at=created_package.created_at
        )

    def get_all_packages(self) -> List[Package]:
        package_models = self.repository.get_all()
        return [
            Package(
                package_id=p.package_id,
                name=p.name,
                description=p.description,
                price=float(p.price),
                duration_days=p.duration_days,
                created_at=p.created_at
            )
            for p in package_models
        ]

    def update_package(self, package_id: int, data: dict) -> Optional[Package]:
        package_model = self.repository.update(package_id, data)
        if not package_model:
            return None
        return Package(
            package_id=package_model.package_id,
            name=package_model.name,
            description=package_model.description,
            price=float(package_model.price),
            duration_days=package_model.duration_days,
            created_at=package_model.created_at
        )

    def delete_package(self, package_id: int) -> bool:
        return self.repository.delete(package_id)
