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

# Update flashcard data
@router.post('/update')
def update_flashcard(request: FlashcardBase, db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    return db_flashcard_functions.update_flashcard(db, request)

# Delete one flashcard
@router.delete('/delete/{flash_num}')
def delete_flashcard(flash_num: int, db: Session = Depends(get_db)):
    return db_flashcard_functions.delete_flashcard(db, flash_num)

# Upload csv file for to add flashcards in bunch to db
@router.post('/uploadfile')
def get_upload_file(upload_file: UploadFile = File(...), db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    csv_text = upload_file.file.read().decode('utf-8-sig')
    csv_content = reader(io.StringIO(csv_text, newline=''))
    flash_list = []
    for line in csv_content:
        try:
            flashcard = FlashcardBase(pol=line[0].strip(), translate=line[1].strip(), topic=line[2].strip())
            flash_list.append(flashcard)
        except BaseException:
            continue
    return db_flashcard_functions.create_flashcards(db, flash_list)

