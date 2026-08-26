from sqlalchemy import select, update
from sqlalchemy.orm.session import Session
from fastapi import HTTPException, status

from db.models import DbUser, DbFlashcard, DbWage
from schemas import UserBase, UserChangeSet, UserChangePass
from db.hashing import Hash

def create_user(db: Session, request: UserBase):
    """Creating user and adding user to db. Adding base wages to db for this user"""
    existing_user = db.scalars(select(DbUser).filter_by(login = request.login)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
            detail=f"User with login {request.login} exist already in database")
    new_user = DbUser(
        login = request.login, 
        password = Hash.bcrypt(request.password), 
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

def get_user_by_login(db: Session, login: str):
    """Getting one user from based ont its login"""
    user = db.scalars(select(DbUser).filter_by(login = login)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with login {login} not found")
    return user

def update_user_settings(db: Session, user_num: int, request: UserChangeSet):
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

def update_user_password(db: Session, user_num: int, request: UserChangePass):
    """Changing password for selected user"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    db.execute(update(DbUser).where(DbUser.user_num == user_num).values(
        password = Hash.bcrypt(request.password)))      
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