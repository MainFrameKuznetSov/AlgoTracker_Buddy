from pydantic import BaseModel

class MistakeCreate(BaseModel):
    problem_name: str
    contest_id: int | None
    note: str

class MistakeOut(MistakeCreate):
    id: int
    class Config:
        orm_mode = True
