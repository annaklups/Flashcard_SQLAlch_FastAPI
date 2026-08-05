from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db import db_user_functions
from schemas import UserBase, UserDisplay

router = APIRouter(
    prefix = '/user',
    tags = ['user']
)

#Create user
@router.post('/', response_model = UserDisplay)
def create_user(request: UserBase, db: Session = Depends(get_db)):
    return db_user_functions.create_user(db, request)

# Get all users
@router.get('/', response_model = List[UserDisplay])
def get_all_users(db: Session = Depends(get_db)):
    return db_user_functions.get_all_users(db)

# Get one user
@router.get('/{user_num}', response_model = UserDisplay)
def get_user(user_num: int, db: Session = Depends(get_db)):
    return db_user_functions.get_user(db, user_num)

@router.put('/{user_num}')
def update_user_settings(request: UserBase, user_num: int, db: Session = Depends(get_db)):
    return db_user_functions.update_user_settings(db, user_num, request)

@router.delete('/delete/{user_num}')
def delete_user(user_num: int, db: Session = Depends(get_db)):
    return db_user_functions.delete_user(db, user_num)