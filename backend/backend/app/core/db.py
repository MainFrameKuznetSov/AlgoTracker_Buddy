from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Please check your .env file.")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # Checks connection before using it
    pool_recycle=1800,    # Reconnect after 30 min
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ This is the missing function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
