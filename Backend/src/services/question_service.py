from typing import List, Optional
from src.domain.models.question import Question
from src.infrastructure.repositories.question_repository import QuestionRepository
from datetime import datetime

class QuestionService:
    def __init__(self, repository: QuestionRepository):
        self.repository = repository

    def create_question(
        self,
        content: str,
        subject: Optional[str],
        difficulty_level: Optional[str],
        correct_answer: Optional[str],   # Thêm correct_answer
        created_by: Optional[int]
    ) -> Question:
        new_question = Question(
            question_id=None,
            content=content,
            subject=subject,
            difficulty_level=difficulty_level,
            correct_answer=correct_answer,   # Gán correct_answer
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        created_model = self.repository.create(new_question)
        return Question(
            question_id=created_model.question_id,
            content=created_model.content,
            subject=created_model.subject,
            difficulty_level=created_model.difficulty_level,
            correct_answer=created_model.correct_answer,  # trả correct_answer
            created_by=created_model.created_by,
            created_at=created_model.created_at
        )

    def get_all_questions(self) -> List[Question]:
        models = self.repository.get_all()
        return [
            Question(
                question_id=m.question_id,
                content=m.content,
                subject=m.subject,
                difficulty_level=m.difficulty_level,
                correct_answer=m.correct_answer,  # thêm correct_answer
                created_by=m.created_by,
                created_at=m.created_at
            )
            for m in models
        ]

    def update_question(self, question_id: int, data: dict) -> Optional[Question]:
        model = self.repository.update(question_id, data)
        if model:
            return Question(
                question_id=model.question_id,
                content=model.content,
                subject=model.subject,
                difficulty_level=model.difficulty_level,
                correct_answer=model.correct_answer,  # thêm correct_answer
                created_by=model.created_by,
                created_at=model.created_at
            )
        return None

    def delete_question(self, question_id: int) -> bool:
        return self.repository.delete(question_id)
