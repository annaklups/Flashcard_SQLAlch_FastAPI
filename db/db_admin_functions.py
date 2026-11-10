from sqlalchemy import select, update
from sqlalchemy.orm.session import Session
from fastapi import HTTPException, status

from db.models import DbUser
from schemas import AdminChangePass
from db.hashing import Hash

def update_user_password_admin(db: Session, user_num: int, request: AdminChangePass):
    """Changing password for selected user by admin"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    if request.new_password1 == request.new_password2:
        db.execute(update(DbUser).where(DbUser.user_num == user_num).values(
            password = Hash.bcrypt(request.new_password2)))      
        db.commit()
    else:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail=f"New passwords are not matching")
    return 'ok'

def update_user_role(db: Session, user_num: int):
    """Change user role to admin"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    db.execute(update(DbUser).where(DbUser.user_num == user_num).values(
        role='admin'))      
    db.commit()
    return 'ok'

def delete_user_admin(db: Session, user_num: int):
    """Deleting user and all its data from db by admin"""
    user = db.scalars(select(DbUser).filter_by(user_num = user_num)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with user_num {user_num} not found")
    db.delete(user)
    db.commit()
    return "ok"