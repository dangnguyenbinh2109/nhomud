from sqlalchemy.orm import Session
from infrastructure.models.prompt_template_model import PromptTemplateModel
from typing import List, Optional

class PromptTemplateRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, name: str, content: str, created_by: int) -> PromptTemplateModel:
        prompt = PromptTemplateModel(name=name, content=content, created_by=created_by)
        self.session.add(prompt)
        self.session.commit()
        self.session.refresh(prompt)
        return prompt

    def get_by_id(self, prompt_id: int) -> Optional[PromptTemplateModel]:
        return self.session.query(PromptTemplateModel).filter_by(prompt_id=prompt_id).first()

    def get_all(self) -> List[PromptTemplateModel]:
        return self.session.query(PromptTemplateModel).all()

    def update(self, prompt_id: int, data: dict) -> Optional[PromptTemplateModel]:
        prompt = self.get_by_id(prompt_id)
        if prompt:
            for key, value in data.items():
                setattr(prompt, key, value)
            self.session.commit()
            self.session.refresh(prompt)
        return prompt

    def delete(self, prompt_id: int) -> bool:
        prompt = self.get_by_id(prompt_id)
        if prompt:
            self.session.delete(prompt)
            self.session.commit()
            return True
        return False

    def find_by_name(self, name: str) -> Optional[PromptTemplateModel]:
        return self.session.query(PromptTemplateModel).filter_by(name=name).first()