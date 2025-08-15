from fastapi import FastAPI
from app.api import submissions, mistakes
from app.core.db import Base, engine
from sqlalchemy.exc import OperationalError

# Initialize DB tables safely
def init_db():
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized successfully.")
    except OperationalError as e:
        print("❌ Database initialization failed:", e)

# Create FastAPI app instance
app = FastAPI(title="AlgoTracker Buddy")

# Events
@app.on_event("startup")
def on_startup():
    init_db()
    print("✅ Database initialized and server starting...")

@app.on_event("shutdown")
def on_shutdown():
    print("🛑 Server shutting down...")

# Routers
app.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
app.include_router(mistakes.router, prefix="/mistakes", tags=["Mistakes"])
# app.include_router(mistakes.router, prefix="/mistakes", tags=["Mistakes"])

# Root endpoint
@app.get("/")
def root():
    return {"message": "Codeforces Tracker API Running"}

