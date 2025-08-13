from fastapi import APIRouter
from fastapi.responses import JSONResponse
import requests
from utility.cleaner import clean_floats

router = APIRouter()

@router.get("/submissions/{handle}")
def get_submissions(handle: str):
    url = f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=100"
    resp = requests.get(url)
    data = resp.json()
    cleaned_data = clean_floats(data)
    return JSONResponse(content=cleaned_data)
