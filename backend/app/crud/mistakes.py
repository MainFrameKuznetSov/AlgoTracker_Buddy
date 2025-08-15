from sqlalchemy.orm import Session
from app.models.mistakes import Mistake
from app.schemas.mistakes import MistakeCreate

def create_mistake(db: Session, mistake: MistakeCreate):
    db_mistake = Mistake(**mistake.dict())
    db.add(db_mistake)
    db.commit()
    db.refresh(db_mistake)
    return db_mistake
