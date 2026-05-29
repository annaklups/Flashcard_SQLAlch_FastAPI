from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db import db_flashcard_functions
from schemas import FlashcardBase, FlashcardDisplay

router = APIRouter(
    prefix = '/flashcard',
    tags = ['flashcard']
)

#Create flashcard
@router.post('/', response_model = FlashcardDisplay)
def create_flashcard(request: FlashcardBase, db: Session = Depends(get_db)):
    return db_flashcard_functions.create_flashcard(db, request)

#Get all flashcards
@router.get('/', response_model = List[FlashcardDisplay])
def get_all_flashcards(db: Session = Depends(get_db)):
    return db_flashcard_functions.get_all_flashcards(db)

#Get one flashcards
@router.get('/{flash_num}', response_model = FlashcardDisplay)
def get_flashcard(flash_num: int, db: Session = Depends(get_db)):
    return db_flashcard_functions.get_flashcard(db, flash_num)

# Delete one flashcard
@router.get('/delete/{flash_num}')
def delete_flashcard(flash_num: int, db: Session = Depends(get_db)):
    return db_flashcard_functions.delete_flashcard(db, flash_num)