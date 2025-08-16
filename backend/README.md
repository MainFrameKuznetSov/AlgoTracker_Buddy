## 📡 API Endpoints

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