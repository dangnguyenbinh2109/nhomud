from typing import List, Optional, Dict, Any
from domain.models.lesson_plan_template import LessonPlanTemplate
from infrastructure.repositories.lesson_plan_template_repository import LessonPlanTemplateRepository

class LessonPlanTemplateService:
    def __init__(self, repository: LessonPlanTemplateRepository):
        self.repository = repository

    def _to_domain(self, model) -> LessonPlanTemplate:
        return LessonPlanTemplate(
            template_id=model.template_id,
            name=model.name,
            description=model.description,
            structure=model.structure,
            created_by=model.created_by,
            created_at=model.created_at,
            updated_at=model.updated_at
        )

    def create_template(self, name: str, description: Optional[str], structure: Dict[str, Any], created_by: int) -> LessonPlanTemplate:
        template = LessonPlanTemplate(
            template_id=None,
            name=name,
            description=description,
            structure=structure,
            created_by=created_by
        )
        created_model = self.repository.create(template)
        return self._to_domain(created_model)

    def get_template_by_id(self, template_id: int) -> Optional[LessonPlanTemplate]:
        model = self.repository.get_by_id(template_id)
        if model:
            return self._to_domain(model)
        return None

    def get_all_templates(self) -> List[LessonPlanTemplate]:
        models = self.repository.get_all()
        return [self._to_domain(m) for m in models]

    def update_template(self, template_id: int, data: Dict[str, Any]) -> Optional[LessonPlanTemplate]:
        # Lọc ra các trường hợp lệ để cập nhật
        allowed_updates = {}
        if "name" in data:
            allowed_updates["name"] = data["name"]
        if "description" in data:
            allowed_updates["description"] = data["description"]
        if "structure" in data:
            allowed_updates["structure"] = data["structure"]

        if not allowed_updates:
            # Trả về đối tượng hiện tại nếu không có gì để cập nhật
            return self.get_template_by_id(template_id)

        updated_model = self.repository.update(template_id, allowed_updates)
        if updated_model:
            return self._to_domain(updated_model)
        return None

    def delete_template(self, template_id: int) -> bool:
        # Có thể thêm logic kiểm tra xem template có đang được sử dụng không trước khi xóa
        return self.repository.delete(template_id)