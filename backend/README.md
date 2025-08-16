s
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