from sqlalchemy import Column, Integer, String, JSON, Text
from app.database import Base

class Mistake(Base):
    __tablename__ = "mistakes"

    handle = Column(String(100), nullable=False, primary_key=True)
    problem_name = Column(String)
    difficulty = Column(Integer, nullable=False, default=0)
    tags = Column(JSON)
    verdict = Column(String)
    passedtestcount = Column(Integer)
    message = Column(Text)
