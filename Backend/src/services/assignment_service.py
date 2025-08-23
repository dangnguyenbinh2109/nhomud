from api.models.assignment_model import AssignmentModel

class AssignmentService:
    def __init__(self):
        self.assignment_model = AssignmentModel()

    def create_assignment(self, data):
        assignment = self.assignment_model.create(data)
        return {
            "status": "success",
            "message": "Assignment created",
            "data": {
                "assignment_id": assignment["id"],
                "title": assignment["title"],
                "lesson_id": assignment.get("lesson_id")
            }
        }

    def get_assignments(self):
        return {
            "status": "success",
            "data": self.assignment_model.get_all()
        }
