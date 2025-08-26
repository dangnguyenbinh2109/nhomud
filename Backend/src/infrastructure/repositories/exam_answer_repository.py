from sqlalchemy.orm import Session
from infrastructure.models.exam_answer_model import ExamAnswerModel
from dotenv import load_dotenv
from utils.env_loader import load_env
load_env()
load_dotenv()
class ExamAnswerRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, exam_id: int, question_id: int, correct_answer: str) -> ExamAnswerModel:
        record = ExamAnswerModel(
            exam_id=exam_id,
            question_id=question_id,
            correct_answer=correct_answer
        )
        self.db_session.add(record)
        self.db_session.commit()
        return record

    def get_by_exam(self, exam_id: int):
        return self.db_session.query(ExamAnswerModel).filter_by(exam_id=exam_id).all()
