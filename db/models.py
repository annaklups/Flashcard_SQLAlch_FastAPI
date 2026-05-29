from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey
from typing import List

from db.database import Base

class DbUser(Base):
    """Creating users_tab table in db"""
    __tablename__ = 'users_tab'

    user_num: Mapped[int] = mapped_column(primary_key=True)
    login: Mapped[str] = mapped_column(String(20), unique=True)
    password: Mapped[str] = mapped_column(String(20))
    flash_amount: Mapped[int] = mapped_column(Integer)
    new_flash_amount: Mapped[int] = mapped_column(Integer)
    wages_user: Mapped[List["DbWage"]] = relationship(
        back_populates ='scores_user', cascade="all, delete-orphan")

    def __repr__(self):
        return f"{self.user_num} - User: {self.login}"

class DbFlashcard(Base):
    """Creating flashcards_tab table in db"""
    __tablename__ = 'flashcards_tab'

    flash_num: Mapped[int] = mapped_column(primary_key=True)
    pol: Mapped[str] = mapped_column(String(50), unique=True)
    translate: Mapped[str] = mapped_column(String(50))
    topic: Mapped[str] = mapped_column(String(20))
    wages_flash: Mapped[List["DbWage"]] = relationship(
        back_populates ='scores_flash', cascade="all, delete-orphan")

    def __repr__(self):
        return f"Flashcard: {self.flash_num}: {self.pol} - {self.translate}"

class DbWage(Base):
    """Creating wages_tab table in db"""
    __tablename__ = 'wages_tab'

    user_num: Mapped[int] = mapped_column(
        ForeignKey("users_tab.user_num"), 
        primary_key=True)
    flash_num: Mapped[int] = mapped_column(
        ForeignKey("flashcards_tab.flash_num"), 
        primary_key=True)
    score: Mapped[int] = mapped_column(Integer, default=5)
    scores_user: Mapped["DbUser"] = relationship(back_populates='wages_user')
    scores_flash: Mapped["DbFlashcard"] = relationship(back_populates='wages_flash')