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
        if flashcard.translate == request.answer:
            return -1
        else:
            return 1

    # def _learn_flashcard(self, flash_drawn):                
    #     """Learning flashcard drawn previously from db. Returning wage update for the flashcard"""
    #     print(f"Flashcard number:{flash_drawn.flash_num} - POL: {flash_drawn.pol.upper()}")
    #     answer = input("Please provide translation:")
    #     if answer.lower() == flash_drawn.translate:
    #         print("Correct answer!!")
    #         return -1
    #     else:
    #         print(f"You have to work on that. Correct answer is: {flash_drawn.translate}")
    #         return 1

    # def _learning_part(self, login_data, repetitions, flag_new):
    #     """One part of learning flashards (as many as previously declared in users data). 
    #     New or old ones. Updating wages based on users answers"""
    #     for i in range(repetitions):
    #         flash_drawn = self._draw_flashcard(login_data['user_num'], flag_new)
    #         wage_change = self._learn_flashcard(flash_drawn)
    #         update_wages(login_data['user_num'], flash_drawn.flash_num, wage_change)

    # def learning(self, login_data):
    #     """Learning module - first old flashcards then new flashcards"""
    #     self._learning_part(login_data, login_data['flash_amount'] - login_data['new_flash_amount'], False)
    #     self._learning_part(login_data, login_data['new_flash_amount'], True)