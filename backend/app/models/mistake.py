from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.db import Base

class Mistake(Base):
    __tablename__ = "mistakes"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, unique=True, index=True, nullable=False)
    problem_name = Column(String, nullable=False)
    contest_id = Column(Integer, nullable=True)
    problem_rating = Column(Float, nullable=True)
    verdict = Column(String, nullable=False)

    # define the one-to-many relationship
    notes = relationship("MistakeNote", back_populates="mistake", cascade="all, delete-orphan")


class MistakeNote(Base):
    __tablename__ = "mistake_notes"

    id = Column(Integer, primary_key=True, index=True)
    mistake_id = Column(Integer, ForeignKey("mistakes.id"), nullable=False)
    note = Column(String, nullable=False)
    submission_id = Column(Integer, nullable=True)  # optional CF submission ID

    # link back to Mistake
    mistake = relationship("Mistake", back_populates="notes")
