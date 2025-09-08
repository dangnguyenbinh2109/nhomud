from domain.models.lesson_plan import LessonPlan
from infrastructure.repositories.lesson_plan_repository import LessonPlanRepository
from services.approval_service import ApprovalService
from typing import List, Optional
from datetime import datetime


class LessonPlanService:
    def __init__(self, repository: LessonPlanRepository, approval_service: ApprovalService):
        self.repository = repository
        self.approval_service = approval_service

    def create_lesson_plan(self, title: str, description: str, created_by: int) -> LessonPlan:
        lesson = LessonPlan(
            lesson_id=None,
            title=title,
            description=description,
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        created_model = self.repository.create(lesson)

        # Gửi yêu cầu duyệt
        self.approval_service.request_approval(
            module="lesson_plan",
            object_id=created_model.lesson_id,
            created_by=created_by,
            title=created_model.title,
            content=created_model.description
        )

        return LessonPlan(
            lesson_id=created_model.lesson_id,
            title=created_model.title,
            description=created_model.description,
            created_by=created_model.created_by,
            created_at=created_model.created_at
        )

    def get_lesson_plan_by_id(self, lesson_id: int) -> Optional[LessonPlan]:
        if not self.approval_service.is_approved("lesson_plan", lesson_id):
            return None
        model = self.repository.get_by_id(lesson_id)
        if model:
            return LessonPlan(
                lesson_id=model.lesson_id,
                title=model.title,
                description=model.description,
                created_by=model.created_by,
                created_at=model.created_at
            )
        return None

    def get_all_lesson_plans(self) -> List[LessonPlan]:
        models = self.repository.get_all()
        return [
            LessonPlan(
                lesson_id=m.lesson_id,
                title=m.title,
                description=m.description,
                created_by=m.created_by,
                created_at=m.created_at
            )
            for m in models
            if self.approval_service.is_approved("lesson_plan", m.lesson_id)
        ]

    def update_lesson_plan(self, lesson_id: int, title: str, description: str) -> Optional[LessonPlan]:
        if not self.approval_service.is_approved("lesson_plan", lesson_id):
            return None
        model = self.repository.update(lesson_id, title, description)
        if model:
            return LessonPlan(
                lesson_id=model.lesson_id,
                title=model.title,
                description=model.description,
                created_by=model.created_by,
                created_at=model.created_at
            )
        return None

    def delete_lesson_plan(self, lesson_id: int) -> bool:
        if not self.approval_service.is_approved("lesson_plan", lesson_id):
            return False
        return self.repository.delete(lesson_id)
