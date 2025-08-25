from typing import Optional, List
from sqlalchemy.orm import Session
from infrastructure.models.question_model import QuestionModel
from domain.models.question import Question

class QuestionRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, question: Question) -> QuestionModel:
        new_question_model = QuestionModel(
            content=question.content,
            subject=question.subject,
            difficulty_level=question.difficulty_level,
            created_by=question.created_by,
            created_at=question.created_at
        )
        self.db_session.add(new_question_model)
        self.db_session.commit()
        return new_question_model

    def get_all(self) -> List[QuestionModel]:
        return self.db_session.query(QuestionModel).all()

    def get_by_id(self, question_id: int) -> Optional[QuestionModel]:
        return self.db_session.query(QuestionModel).filter_by(question_id=question_id).first()

    def update(self, question_id: int, data: dict) -> Optional[QuestionModel]:
        question = self.get_by_id(question_id)
        if not question:
            return None
        for key, value in data.items():
            setattr(question, key, value)
        self.db_session.commit()
        return question

    def delete(self, question_id: int) -> bool:
        question = self.get_by_id(question_id)
        if question:
            self.db_session.delete(question)
            self.db_session.commit()
            return True
        return False
