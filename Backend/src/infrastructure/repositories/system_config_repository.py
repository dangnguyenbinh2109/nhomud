from typing import List, Optional
from sqlalchemy.orm import Session
from infrastructure.models.system_config_model import SystemConfigModel
from domain.models.system_config import SystemConfig
from dotenv import load_dotenv
from utils.env_loader import load_env
load_env()
load_dotenv()
class SystemConfigRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_all(self) -> List[SystemConfigModel]:
        return self.db_session.query(SystemConfigModel).all()

    def get_by_key(self, key: str) -> Optional[SystemConfigModel]:
        return self.db_session.query(SystemConfigModel).filter_by(config_key=key).first()

    def update(self, key: str, value: str) -> Optional[SystemConfigModel]:
        config = self.get_by_key(key)
        if config:
            config.config_value = value
            self.db_session.commit()
        return config
