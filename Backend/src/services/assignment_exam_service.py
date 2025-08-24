from domain.models.assignment import Assignment
from domain.models.exam import Exam
from infrastructure.repositories.assignment_repository import AssignmentRepository
from infrastructure.repositories.exam_repository import ExamRepository
from typing import List
from datetime import datetime

class AssignmentExamService:
    def __init__(self, assignment_repo: AssignmentRepository, exam_repo: ExamRepository):
        self.assignment_repo = assignment_repo
        self.exam_repo = exam_repo

    # ✅ Assignments
    def create_assignment(self, title: str, description: str, lesson_id: int, created_by: int) -> Assignment:
        new_assignment = Assignment(
            assignment_id=None,
            title=title,
            description=description,
            lesson_id=lesson_id,
            created_by=created_by,
            created_at=datetime.utcnow()
        )
        # Gọi repository và đồng bộ ID trả về
        created_id = self.assignment_repo.create(new_assignment)
        new_assignment.assignment_id = created_id
        return new_assignment

    def get_all_assignments(self) -> List[Assignment]:
        return self.assignment_repo.get_all()

    # ✅ Exams
    def create_exam(self, title: str, subject: str, questions: List[int], created_by: int) -> Exam:
        new_exam = Exam(
            exam_id=None,
            title=title,
            subject=subject,
            created_by=created_by,
            questions=questions,
            created_at=datetime.utcnow()
        )
        created_id = self.exam_repo.create(new_exam)
        new_exam.exam_id = created_id
        return new_exam

    def get_all_exams(self) -> List[Exam]:
        return self.exam_repo.get_all()
