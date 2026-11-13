from sqlalchemy import select, update
from sqlalchemy.orm.session import Session
from fastapi import HTTPException, status
from typing import List

from db.models import DbFlashcard, DbUser, DbWage
from schemas import FlashcardBase

def create_flashcard(db: Session, request: FlashcardBase):
    """Creating new flashcard. Updating wage table with new flashcard number"""
    existing_flash = db.scalars(select(DbFlashcard).filter_by(pol = request.pol, translate = request.translate)).first()
    if existing_flash:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
            detail=f"Flashcard with this word {request.pol} and translation {request.translate} exist already in database")
    new_flashcard = DbFlashcard(
        pol = request.pol.strip(),
        translate = request.translate.strip(),
        topic = request.topic.strip()
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

def create_flashcards(db: Session, request: List[FlashcardBase]):
    """Creating new flashcards. Updating wage table with new flashcard number"""
    counter = 0
    i = 0
    for i in range(len(request)):
        try:
            existing_flash = db.scalars(select(DbFlashcard).filter_by(pol = request[i].pol, translate = request[i].translate)).first()
            if existing_flash:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                    detail=f"Flashcard with this word {request[i].pol} and translation {request[i].translate} exist already in database")
            if len(request[i].pol)==0 or len(request[i].translate)==0:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"No flashcard found")            
            new_flashcard = DbFlashcard(
                pol = request[i].pol,
                translate = request[i].translate,
                topic = request[i].topic
            )
            db.add(new_flashcard)
            db.commit()
            db.refresh(new_flashcard)
            flashcard = db.scalars(select(DbFlashcard).filter_by(pol = request[i].pol)).first()  
            users = db.scalars(select(DbUser)).all()
            for user in users:
                wage = DbWage(
                    user_num = user.user_num,
                    flash_num = flashcard.flash_num,
                    score=5)
                db.add(wage)
            db.commit()
            counter += 1
        except BaseException:
            continue
    return {'list': new_flashcard, 'uploaded flashcards': i, 'added flashcards': counter}

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

def update_flashcard(db: Session, flash_num: int, request: FlashcardBase):
    """Update one flashcard data"""
    existing_flash = db.scalars(select(DbFlashcard).filter_by(pol = request.pol, translate = request.translate)).first()
    if not existing_flash:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with this word {request.pol} and translation {request.translate} not found")
    db.execute(update(DbFlashcard).where(DbFlashcard.flash_num == existing_flash.flash_num).values(
        pol = request.pol,
        translate = request.translate,
        topic = request.topic
    ))
    db.commit()
    return 'ok'

def delete_flashcard(db:Session, flash_num: int):
    """Deleting flashcard and all its data from db"""
    flashcard = db.scalars(select(DbFlashcard).filter_by(flash_num = flash_num)).first()
    if not flashcard:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Flashcard with flash_num {flash_num} not found")
    db.delete(flashcard)
    db.commit()
    return "ok"   