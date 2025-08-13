from fastapi import FastAPI
from app.api import submissions, mistakes
from app.core.db import Base, engine

# Initialize DB tables
def init_db():
    Base.metadata.create_all(bind=engine)

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

# Root endpoint
@app.get("/")
def root():
    return {"message": "Codeforces Tracker API Running"}
