from infrastructure.repositories.system_config_repository import SystemConfigRepository
from domain.models.system_config import SystemConfig
from typing import List

class SystemConfigService:
    def __init__(self, repository: SystemConfigRepository):
        self.repository = repository

    def get_all_configs(self) -> List[SystemConfig]:
        configs = self.repository.get_all()
        return [SystemConfig(
            config_id=c.config_id,
            config_key=c.config_key,
            config_value=c.config_value,
            updated_at=c.updated_at
        ) for c in configs]

    def update_config(self, key: str, value: str) -> SystemConfig:
        updated = self.repository.update(key, value)
        if not updated:
            raise ValueError(f"Cấu hình '{key}' không tồn tại.")
        return SystemConfig(
            config_id=updated.config_id,
            config_key=updated.config_key,
            config_value=updated.config_value,
            updated_at=updated.updated_at
        )
