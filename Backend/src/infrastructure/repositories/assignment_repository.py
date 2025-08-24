from sqlalchemy.orm import Session
from typing import List, Optional
from infrastructure.models.assignment_model import AssignmentModel
from domain.models.assignment import Assignment


class AssignmentRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, assignment: Assignment) -> int:
        """
        Tạo mới assignment trong DB từ domain model và trả về ID vừa tạo.
        """
        new_assignment = AssignmentModel(
            title=assignment.title,
            description=assignment.description,
            lesson_id=assignment.lesson_id,
            created_by=assignment.created_by,
            created_at=assignment.created_at
        )
        self.db_session.add(new_assignment)
        self.db_session.commit()
        return new_assignment.assignment_id  # ✅ Trả về ID

    def get_all(self) -> List[AssignmentModel]:
        """
        Lấy tất cả assignments từ DB.
        """
        return self.db_session.query(AssignmentModel).all()

    def get_by_id(self, assignment_id: int) -> Optional[AssignmentModel]:
        """
        Lấy assignment theo ID.
        """
        return self.db_session.query(AssignmentModel).filter_by(assignment_id=assignment_id).first()
