# 🎯 AlgoTracker Buddy

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-green)
![PostgreSQL](https://img.shields.io/badge/NeonDB%2FPostgreSQL-13.0-blue)

**AlgoTracker Buddy** is your personal Codeforces submission tracker. It identifies mistakes (non-AC submissions), stores them in a database, and provides APIs to analyze and improve your competitive programming performance.

---

## 🚀 Features

- Fetch **Codeforces submissions** automatically.
- Filter and store **mistakes** for review.
- **CRUD operations** on mistakes via REST APIs.
- Search and filter by **problem name, tags, difficulty, or verdict**.
- Ready for **analytics and dashboard integration**.

---

## 🛠 Tech Stack

- **Backend:** FastAPI  
- **Language:** Python 3.11+  
- **Database:** NeonDB / PostgreSQL  
- **ORM:** SQLAlchemy  
- **Validation:** Pydantic  
- **Other Tools:** Uvicorn, HTTPX, Alembic (optional for migrations)

---

## 🗄 Database Schema

**Table: `mistakes`**

| Column           | Type    | Description                                 |
|-----------------|---------|---------------------------------------------|
| `id`            | INT     | Primary key, auto-increment                 |
| `handle`        | STRING  | Codeforces handle                           |
| `problem_name`  | STRING  | Problem name                                |
| `difficulty`    | STRING  | Difficulty rating                           |
| `tags`          | STRING  | Problem tags                                |
| `verdict`       | STRING  | Submission verdict (WA/TLE/RTE/CE/ILE)      |
| `passedTestCount` | INT   | Number of passed test cases                 |
| `message`       | TEXT    | Optional message or error details           |

---

## ⚡ Installation

```bash
# Clone the repo
git clone https://github.com/<your-username>/AlgoTracker_Buddy.git
cd AlgoTracker_Buddy/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure database in .env
# DATABASE_URL=postgresql://username:password@host:port/dbname
```

## 📡 API Endpoints

### **GET /submissions/{handle}**
Fetch last 100 submissions of the handle

**Request**
```http
GET /submissions/your_handle
```

**Response**
```json
{
  "status": "OK",
  "result": [
    {
      "id": 298237134,
      "contestId": 2043,
      "creationTimeSeconds": 1735053339,
      "relativeTimeSeconds": 2439,
      "problem": {
        "contestId": 2043,
        "index": "B",
        "name": "Digits",
        "type": "PROGRAMMING",
        "rating": 1100,
        "tags": [
          "math",
          "number theory"
        ]
      },
      "author": {
        "contestId": 2043,
        "participantId": 199838775,
        "members": [
          {
            "handle": "RealSpineFreezer_1410"
          }
        ],
        "participantType": "CONTESTANT",
        "ghost": false,
        "startTimeSeconds": 1735050900
      },
      "programmingLanguage": "C++17 (GCC 7-32)",
      "verdict": "WRONG_ANSWER",
      "testset": "TESTS",
      "passedTestCount": 1,
      "timeConsumedMillis": 30,
      "memoryConsumedBytes": 0
    }
  ]
}
```

### **GET /mistakes/live/{handle}**
Fetch all mistakes for a handle.

**Request**
```http
GET /mistakes/live/your_handle
```

**Response**
```json
[
  {
    "id": 1,
    "handle": "your_handle",
    "problem_name": "Watermelon",
    "difficulty": "800",
    "tags": "implementation, math",
    "verdict": "WA",
    "passedTestCount": 3,
    "message": ""
  }
]
```

### **POST /mistakes**
Add a new mistake.

**Request**
```http
POST /mistakes
```

**Content-Type: application/json**
```json
{
    "handle": "your_handle",
    "problem_name": "Watermelon",
    "difficulty": "800",
    "tags": "implementation, math",
    "verdict": "WA",
    "passedTestCount": 3,
    "message": "Did not consider the case n=2"
}
```

**Response**
```json
{
    "id": 1,
    "handle": "your_handle",
    "problem_name": "Watermelon",
    "difficulty": "800",
    "tags": "implementation, math",
    "verdict": "WA",
    "passedTestCount": 3,
    "message": "Did not consider the case n=2"
}
```

### GET mistake/{handle}
Get all the stored mistakes(message added) i.e. posted via POST/mistakes

**Request**
```http
GET /mistakes
```

**Response**
```json
{
    "problem_name": "string",
    "difficulty": 1000,
    "tags": [
      "string"
    ],
    "verdict": "string",
    "passedtestcount": 0,
    "message": "string",
    "handle": "string"
}
```

### **GET /mistakes/problem/{problem_name}**
Fetch all mistakes for a specific problem name.

**Request**
```http
GET /mistakes/problem/Watermelon
```

**Response**
```json
[
  {
    "id": 2,
    "handle": "your_handle",
    "problem_name": "Watermelon",
    "difficulty": "800",
    "tags": "math, implementation",
    "verdict": "WA",
    "passedTestCount": 4,
    "message": "Wrong answer on testcase n=2"
  },
  {
    "id": 7,
    "handle": "another_user",
    "problem_name": "Watermelon",
    "difficulty": "800",
    "tags": "math, implementation",
    "verdict": "TLE",
    "passedTestCount": 2,
    "message": "Problematic Infinite Loop"
  }
]
```

## GET /mistakes/verdict/{verdict}

Fetch all mistakes filtered by a specific verdict.

### Supported verdicts qualifying as mistake:

- WRONG_ANSWER
- TIME_LIMIT_EXCEEDED
- IDLENESS_LIMIT_EXCEEDED
- COMPILATION_ERROR
- MEMORY_LIMIT_EXCEEDED

**Request**
```http
GET /mistakes/verdict/WRONG_ANSWER
```

**Response**
```json
[
  {
    "id": 10,
    "handle": "your_handle",
    "problem_name": "Array Division",
    "difficulty": "1400",
    "tags": "greedy",
    "verdict": "WRONG_ANSWER",
    "passedTestCount": 2,
    "message": "Wrong condition for testcase 4"
  }
]
```

## GET /mistakes/{handle}/verdict/{verdict}

Fetch all mistakes of a particular handle based on a particular verdict type

**Request**
```http
GET /mistakes/your_handle/verdict/WRONG_ANSWER
```

**Response**
```json
[
  {
    "id": 10,
    "handle": "your_handle",
    "problem_name": "Array Division",
    "difficulty": "1400",
    "tags": "greedy",
    "verdict": "WRONG_ANSWER",
    "passedTestCount": 2,
    "message": "Wrong condition for testcase 4"
  }
]
```

## GET /mistakes/{handle}/problem/{problem_name}

Get mistakes of a particular problem from the submissions of a given handle

**Request**
```http
GET /mistakes/your_handle/problem/problem_name
```

**Response**
```json
[
  {
    "id": 10,
    "handle": "your_handle",
    "problem_name": "Array Division",
    "difficulty": "1400",
    "tags": "greedy",
    "verdict": "WRONG_ANSWER",
    "passedTestCount": 2,
    "message": "Wrong condition for testcase 4"
  }
]
```

## GET /mistakes/{handle}/problem/{problem_name}

Get mistakes of a particular problem from the submissions of a given handle

**Request**
```http
GET /mistakes/your_handle/problem/problem_name
```

**Response**
```json
[
  {
    "id": 10,
    "handle": "your_handle",
    "problem_name": "Array Division",
    "difficulty": "1400",
    "tags": "greedy",
    "verdict": "WRONG_ANSWER",
    "passedTestCount": 2,
    "message": "Wrong condition for testcase 4"
  }
]
```

## GET /mistakes/live/{handle}/rating

Get mistakes for a particular handle within a difficulty rating range [A, B]. 

**Request**
```http
GET /mistakes/live/{handle}/rating
```

**Response**
```json
[
  {
    "problem_name": "Two Sum",
    "difficulty": 800,
    "tags": ["implementation", "math"],
    "verdict": "WRONG_ANSWER",
    "passedTestCount": 3,
    "message": "Blank",
    "handle": "RealSpineFreezer_1410"
  },
  {
    "problem_name": "Graph Paths",
    "difficulty": 1400,
    "tags": ["graphs", "dp"],
    "verdict": "TIME_LIMIT_EXCEEDED",
    "passedTestCount": 7,
    "message": "Blank",
    "handle": "RealSpineFreezer_1410"
  }
]
```

## 🏃 Running Locally
```
uvicorn main:app --reload
```

### API Testing Links

```
Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc
```

## 🌟 Upcoming Improvements

- Analytics dashboard for mistake trends
- Frontend interface for visual tracking
- Periodic automatic fetching of submissions
- Advanced filtering and search by tags or difficulty
- TODO list based on average rating of solved problems