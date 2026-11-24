from sqlalchemy import select, func
from sqlalchemy.orm.session import Session
import datetime

from db.models import DbLearnFlash
from schemas import StatisticsDisplay

def get_user_statistics(db: Session, user_num: int):
    """Getting statistics for one user from db based ont its number"""
    all_records = db.scalars(select(DbLearnFlash).filter_by(user_num = user_num)).all()
    if not all_records:
        user_stats= StatisticsDisplay(total_session = 0, num_correct_answer = 0, num_incorrect_answer = 0, diff_flashcard_train = 0, diff_flashcard_learn = 0, num_days_row = 0, most_trained_flash = 0)
        return user_stats
    else:
        total_session = len(all_records)
        num_correct_answer = len([record for record in all_records if record.wage_change==1])
        num_incorrect_answer = total_session - num_correct_answer

        all_data = [(record.flashcard_num, record.wage_change) for record in all_records]
        aggregated_data = {}
        for key, value in all_data:
            if key in aggregated_data:
                aggregated_data[key] += value
            else:
                aggregated_data[key] = value
        diff_flashcard_train = len(aggregated_data)
        diff_flashcard_learn = len({key: value for key,value in aggregated_data.items() if value < 1})

        dates_row = [record.datestamp for record in all_records]
        dates_row.insert(0,datetime.date.today())
        num_days_row = 0
        for i, date in enumerate(dates_row):
            try:
                diff = dates_row[i+1] - dates_row[i]
                if diff.days == 1:
                    num_days_row += 1
                else:
                    break
            except:
                None

        list_flash_num = [record.flashcard_num for record in all_records]
        most_trained_flash = max(set(list_flash_num), key=list_flash_num.count)
        
        user_stats= StatisticsDisplay(
            total_session = total_session, 
            num_correct_answer = num_correct_answer, 
            num_incorrect_answer = num_incorrect_answer, 
            diff_flashcard_train = diff_flashcard_train, 
            diff_flashcard_learn = diff_flashcard_learn, 
            num_days_row = num_days_row, 
            most_trained_flash = most_trained_flash)
        return user_stats
    