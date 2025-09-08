from typing import List, Optional
from domain.models.assignment import Assignment
from infrastructure.repositories.assignment_repository import AssignmentRepository
from services.approval_service import ApprovalService
from datetime import datetime


class AssignmentService:
    def __init__(self, repository: AssignmentRepository, approval_service: ApprovalService):
        self.repository = repository
        self.approval_service = approval_service

    def create_assignment(
        self,
        title: str,
        description: str,
        lesson_id: int,
        created_by: int
    ) -> Assignment:
        new_assignment = Assignment(
            assignment_id=None,
            title=title,
            description=description,
            lesson_id=lesson_id,
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        created_model = self.repository.create(new_assignment)

        # Gửi yêu cầu kiểm duyệt
        self.approval_service.request_approval(
            module="assignment",
            object_id=created_model.assignment_id,
            created_by=created_by,
            title=f"Bài tập: {created_model.title}",
            content=created_model.description
        )

        return Assignment(
            assignment_id=created_model.assignment_id,
            title=created_model.title,
            description=created_model.description,
            lesson_id=created_model.lesson_id,
            created_by=created_model.created_by,
            created_at=created_model.created_at
        )

    def get_all_assignments(self) -> List[Assignment]:
        models = self.repository.get_all()
        assignments_with_status = []
        for m in models:
            status = self.approval_service.get_status("assignment", m.assignment_id)
            assignment = Assignment(
                assignment_id=m.assignment_id,
                title=m.title,
                description=m.description,
                lesson_id=m.lesson_id,
                created_by=m.created_by,
                created_at=m.created_at,
                approval_status=status  # Giả sử Assignment model đã có trường này
            )
            assignments_with_status.append(assignment)
        return assignments_with_status

    # Bạn có thể thêm các hàm update, delete với logic kiểm duyệt tương tự