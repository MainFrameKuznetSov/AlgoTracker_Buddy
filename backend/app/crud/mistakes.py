from sqlalchemy.orm import Session
from app.models.mistake import Mistake
from app.schemas.mistakes import MistakeCreate

def create_mistake(db: Session, mistake: MistakeCreate):
    db_mistake = Mistake(**mistake.dict())
    db.add(db_mistake)
    db.commit()
    db.refresh(db_mistake)
    return db_mistake

def get_mistakes_by_handle(db: Session, handle: str):
    return db.query(Mistake).filter(Mistake.handle == handle).all()