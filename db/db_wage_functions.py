from sqlalchemy import select, update
from sqlalchemy.orm.session import Session
from schemas import AnswerBase
import datetime

from db.models import DbWage, DbLearnSession

def get_wages_for_draw(db: Session, user_num: int):
    """Getting wages from db for selected user. Returning list of wages."""
    wages = db.scalars(select(DbWage).filter_by(user_num = user_num))
    wage_list = []
    for wage in wages:
        wage_list.append((wage.flash_num, wage.score))
    return wage_list

def update_wages(db: Session, request: AnswerBase, wage_change: int):
    """Updating wage for selected user and flashcard with provided wage change"""
    wage_to_update = db.scalars(select(DbWage).filter_by(user_num = request.user_num , flash_num = request.flash_num)).first()
    new_wage = wage_to_update.score + wage_change
    db.execute(update(DbWage).where(DbWage.user_num == request.user_num, DbWage.flash_num == request.flash_num).values(score = new_wage))
    new_learningsession = DbLearnSession(
        user_login = request.login,
        datestamp = datetime.datetime.now,
        flashcard_num = request.flash_num, 
        wage_change = wage_change
    )
    db.add(new_learningsession)
    db.commit()
    db.refresh(new_learningsession)
    return {'flash_num': request.flash_num, 'answer': request.answer, 'translate': request.translate, 'pol': request.pol, 'wage_change': wage_change}