from typing import Optional, List
from sqlalchemy.orm import Session
from infrastructure.models.lesson_plan_model import LessonPlanModel
from domain.models.lesson_plan import LessonPlan


class LessonPlanRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, lesson: LessonPlan) -> LessonPlanModel:
        lesson_model = LessonPlanModel(
            title=lesson.title,
            description=lesson.description,
            created_by=lesson.created_by,
            created_at=lesson.created_at
        )
        self.db_session.add(lesson_model)
        self.db_session.commit()
        return lesson_model

    def get_by_id(self, lesson_id: int) -> Optional[LessonPlanModel]:
        return self.db_session.query(LessonPlanModel).filter_by(lesson_id=lesson_id).first()

    def get_all(self) -> List[LessonPlanModel]:
        return self.db_session.query(LessonPlanModel).all()

    def update(self, lesson_id: int, title: str, description: str) -> Optional[LessonPlanModel]:
        lesson_model = self.get_by_id(lesson_id)
        if lesson_model:
            lesson_model.title = title
            lesson_model.description = description
            self.db_session.commit()
        return lesson_model

    def delete(self, lesson_id: int) -> bool:
        lesson_model = self.get_by_id(lesson_id)
        if lesson_model:
            self.db_session.delete(lesson_model)
            self.db_session.commit()
            return True
        return False
