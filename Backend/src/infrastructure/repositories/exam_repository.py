from sqlalchemy.orm import Session
from typing import List, Optional
from src.infrastructure.models.exam_model import ExamModel
from src.infrastructure.models.exam_question_model import ExamQuestionModel
from src.domain.models.exam import Exam
from dotenv import load_dotenv
from src.utils.env_loader import load_env
load_env()
load_dotenv()
class ExamRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, exam: Exam) -> ExamModel:
        new_exam = ExamModel(
            title=exam.title,
            subject=exam.subject,
            created_by=exam.created_by,
            created_at=exam.created_at
        )
        self.db_session.add(new_exam)
        self.db_session.flush()

        # Add questions to junction table
        for q_id in exam.questions:
            eq = ExamQuestionModel(exam_id=new_exam.exam_id, question_id=q_id)
            self.db_session.add(eq)

        self.db_session.commit()
        return new_exam

    def get_all(self) -> List[ExamModel]:
        return self.db_session.query(ExamModel).all()

    def get_by_id(self, exam_id: int) -> Optional[ExamModel]:
        return self.db_session.query(ExamModel).filter_by(exam_id=exam_id).first()
