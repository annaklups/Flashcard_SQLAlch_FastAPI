from sqlalchemy.orm import Session
from random import choices

from db import db_wage_functions, db_flashcard_functions
from schemas import AnswerBase

class FlashService:
    def draw_flashcard(self, db: Session, user_num: int, is_new: bool):
        """Drawing one flashcard from database based on user wages"""
        wages_all = db_wage_functions.get_wages_for_draw(db, user_num)
        # filter for old/new flashcards and reorder them -> [(flashcards_num), (wages)]
        wages_old = list(zip(*[pair for pair in wages_all if pair[1]!=5]))
        wages_new = list(zip(*[pair for pair in wages_all if pair[1]==5]))
        # drawing flashcard
        if (len(wages_old) > 0 and is_new == False) or (len(wages_new) == 0):
            draw = choices(wages_old[0], wages_old[1], k=1)
        else:
            draw = choices(wages_new[0], k=1)     
        flash_num, = draw
        return flash_num

    def check_answer(self, db: Session, request: AnswerBase):
        """Check correctness of user's answer"""
        flashcard = db_flashcard_functions.get_flashcard(db, request.flash_num)
        if flashcard.translate == request.answer.lower().strip():
            return {'change': -1, 'correct translation': flashcard.translate}
        else:
            return {'change': 1, 'your answer': request.answer, 'correct translation': flashcard.translate}