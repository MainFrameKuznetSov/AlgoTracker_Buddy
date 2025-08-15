from pydantic import BaseModel
from typing import List, Optional

# ---- Mistake Schemas ----
class MistakeCreate(BaseModel):
    problem_name: str
    problem_rating: Optional[float] = None
    tags: Optional[List[str]] = []
    verdict: Optional[str] = None

class MistakeOut(MistakeCreate):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2 equivalent of orm_mode


# ---- MistakeNote Schemas ----
class MistakeNoteCreate(BaseModel):
    mistake_id: int
    note: str
    submission_id: Optional[int] = None

class MistakeNoteOut(MistakeNoteCreate):
    id: int

    class Config:
        from_attributes = True
