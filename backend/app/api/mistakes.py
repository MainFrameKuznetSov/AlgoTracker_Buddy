from typing import Optional
from enum import Enum
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.services.codeforces import fetch_last_submissions
from app.schemas.mistakes import MistakeBase, MistakeCreate, MistakeResponse
from app.models.mistake import Mistake # your SQLAlchemy model
from app.database import get_db
from .. import crud
from ..crud import mistakes as crud
from .. import schemas

router = APIRouter()

@router.get("/mistakes/live/{handle}")
def get_mistakes(handle: str):
    
    try:
        data = fetch_last_submissions(handle, count=500)
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
                    "message": "Blank",
                    "handle":handle
                })

        return mistakes

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mistakes")
def post_mistake(mistake: MistakeCreate, db: Session = Depends(get_db)):
    try:
        # Check if the mistake already exists (based on unique fields)
        existing = (
            db.query(Mistake)
            .filter(
                Mistake.handle == mistake.handle,
                Mistake.problem_name == mistake.problem_name,
                Mistake.verdict == mistake.verdict,
            )
            .first()
        )

        if existing:
            # Update only the message if it exists
            existing.message = mistake.message
            db.commit()
            db.refresh(existing)
            return {"message" : "Success"}
        else:
            # Insert a new mistake if it doesn't exist
            db_mistake = Mistake(
                problem_name=mistake.problem_name,
                difficulty=mistake.difficulty or 0,
                tags=mistake.tags,
                verdict=mistake.verdict,
                passedtestcount=mistake.passedtestcount,
                message=mistake.message,
                handle=mistake.handle,
            )
            db.add(db_mistake)
            db.commit()
            db.refresh(db_mistake)
            return {"message" : "Success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/mistakes/{handle}", response_model=list[MistakeBase])
def get_mistakes_by_handle(handle: str, db: Session = Depends(get_db)):
    mistakes = crud.get_mistakes_by_handle(db, handle)
    return mistakes

# ✅ Fetch mistakes by problem name
@router.get("/mistakes/problem/{problem_name}", response_model=list[MistakeBase])
def get_mistakes_by_problem_name(problem_name: str, db: Session = Depends(get_db)):
    mistakes = db.query(Mistake).filter(Mistake.problem_name == problem_name).all()
    return mistakes

# ✅ Fetch mistakes by problem name
@router.get("/mistakes/problem/{problem_name}", response_model=list[MistakeBase])
def get_mistakes_by_problem_name(problem_name: str, db: Session = Depends(get_db)):
    mistakes = db.query(Mistake).filter(Mistake.problem_name == problem_name).all()
    return mistakes

# ✅ Enum for verdict options
class VerdictEnum(str, Enum):
    WRONG_ANSWER = "WRONG_ANSWER"
    TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED"
    IDLENESS_LIMIT_EXCEEDED = "IDLENESS_LIMIT_EXCEEDED"
    COMPILATION_ERROR = "COMPILATION_ERROR"
    RUNTIME_ERROR= "RUNTIME_ERROR"
    MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED"
    CHALLENGED = "CHALLENGED"
    SKIPPED = "SKIPPED"


@router.get("/mistakes/verdict/{verdict}", response_model=list[MistakeBase])
def get_mistakes_by_verdict(verdict: VerdictEnum, db: Session = Depends(get_db)):
    mistakes = db.query(Mistake).filter(Mistake.verdict == verdict.value).all()
    return mistakes

# ✅ Filter by verdict + handle
@router.get("/mistakes/{handle}/verdict/{verdict}", response_model=list[MistakeBase])
def get_mistakes_by_handle_and_verdict(
    handle: str,
    verdict: VerdictEnum,
    db: Session = Depends(get_db)
):
    mistakes = (
        db.query(Mistake)
        .filter(Mistake.handle == handle, Mistake.verdict == verdict.value)
        .all()
    )
    return mistakes

# ✅ Filter by problem_name + handle
@router.get("/mistakes/{handle}/problem/{problem_name}", response_model=list[MistakeBase])
def get_mistakes_by_handle_and_problem(
    handle: str,
    problem_name: str,
    db: Session = Depends(get_db)
):
    mistakes = (
        db.query(Mistake)
        .filter(
            Mistake.handle.ilike(handle), 
            Mistake.problem_name.ilike(f"%{problem_name}%")
        )
        .all()
    )
    return mistakes

@router.get("/mistakes/live/{handle}/rating")
def get_mistakes_in_range(handle: str, A: int, B: int):
    """
    Fetch mistakes for a given handle from Codeforces API
    but only return those within difficulty range [A, B].
    """
    try:
        data = fetch_last_submissions(handle, count=500)
        submissions = data["result"]

        mistakes = []
        for sub in submissions:
            if sub.get("verdict") != "OK":  # Only mistakes
                problem = sub.get("problem", {})
                difficulty = problem.get("rating")

                # Only consider if difficulty is defined and within range
                if difficulty is not None and A <= difficulty <= B:
                    mistakes.append({
                        "problem_name": problem.get("name"),
                        "difficulty": difficulty,
                        "tags": problem.get("tags", []),
                        "verdict": sub.get("verdict"),
                        "passedTestCount": sub.get("passedTestCount"),
                        "message": "Blank",
                        "handle": handle
                    })

        return mistakes

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
