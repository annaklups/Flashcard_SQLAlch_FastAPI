from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from csv import reader
import io

from db.database import get_db
from db import db_flashcard_functions
from schemas import FlashcardBase, FlashcardDisplay
from auth.oauth import require_admin
from db.models import DbUser

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
@router.delete('/delete/{flash_num}')
def delete_flashcard(flash_num: int, db: Session = Depends(get_db)):
    return db_flashcard_functions.delete_flashcard(db, flash_num)

# Upload csv file for to add flashcards in bunch to db
@router.post('/uploadfile')
def get_upload_file(upload_file: UploadFile = File(...), db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    csv_text = upload_file.file.read().decode('utf-8-sig')
    csv_content = reader(io.StringIO(csv_text, newline=''))
    counter = 0
    for line in csv_content:
        flashcard = FlashcardBase(pol=line[0], translate=line[1], topic=line[2])
        db_flashcard_functions.create_flashcard(db, flashcard)
        counter += 1 
    return {'uploaded flashcards': counter}