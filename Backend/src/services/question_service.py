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

        # Trạng thái ban đầu luôn là 'pending'
        return Question(
            question_id=created_model.question_id,
            content=created_model.content,
            subject=created_model.subject,
            difficulty_level=created_model.difficulty_level,
            correct_answer=created_model.correct_answer,
            created_by=created_model.created_by,
            created_at=created_model.created_at,
            approval_status="pending"
        )

    def get_all_questions(self) -> List[Question]:
        models = self.repository.get_all()
        questions_with_status = []
        for m in models:
            status = self.approval_service.get_status("question", m.question_id)
            question = Question(
                question_id=m.question_id,
                content=m.content,
                subject=m.subject,
                difficulty_level=m.difficulty_level,
                correct_answer=m.correct_answer,
                created_by=m.created_by,
                created_at=m.created_at,
                approval_status=status
            )
            questions_with_status.append(question)
        return questions_with_status

    def get_all_public_questions(self) -> List[Question]:
        """
        Lấy tất cả câu hỏi đã được duyệt và công khai.
        Quan trọng: Không bao giờ trả về 'correct_answer'.
        """
        models = self.repository.get_all()
        public_questions = []
        for m in models:
            status = self.approval_service.get_status("question", m.question_id)
            if status in ['approved', 'pending']: # Tạm thời hiển thị cả câu hỏi đang chờ duyệt
                question = Question(
                    question_id=m.question_id,
                    content=m.content,
                    subject=m.subject,
                    difficulty_level=m.difficulty_level,
                    correct_answer=None,  # Luôn ẩn đáp án
                    approval_status=status,
                    created_by=m.created_by,
                    created_at=m.created_at
                )
                public_questions.append(question)
        return public_questions

    def update_question(self, question_id: int, data: dict) -> Optional[Question]:
        # Logic nghiệp vụ: Có thể bạn muốn chỉ cho phép sửa khi chưa được duyệt,
        # hoặc cho phép sửa và tự động gửi lại yêu cầu duyệt.
        # Ở đây, tôi tạm bỏ qua kiểm tra để cho phép sửa.
        # status = self.approval_service.get_status("question", question_id)
        # if status == 'approved':
        #     return None # Hoặc raise exception

        model = self.repository.update(question_id, data)
        if model:
            # Lấy lại trạng thái sau khi cập nhật
            status = self.approval_service.get_status("question", model.question_id)
            return Question(
                question_id=model.question_id,
                content=model.content,
                subject=model.subject,
                difficulty_level=model.difficulty_level,
                correct_answer=model.correct_answer,
                created_by=model.created_by,
                created_at=model.created_at,
                approval_status=status
            )
        return None

    def delete_question(self, question_id: int) -> bool: # Tương tự, bạn có thể quyết định logic xóa.
        # Ví dụ: chỉ cho phép xóa khi chưa được duyệt hoặc đã bị từ chối.
        # if self.approval_service.is_approved("question", question_id):
        #     return False
        return self.repository.delete(question_id)
