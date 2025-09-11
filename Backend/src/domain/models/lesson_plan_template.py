from typing import Optional, Dict, Any
from datetime import datetime

class LessonPlanTemplate:
    """
    Domain model cho mẫu kế hoạch bài học (khung chương trình).
    """
    def __init__(
        self,
        template_id: Optional[int],
        name: str,
        description: Optional[str],
        structure: Dict[str, Any],  # JSON field để lưu cấu trúc (mục tiêu, hoạt động, v.v.)
        created_by: int,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None
    ):
        self.template_id = template_id
        self.name = name
        self.description = description
        self.structure = structure
        self.created_by = created_by
        self.created_at = created_at
        self.updated_at = updated_at