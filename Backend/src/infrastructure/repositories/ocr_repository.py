# infrastructure/repositories/ocr_repository.py
from sqlalchemy.orm import Session
from infrastructure.models.ocr_model import OCRResultModel
from domain.models.ocr_result import OCRResult
from dotenv import load_dotenv
from utils.env_loader import load_env
load_env()
load_dotenv()
class OCRRepository:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def save_result(self, ocr_result: OCRResult) -> OCRResultModel:
        model = OCRResultModel(
            exam_id=ocr_result.exam_id,
            student_name=ocr_result.student_name,
            score=ocr_result.score,
            processed_at=ocr_result.processed_at
        )
        self.db_session.add(model)
        self.db_session.commit() # Lưu thay đổi vào DB
        self.db_session.refresh(model)  # lấy giá trị auto-increment ocr_id

        # gán lại ocr_id cho domain object
        ocr_result.ocr_id = model.ocr_id
        return model
