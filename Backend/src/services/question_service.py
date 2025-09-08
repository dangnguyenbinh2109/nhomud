from typing import List, Optional
from domain.models.question import Question
from infrastructure.repositories.question_repository import QuestionRepository
from services.approval_service import ApprovalService
from datetime import datetime


class QuestionService:
    def __init__(self, repository: QuestionRepository, approval_service: ApprovalService):
        self.repository = repository
        self.approval_service = approval_service

    def create_question(
        self,
        content: str,
        subject: Optional[str],
        difficulty_level: Optional[str],
        correct_answer: Optional[str],
        created_by: Optional[int]
    ) -> Question:
        new_question = Question(
            question_id=None,
            content=content,
            subject=subject,
            difficulty_level=difficulty_level,
            correct_answer=correct_answer,
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        created_model = self.repository.create(new_question)

        # Gửi yêu cầu kiểm duyệt
        self.approval_service.request_approval(
            module="question",
            object_id=created_model.question_id,
            created_by=created_by,
            title=f"Câu hỏi: {created_model.content[:50]}",  # lấy 50 ký tự đầu làm tiêu đề
            content=created_model.content
        )

        return Question(
            question_id=created_model.question_id,
            content=created_model.content,
            subject=created_model.subject,
            difficulty_level=created_model.difficulty_level,
            correct_answer=created_model.correct_answer,
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
                correct_answer=m.correct_answer,
                created_by=m.created_by,
                created_at=m.created_at
            )
            for m in models
            if self.approval_service.is_approved("question", m.question_id)
        ]

    def update_question(self, question_id: int, data: dict) -> Optional[Question]:
        # Chỉ cho phép sửa nếu đã được duyệt
        if not self.approval_service.is_approved("question", question_id):
            return None

        model = self.repository.update(question_id, data)
        if model:
            return Question(
                question_id=model.question_id,
                content=model.content,
                subject=model.subject,
                difficulty_level=model.difficulty_level,
                correct_answer=model.correct_answer,
                created_by=model.created_by,
                created_at=model.created_at
            )
        return None

    def delete_question(self, question_id: int) -> bool:
        # Chỉ cho phép xóa nếu đã duyệt
        if not self.approval_service.is_approved("question", question_id):
            return False
        return self.repository.delete(question_id)
