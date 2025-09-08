from infrastructure.repositories.approval_repository import ApprovalRepository
from domain.models.approval import Approval
from typing import List, Optional


class ApprovalService:
    def __init__(self, repository: ApprovalRepository):
        self.repository = repository

    def get_pending(self) -> List[Approval]:
        models = self.repository.get_pending()
        return [
            Approval(
                id=m.id,
                type=m.type,
                title=m.title,
                content=m.content,
                created_by=m.created_by,
                status=m.status,
                created_at=m.created_at
            )
            for m in models
        ]

    def approve(self, approval_id: int) -> Optional[Approval]:
        model = self.repository.update_status(approval_id, "approved")
        if not model:
            return None
        return Approval(
            id=model.id,
            type=model.type,
            title=model.title,
            content=model.content,
            created_by=model.created_by,
            status=model.status,
            created_at=model.created_at
        )

    def reject(self, approval_id: int) -> Optional[Approval]:
        model = self.repository.update_status(approval_id, "rejected")
        if not model:
            return None
        return Approval(
            id=model.id,
            type=model.type,
            title=model.title,
            content=model.content,
            created_by=model.created_by,
            status=model.status,
            created_at=model.created_at
        )

    def request_approval(self, module: str, object_id: int, created_by: int, title: str = None, content: str = None):
        """Tạo yêu cầu kiểm duyệt cho một object"""
        return self.repository.create_request(
            module=module,
            object_id=object_id,
            created_by=created_by,
            title=title,
            content=content
        )

    def is_approved(self, module: str, object_id: int) -> bool:
        """Kiểm tra object có được duyệt chưa"""
        approval = self.repository.get_latest(module, object_id)
        return approval is not None and approval.status == "approved"

    def get_status(self, module: str, object_id: int) -> Optional[str]:
        """Lấy trạng thái duyệt mới nhất của object"""
        approval = self.repository.get_latest(module, object_id)
        if approval:
            return approval.status
        return "pending" # Hoặc None nếu bạn muốn. 'pending' có thể an toàn hơn.
