from sqlalchemy.orm import Session
from app.models.mistake import Mistake
from app.schemas.mistakes import MistakeCreate

def create_mistake(db: Session, mistake: MistakeCreate):
    db_obj = Mistake(**mistake.dict())  # convert Pydantic -> dict -> model
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
