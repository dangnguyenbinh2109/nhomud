from infrastructure.repositories.exam_answer_repository import ExamAnswerRepository

class ExamAnswerService:
    def __init__(self, repository: ExamAnswerRepository):
        self.repository = repository

    def add_answer(self, exam_id: int, question_id: int, correct_answer: str):
        return self.repository.create(exam_id, question_id, correct_answer)
