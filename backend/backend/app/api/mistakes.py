from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.mistake import Mistake
from app.schemas.mistakes import MistakeCreate, MistakeOut

router = APIRouter()

@router.post("/", response_model=MistakeOut)
def add_mistake(mistake: MistakeCreate, db: Session = Depends(get_db)):
    db_mistake = Mistake(**mistake.dict())
    db.add(db_mistake)
    db.commit()
    db.refresh(db_mistake)
    return db_mistake

@router.get("/", response_model=list[MistakeOut])
def get_mistakes(db: Session = Depends(get_db)):
    return db.query(Mistake).all()
