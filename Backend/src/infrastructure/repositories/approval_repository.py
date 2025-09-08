from sqlalchemy.orm import Session
from infrastructure.models.approval_model import ApprovalModel
from domain.models.approval import Approval
from typing import Optional, List
from datetime import datetime


class ApprovalRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_pending(self) -> List[ApprovalModel]:
        return self.db_session.query(ApprovalModel).filter_by(status="pending").all()

    def get_by_id(self, approval_id: int) -> Optional[ApprovalModel]:
        return self.db_session.query(ApprovalModel).filter_by(id=approval_id).first()

    def update_status(self, approval_id: int, status: str) -> Optional[ApprovalModel]:
        model = self.get_by_id(approval_id)
        if not model:
            return None
        model.status = status
        self.db_session.commit()
        return model

    def create_request(self, module: str, object_id: int, created_by: int, title: str = None, content: str = None) -> ApprovalModel:
        """Tạo yêu cầu duyệt mới"""
        approval = ApprovalModel(
            type=module,
            object_id=object_id,
            title=title,
            content=content,
            created_by=created_by,
            status="pending",
            created_at=datetime.utcnow()
        )
        self.db_session.add(approval)
        self.db_session.commit()
        return approval

    def get_latest(self, module: str, object_id: int) -> Optional[ApprovalModel]:
        """Lấy record duyệt mới nhất cho 1 object"""
        return (
            self.db_session.query(ApprovalModel)
            .filter_by(type=module, object_id=object_id)
            .order_by(ApprovalModel.created_at.desc())
            .first()
        )
