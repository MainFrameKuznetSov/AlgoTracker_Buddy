from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.codeforces import fetch_last_submissions
from app.schemas.mistakes import MistakeCreate, MistakeResponse
from app.models.mistake import Mistake # your SQLAlchemy model
from app.database import get_db

router = APIRouter()

@router.get("/mistakes/{handle}")
def get_mistakes(handle: str):
    
    try:
        data = fetch_last_submissions(handle, count=100)
        submissions = data["result"]

        mistakes = []
        for sub in submissions:
            if sub.get("verdict") != "OK":  # Filter non-AC
                problem = sub.get("problem", {})
                mistakes.append({
                    "problem_name": problem.get("name"),
                    "difficulty": problem.get("rating"),
                    "tags": problem.get("tags", []),
                    "verdict": sub.get("verdict"),
                    "passedTestCount": sub.get("passedTestCount"),
                    "message": "Blank"
                })

        return mistakes

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mistakes", response_model=MistakeResponse)
def post_mistake(mistake: MistakeCreate, db: Session = Depends(get_db)):

    try:
        db_mistake = Mistake(
            problem_name=mistake.problem_name,
            difficulty=mistake.difficulty or 0,
            tags=mistake.tags,           # Python list, SQLAlchemy JSON handles it
            verdict=mistake.verdict,
            passedtestcount=mistake.passedtestcount,
            message=mistake.message,
            handle=mistake.handle        # taken from user input
        )
        db.add(db_mistake)
        db.commit()
        db.refresh(db_mistake)
        return db_mistake
    
    except Exception as e:
        raise HTTPException(status_code=500,details=str(e))
    