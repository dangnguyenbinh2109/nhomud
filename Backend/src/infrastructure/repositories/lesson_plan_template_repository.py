from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from domain.models.lesson_plan_template import LessonPlanTemplate
from infrastructure.models.lesson_plan_template_model import LessonPlanTemplateModel

class LessonPlanTemplateRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, template: LessonPlanTemplate) -> LessonPlanTemplateModel:
        model = LessonPlanTemplateModel(
            name=template.name,
            description=template.description,
            structure=template.structure,
            created_by=template.created_by
        )
        self.db_session.add(model)
        self.db_session.commit()
        self.db_session.refresh(model)
        return model

    def get_by_id(self, template_id: int) -> Optional[LessonPlanTemplateModel]:
        return self.db_session.query(LessonPlanTemplateModel).filter_by(template_id=template_id).first()

    def get_all(self) -> List[LessonPlanTemplateModel]:
        return self.db_session.query(LessonPlanTemplateModel).all()

    def update(self, template_id: int, data: Dict[str, Any]) -> Optional[LessonPlanTemplateModel]:
        model = self.get_by_id(template_id)
        if model:
            for key, value in data.items():
                setattr(model, key, value)
            self.db_session.commit()
        return model

    def delete(self, template_id: int) -> bool:
        model = self.get_by_id(template_id)
        if model:
            self.db_session.delete(model)
            self.db_session.commit()
            return True
        return False