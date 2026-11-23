from sqlalchemy import select, func
from sqlalchemy.orm.session import Session
import datetime

from db.models import DbLearnFlash

def get_user_statistics(db: Session, user_num: int):
    """Getting statistics for one user from db based ont its number"""
    all_records = db.scalars(select(DbLearnFlash).filter_by(user_num = user_num)).all()
    total_session = len(all_records)
    num_correct_answer = len([record for record in all_records if record.wage_change==1])
    num_incorrect_answer = total_session - num_correct_answer
    diff_flashcard_train = len(set([record.flashcard_num for record in all_records]))

    diff_flashcard_learn = 0
    
    dates_row = [record.datestamp for record in all_records]
    dates_row.insert(0,datetime.date.today())
    num_days_row = 0
    for i, date in enumerate(dates_row):
        diff = dates_row[i+1] - dates_row[i]
        if diff.days == 1:
            num_days_row += 1
        else:
            break

    list_flash_num = [record.flashcard_num for record in all_records]
    most_trained_flash = max(set(list_flash_num), key=list_flash_num.count)

    return {'total number of sessions': total_session,
            'number of correct answers': num_correct_answer,
            'number of incorrect answers': num_incorrect_answer,
            'different flashcard trained': diff_flashcard_train,
            'different flashcard learned': diff_flashcard_learn,
            'number of days in a row trained': num_days_row,
            'most trained flasahcard': most_trained_flash 
            }