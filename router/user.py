from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db import db_user_functions
from schemas import UserBase, UserDisplay, UserAuth, UserChangeSet, UserChangePass, UserDelete
from auth.oauth import get_current_user

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

@router.put('/update/{user_num}')
def update_user_settings(request: UserChangeSet, user_num: int, db: Session = Depends(get_db)):
    return db_user_functions.update_user_settings(db, user_num, request)

@router.put('/update')
def update_current_user_settings(request: UserChangeSet, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_user_functions.update_user_settings(db, current_user.user_num, request)

@router.put('/update_pass/{user_num}')
def update_user_password(request: UserChangePass, user_num: int, db: Session = Depends(get_db)):
    return db_user_functions.update_user_password(db, user_num, request)

@router.put('/update_pass')
def update_current_user_password(request: UserChangePass, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_user_functions.update_user_password(db, current_user.user_num, request)

@router.delete('/delete/{user_num}')
def delete_user(user_num: int, db: Session = Depends(get_db)):
    return db_user_functions.delete_user(db, user_num)

@router.delete('/delete')
def delete_current_user(user_request: UserDelete, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_user_functions.delete_user(db, current_user.user_num, user_request)