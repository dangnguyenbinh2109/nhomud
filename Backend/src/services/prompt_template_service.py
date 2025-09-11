from typing import List, Optional, Dict
from domain.models.prompt_template import PromptTemplate
from infrastructure.repositories.prompt_template_repository import PromptTemplateRepository
from services.approval_service import ApprovalService
from sqlalchemy.exc import IntegrityError

class PromptTemplateService:
    def __init__(self, repository: PromptTemplateRepository, approval_service: ApprovalService):
        self.repository = repository
        self.approval_service = approval_service

    def _to_domain(self, model, status: Optional[str] = None) -> PromptTemplate:
        return PromptTemplate(
            prompt_id=model.prompt_id,
            name=model.name,
            content=model.content,
            created_by=model.created_by,
            created_at=model.created_at,
            updated_at=model.updated_at,
            approval_status=status
        )

    def create_prompt_template(self, name: str, content: str, created_by: int) -> PromptTemplate:
        if self.repository.find_by_name(name):
            raise IntegrityError(f"Prompt template with name '{name}' already exists.", params=None, orig=None)

        created_model = self.repository.create(
            name=name,
            content=content,
            created_by=created_by
        )

        # Gửi yêu cầu kiểm duyệt
        self.approval_service.request_approval(
            module="prompt_template",
            object_id=created_model.prompt_id,
            created_by=created_by,
            title=f"Prompt: {created_model.name}",
            content=created_model.content
        )

        # Trạng thái ban đầu luôn là 'pending'
        return self._to_domain(created_model, status="pending")

    def get_all_prompt_templates(self) -> List[PromptTemplate]:
        models = self.repository.get_all()
        templates_with_status = []
        for m in models:
            status = self.approval_service.get_status("prompt_template", m.prompt_id)
            template = self._to_domain(m, status=status)
            templates_with_status.append(template)
        return templates_with_status

    def get_approved_prompt_templates(self) -> List[PromptTemplate]:
        """Chỉ lấy các prompt template đã được phê duyệt."""
        models = self.repository.get_all()
        approved_templates = []
        for m in models:
            if self.approval_service.get_status("prompt_template", m.prompt_id) == "approved":
                approved_templates.append(self._to_domain(m, status="approved"))
        return approved_templates

    def get_prompt_template_by_id(self, prompt_id: int) -> Optional[PromptTemplate]:
        model = self.repository.get_by_id(prompt_id)
        if model:
            status = self.approval_service.get_status("prompt_template", model.prompt_id)
            return self._to_domain(model, status=status)
        return None

    def update_prompt_template(self, prompt_id: int, data: Dict[str, str], user_id: int, user_roles: List[str]) -> Optional[PromptTemplate]:
        prompt = self.repository.get_by_id(prompt_id)
        if not prompt:
            return None

        # Staff chỉ được sửa prompt do mình tạo
        if "staff" in user_roles and "admin" not in user_roles and prompt.created_by != user_id:
            raise PermissionError("Permission denied. You can only edit your own templates.")

        updated_model = self.repository.update(prompt_id, data)
        
        # Logic nghiệp vụ: có thể gửi lại yêu cầu duyệt sau khi update
        # self.approval_service.request_approval(...)

        status = self.approval_service.get_status("prompt_template", updated_model.prompt_id)
        return self._to_domain(updated_model, status=status)

    def delete_prompt_template(self, prompt_id: int, user_id: int, user_roles: List[str]) -> bool:
        prompt = self.repository.get_by_id(prompt_id)
        if not prompt:
            return False # Hoặc raise NotFound

        # Staff chỉ được xóa prompt do mình tạo
        if "staff" in user_roles and "admin" not in user_roles and prompt.created_by != user_id:
            raise PermissionError("Permission denied. You can only delete your own templates.")

        # Logic nghiệp vụ: có thể kiểm tra trạng thái duyệt trước khi xóa
        # if self.approval_service.is_approved("prompt_template", prompt_id):
        #     return False

        return self.repository.delete(prompt_id)