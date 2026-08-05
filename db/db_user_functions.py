from sqlalchemy import select, update
from sqlalchemy.orm.session import Session
from fastapi import HTTPException, status

from db.models import DbUser, DbFlashcard, DbWage
from schemas import UserBase

def create_user(db: Session, request: UserBase):
    """Creating user and adding user to db. Adding base wages to db for this user"""
    existing_user = db.scalars(select(DbUser).filter_by(login = request.login)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
            detail=f"User with login {request.login} exist already in database")
    new_user = DbUser(
        login = request.login, 
        password = request.password, 
        flash_amount = request.flash_amount, 
        new_flash_amount = request.new_flash_amount)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    user = db.scalars(select(DbUser).filter_by(login = request.login)).first()
    flashcards = db.scalars(select(DbFlashcard)).all()
    for flash in flashcards:
        wage = DbWage(
            user_num = user.user_num,
            flash_num = flash.flash_num,
            score = 5)
        db.add(wage)
    db.commit()
    return new_user 

def get_all_users(db: Session):
    """Getting all users data from db"""
    return db.scalars(select(DbUser)).all()

def get_user(db: Session, user_num: int):
    """Getting one user from based ont its login"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    return user

def update_user_settings(db: Session, user_num: int, request: UserBase):
    """Changing number of new and old flashcard to provided values for selected user"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    db.execute(update(DbUser).where(DbUser.user_num == user_num).values(
        flash_amount=request.flash_amount, 
        new_flash_amount=request.new_flash_amount))      
    db.commit()
    return 'ok'

def delete_user(db: Session, user_num: int):
    """Deleting user and all its data from db"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    db.delete(user)
    db.commit()
    return "ok"



# def update_user_password(db: Session, user_num: int, request: UserBase):
#     """Changing number of new and old flashcard to provided values for selected user"""
#     db.execute(update(DbUser).where(DbUser.login == request.login).values(
#         flash_amount=request.flash_amount, 
#         new_flash_amount=request.new_flash_amount))
#     db.commit()
#     return 'ok'


# def login(log_login, log_password):
#     """Login function, returning user data if provided login and password are correct."""
#     db = SessionLocal()
#     user = db.scalars(select(User).filter_by(login = log_login, password = log_password)).first()
#     db.close()
#     return user



# def change_password(log_login, new_password1):
#     """Changing password to new one for provided user."""
#     try:
#         db = SessionLocal()
#         db.execute(update(User).where(User.login == log_login).values(password=new_password1))
#         db.commit()
#         print("Password changed correctly")
#     except:
#         print("Error occured during changing password")
#     finally:
#         db.close()
