from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from db import db_statistics_functions
from schemas import UserDisplay, UserAuth
from auth.oauth import get_current_user

router = APIRouter(
    prefix = '/statistics',
    tags = ['statistics']
)

# Get statistics data for current user
@router.get('/', response_model = UserDisplay)
def get_stats(db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_statistics_functions.get_user_statistics(db, current_user.user_num)
