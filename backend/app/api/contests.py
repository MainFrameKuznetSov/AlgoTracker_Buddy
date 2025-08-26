from enum import Enum
from fastapi import APIRouter, HTTPException
from app.services.codeforces import fetch_last_submissions
import requests, re

app = APIRouter()

def getContestId(contest_number : int):
    url = "https://codeforces.com/api/contest.list?gym=false"
    response = requests.get(url)
    data = response.json()

    if data["status"] != "OK":
        raise Exception("Error fetching contests")

    for contest in data["result"]:
        name = contest["name"]

        # Match "Codeforces Round #739"
        match = re.search(r'#(\d+)', name)
        if match and int(match.group(1)) == contest_number:
            return contest["id"]

        # Match "Educational Codeforces Round 165"
        edu_match = re.search(r'Round\s+(\d+)', name)
        if edu_match and int(edu_match.group(1)) == contest_number:
            return contest["id"]

    return None

@app.get("/{handle}")
def getContestSubmissions(handle: str,contestNumber: int):
    """
        Fetch contest wise submissions from handle 
    """
    try:
        contestId = getContestId(contestNumber)
        if contestId is None:
            raise HTTPException(status_code=404, detail=f"Contest #{contestNumber} not found")
        
        data=fetch_last_submissions(handle,count=500)
        factors=data["result"]

        contestData=[]
        for fact in factors:
            if fact.get("contestId")==contestId:
                problem = fact.get("problem")
                contestData.append({
                    "problem_name":problem.get("name"),
                    "difficulty":problem.get("rating"),
                    "tags":problem.get("tags", []),
                    "verdict":fact.get("verdict"),
                    "passedTestCount":fact.get("passedTestCount"),
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
    return contestData
    # return {"message":"success"}

# More operations to be added