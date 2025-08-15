from fastapi import APIRouter, HTTPException
from app.services.codeforces import fetch_last_submissions

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
