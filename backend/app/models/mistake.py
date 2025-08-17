from sqlalchemy import Column, Integer, String, JSON, Text
from app.database import Base

class Mistake(Base):
    __tablename__ = "mistakes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    handle = Column(String(100), nullable=False, index=True)
    problem_name = Column(String, nullable=False)
    difficulty = Column(Integer, nullable=False, default=0)
    tags = Column(JSON)
    verdict = Column(String)
    passedtestcount = Column(Integer)
    message = Column(Text)
