import math
import requests
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

def clean_floats(obj):
    if isinstance(obj, float):
        return obj if math.isfinite(obj) else None
    elif isinstance(obj, dict):
        return {k: clean_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_floats(v) for v in obj]
    return obj

@router.get("/{handle}")
def get_submissions(handle: str):
    url = f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=500"
    resp = requests.get(url)
    data = resp.json()

    # Clean NaN/Infinity before sending to frontend
    cleaned_data = clean_floats(data)
    return JSONResponse(content=cleaned_data)
