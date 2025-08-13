import requests
import pandas as pd

BASE_URL = "https://codeforces.com/api"

def fetch_last_submissions(handle: str, count: int = 100):
    url = f"{BASE_URL}/user.status?handle={handle}&from=1&count={count}"
    r = requests.get(url)
    data = r.json()

    if data["status"] != "OK":
        raise ValueError("Invalid Codeforces handle or API error")

    submissions = data["result"]

    # Process with Pandas
    df = pd.DataFrame([
        {
            "contestId": sub.get("contestId"),
            "problemName": sub["problem"]["name"],
            "difficulty": sub["problem"].get("rating", None),
            "tags": sub["problem"]["tags"],
            "verdict": sub["verdict"],
            "time": sub["creationTimeSeconds"]
        }
        for sub in submissions
    ])

    return {
        "difficulty_counts": df["difficulty"].value_counts().to_dict(),
        "tag_counts": pd.Series([tag for tags in df["tags"] for tag in tags]).value_counts().to_dict(),
        "verdict_counts": df["verdict"].value_counts().to_dict(),
        "submissions": df.to_dict(orient="records")
    }
