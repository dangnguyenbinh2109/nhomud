from datetime import datetime
from typing import Optional

class OCRResult:
    def __init__(
        self,
        exam_id: int,
        student_name: str,
        score: float,
        ocr_id: Optional[int] = None,  # để mặc định là None
        processed_at: Optional[datetime] = None
    ):
        self.ocr_id = ocr_id
        self.exam_id = exam_id
        self.student_name = student_name
        self.score = score
        self.processed_at = processed_at or datetime.utcnow()

    def to_dict(self):
        return {
            "ocr_id": self.ocr_id,
            "exam_id": self.exam_id,
            "student_name": self.student_name,
            "score": self.score,
            "processed_at": self.processed_at.isoformat()
        }
