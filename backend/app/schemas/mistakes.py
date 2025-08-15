from pydantic import BaseModel, Field
from typing import List, Optional

class MistakeBase(BaseModel):
    problem_name: str
    difficulty: Optional[int]
    tags: List[str]
    verdict: str
    passedtestcount: int = Field(..., alias="passedTestCount")
    message: str
    handle: str

class MistakeCreate(MistakeBase):
    pass

class MistakeResponse(MistakeBase):
    handle: str
    # If you still want an auto-generated ID (optional)
    # id: Optional[int] = None

    model_config = {
        "from_attributes": True,  # works like orm_mode
        "populate_by_name": True  # allows using alias when serializing
    }
