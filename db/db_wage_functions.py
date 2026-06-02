from sqlalchemy import select, update
from sqlalchemy.orm.session import Session
from schemas import AnswerBase

from db.models import DbWage

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
    db.commit()
    return {'flash_num': request.flash_num, 'translate': request.answer, 'pol': request.pol, 'wage_change': wage_change}