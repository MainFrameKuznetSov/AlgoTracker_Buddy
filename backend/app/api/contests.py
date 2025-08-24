from enum import Enum
from fastapi import APIRouter, HTTPException
from app.services.codeforces import fetch_last_submissions

app= APIRouter()

@app.get("/contests/{handle}")
def getContestSubmissions(handle: str,contestNumber: int):
    """
        Fetch contest wise submissions from handle 
    """
    try:
        data=fetch_last_submissions(handle,count=100)
        factors=data["result"]

        contestData=[]
        for fact in factors:
            if fact.get("contestId")==contestNumber:
                problem=fact.get("problem")
                contestData.append({
                    "problem_name": problem.get("name"),
                    "difficulty": problem.get("rating"),
                    "tags": problem.get("tags", []),
                    "verdict": fact.get("verdict"),
                    "passedTestCount": fact.get("passedTestCount"),
                    "message": "Blank",
                    "handle":handle
                })

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch data")
    """
    JSON Response Type
    [
        {
            "problem_name": "Build an Array",
            "difficulty": 2200,
            "tags": [
                "brute force",
                "constructive algorithms",
                "dp",
                "greedy",
                "math",
                "number theory"
                ],
            "verdict": "COMPILATION_ERROR",
            "passedTestCount": 0,
            "message": "Blank",
            "handle": "RealSpineFreezer_1410"
        }
    ]
    """
    # return contestData
    return {"message":"success"}

