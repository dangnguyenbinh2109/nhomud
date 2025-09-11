from typing import Optional
from datetime import datetime

class PromptTemplate:
    """
    Domain model cho mẫu prompt.
    """
    def __init__(
        self,
        prompt_id: Optional[int],
        name: str,
        content: str,
        created_by: int,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        approval_status: Optional[str] = None
    ):
        self.prompt_id = prompt_id
        self.name = name
        self.content = content
        self.created_by = created_by
        self.created_at = created_at
        self.updated_at = updated_at
        self.approval_status = approval_status