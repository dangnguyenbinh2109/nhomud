class AssignmentModel:
    def __init__(self):
        self.assignments = []
        self.counter = 200  # bắt đầu id = 200 cho giống yêu cầu

    def create(self, data):
        assignment = {
            "id": self.counter,
            "title": data.get("title"),
            "description": data.get("description"),
            "lesson_id": data.get("lesson_id")
        }
        self.assignments.append(assignment)
        self.counter += 1
        return assignment

    def get_all(self):
        return self.assignments