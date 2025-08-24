from api.models.exam_model import ExamModel

class ExamService:
    def __init__(self):
        self.exam_model = ExamModel()

    def create_exam(self, data):
        return self.exam_model.create(data)

    def get_exams(self):
        return self.exam_model.get_all()

    def update_exam(self, exam_id, data):
        return self.exam_model.update(exam_id, data)