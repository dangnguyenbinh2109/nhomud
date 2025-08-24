class ExamModel:
    def __init__(self):
        # giả lập DB bằng list
        self.exams = []
        self.counter = 1

    def create(self, data):
        exam = {
            "id": self.counter,
            "title": data.get("title"),
            "date": data.get("date"),
            "duration": data.get("duration")
        }
        self.exams.append(exam)
        self.counter += 1
        return exam

    def get_all(self):
        return self.exams

    def update(self, exam_id, data):
        for exam in self.exams:
            if exam["id"] == exam_id:
                exam.update(data)
                return exam
        return None