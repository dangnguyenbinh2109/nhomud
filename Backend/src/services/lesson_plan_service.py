from domain.models.lesson_plan import LessonPlan
from infrastructure.repositories.lesson_plan_repository import LessonPlanRepository
from typing import List, Optional
from datetime import datetime


class LessonPlanService:
    def __init__(self, repository: LessonPlanRepository):
        self.repository = repository

    def create_lesson_plan(self, title: str, description: str, created_by: int) -> LessonPlan:
        lesson = LessonPlan(
            lesson_id=None,
            title=title,
            description=description,
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        created_model = self.repository.create(lesson)
        return LessonPlan(
            lesson_id=created_model.lesson_id,
            title=created_model.title,
            description=created_model.description,
            created_by=created_model.created_by,
            created_at=created_model.created_at
        )

    def get_lesson_plan_by_id(self, lesson_id: int) -> Optional[LessonPlan]:
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
        ]

    def update_lesson_plan(self, lesson_id: int, title: str, description: str) -> Optional[LessonPlan]:
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
        return self.repository.delete(lesson_id)
