from sqlalchemy import Column, Integer, String, Text
from app.core.db import Base

class Mistake(Base):
    __tablename__ = "mistakes"

    id = Column(Integer, primary_key=True, index=True)
    problem_name = Column(String, index=True)
    contest_id = Column(Integer, nullable=True)
    note = Column(Text)
