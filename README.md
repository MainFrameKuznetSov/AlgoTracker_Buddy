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
| `verdict`       | STRING  | Submission verdict (WA/TLE/RE/…)           |
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

### **GET /mistakes/{handle}**
Fetch all mistakes for a handle.

**Request**
```http
GET /mistakes/your_handle
```

## Response
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
    "message": "Excluded the case for n=2(Custom message by user)"
  }
]
```

### **POST /mistakes**
Add a new mistake.

**Request**
```http
POST /mistakes
```

## Content-Type: application/json
```json
{
  "handle": "your_handle",
  "problem_name": "Two Sum",
  "difficulty": "1200",
  "tags": "implementation, math",
  "verdict": "WA",
  "passedTestCount": 3,
  "message": "Wrong answer on testcase 2"
}
```

## Response
```json
{
  "id": 1,
  "handle": "your_handle",
  "problem_name": "Two Sum",
  "difficulty": "1200",
  "tags": "implementation, math",
  "verdict": "WA",
  "passedTestCount": 3,
  "message": "Wrong answer on testcase 2"
}
```