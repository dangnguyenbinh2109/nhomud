import requests
import os
from flask import current_app
import logging

class AIService:
    def __init__(self):
        # Lấy cấu hình từ biến môi trường hoặc config của Flask
        self.gemini_url = os.getenv("GEMINI_URL") or current_app.config.get("GEMINI_URL")
        self.gemini_key = os.getenv("GEMINI_KEY") or current_app.config.get("GEMINI_KEY")

    def generate_from_prompt(self, user_prompt: str) -> dict:
        if not self.gemini_url or not self.gemini_key:
            raise ValueError("GEMINI_URL hoặc GEMINI_KEY chưa được cấu hình.")

        headers = {
            "Content-Type": "application/json",
        }

        payload = {
            "contents": [{
                "parts": [{"text": user_prompt}]
            }]
        }

        try:
            response = requests.post(self.gemini_url, headers=headers, json=payload, params={"key": self.gemini_key})
            response.raise_for_status()  # Ném lỗi nếu request không thành công (status code 4xx hoặc 5xx)

            gemini_response = response.json()

            # Bóc tách nội dung text từ phản hồi của Gemini
            # Cấu trúc này dựa trên các service khác như ocr_service.py
            generated_text = gemini_response["candidates"][0]["content"]["parts"][0]["text"]

            # Đóng gói lại theo định dạng mà frontend mong muốn
            return {
                "status": "success",
                "content": generated_text
            }
        except (requests.exceptions.RequestException, KeyError, IndexError) as e:
            logging.error(f"Lỗi khi gọi hoặc xử lý phản hồi từ Gemini: {e}")
            raise Exception("Không thể tạo nội dung từ AI.")