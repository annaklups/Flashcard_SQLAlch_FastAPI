from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from db import db_flashcard_functions, db_wage_functions
from schemas import LearningDisplay, AnswerBase, AnswerDisplay
from services.flashcard_service import FlashService

router = APIRouter(
    prefix = '/learning',
    tags = ['learning']
)

# Draw one flashcard
@router.get('/', response_model = LearningDisplay)
def get_flashcard(user_num: int, is_new: bool, db: Session = Depends(get_db)):
    flash_service = FlashService()
    flash_num = flash_service.draw_flashcard(db, user_num, is_new)
    return db_flashcard_functions.get_flashcard(db, flash_num)

# Check users answer and update wages table
@router.post('/answer', response_model = AnswerDisplay)
def send_answer(request: AnswerBase, db: Session = Depends(get_db)):
    flash_service = FlashService()
    wage_change = flash_service.check_answer(db, request)
    return db_wage_functions.update_wages(db, request, wage_change)