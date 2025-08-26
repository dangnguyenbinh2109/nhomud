# services/ocr_service.py
import requests
import re
from domain.models.ocr_result import OCRResult
from infrastructure.repositories.ocr_repository import OCRRepository
from infrastructure.models.exam_question_model import ExamQuestionModel
from infrastructure.models.question_model import QuestionModel
from config import Config
class OCRService:
    GEMINI_URL = Config.GEMINI_URL
    GEMINI_KEY = Config.GEMINI_KEY

    def __init__(self, ocr_repo: OCRRepository, db_session):
        self.ocr_repo = ocr_repo
        self.db_session = db_session

    def grade_exam_from_image(self, exam_id: int, student_name: str, image_base64: str) -> OCRResult:
        # Lấy danh sách câu hỏi & đáp án đúng từ DB
        exam_questions = (
            self.db_session.query(ExamQuestionModel, QuestionModel)
            .join(QuestionModel, ExamQuestionModel.question_id == QuestionModel.question_id)
            .filter(ExamQuestionModel.exam_id == exam_id)
            .all()
        )

        correct_answers = {str(q.question_id): (q.correct_answer or "").upper() for eq, q in exam_questions}

        # Tạo payload gửi cho Gemini
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"Đọc đáp án trắc nghiệm từ ảnh (A/B/C/D). So sánh với đáp án đúng: {correct_answers}. Trả về số câu đúng, thang điểm 10, theo dạng score:a.b, correct:c/d"
                        },
                        {
                            "inline_data": {
                                "mime_type": "image/png",
                                "data": image_base64
                            }
                        }
                    ]
                }
            ]
        }

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.GEMINI_KEY
        }

        score = 0.0
        try:
            res = requests.post(self.GEMINI_URL, json=payload, headers=headers)
            res.raise_for_status()
            result_json = res.json()

            # Lấy text từ response
            text = result_json["candidates"][0]["content"]["parts"][0]["text"]

            # Dùng regex để chắc chắn parse score
            match = re.search(r"score[:\s]*([0-9]*\.?[0-9]+)", text)
            if match:
                score = float(match.group(1))

        except Exception:
            score = 0.0

        # Lưu kết quả vào DB
        ocr_result = OCRResult(
            ocr_id=None,
            exam_id=exam_id,
            student_name=student_name,
            score=score
        )
        self.ocr_repo.save_result(ocr_result)
        return ocr_result
    def read_text_from_image(self, image_base64: str) -> str:
        """
        Chỉ đọc text từ ảnh, không lưu DB, không grade.
        """
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": "Đọc tất cả nội dung text từ ảnh, trả về nguyên văn."
                        },
                        {
                            "inline_data": {
                                "mime_type": "image/png",
                                "data": image_base64
                            }
                        }
                    ]
                }
            ]
        }

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.GEMINI_KEY
        }

        try:
            res = requests.post(self.GEMINI_URL, json=payload, headers=headers)
            res.raise_for_status()
            result_json = res.json()
            text = result_json["candidates"][0]["content"]["parts"][0]["text"]
            return text
        except Exception as e:
            print("Error reading image:", e)
            return ""