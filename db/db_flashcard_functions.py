from sqlalchemy import select
from sqlalchemy.orm.session import Session
from fastapi import HTTPException, status

from db.models import DbFlashcard, DbUser, DbWage
from schemas import FlashcardBase

def create_flashcard(db: Session, request: FlashcardBase):
    """Creating new flashcard. Updating wage tabel with new flashcard number"""
    existing_flash = db.scalars(select(DbFlashcard).filter_by(pol = request.pol, translate = request.translate)).first()
    if existing_flash:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
            detail=f"Flashcard with this word {request.pol} and translation {request.translate} exist already in database")
    new_flashcard = DbFlashcard(
        pol = request.pol,
        translate = request.translate,
        topic = request.topic
    )
    db.add(new_flashcard)
    db.commit()
    db.refresh(new_flashcard)
    flashcard = db.scalars(select(DbFlashcard).filter_by(pol = request.pol)).first()  
    users = db.scalars(select(DbUser)).all()
    for user in users:
        wage = DbWage(
            user_num = user.user_num,
            flash_num = flashcard.flash_num,
            score=5)
        db.add(wage)
    db.commit()
    return new_flashcard

def get_all_flashcards(db: Session):
    """Getting all flashcards from db"""
    return db.scalars(select(DbFlashcard)).all()

def get_flashcard(db: Session, flash_num: int):
    """Getting one flashcard from db based on its number"""
    flashcard = db.scalars(select(DbFlashcard).filter_by(flash_num = flash_num)).first()
    if not flashcard:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with flash_num {flash_num} not found")
    return flashcard

def delete_flashcard(db:Session, flash_num: int):
    """Deleting flashcard and all its data from db"""
    flashcard = db.scalars(select(DbFlashcard).filter_by(flash_num = flash_num)).first()
    if not flashcard:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with flash_num {flash_num} not found")
    db.delete(flashcard)
    db.commit()
    return "ok"   