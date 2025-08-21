import requests

def fetch_last_submissions(handle: str, count: int = 500):
    url = f"https://codeforces.com/api/user.status?handle={handle}&count={count}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
