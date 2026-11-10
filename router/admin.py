from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from db import db_user_functions, db_admin_functions
from schemas import UserChangeSet, AdminChangePass
from auth.oauth import require_admin
from db.models import DbUser

router = APIRouter(
    prefix = '/admin',
    tags = ['admin']
)

# Update user settings
@router.put('/update/{user_num}')
def update_user_settings(request: UserChangeSet, user_num: int, db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    return db_user_functions.update_user_settings(db, user_num, request)

# Update user password
@router.put('/update_pass/{user_num}')
def update_user_password(request: AdminChangePass, user_num: int, db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    return db_admin_functions.update_user_password_admin(db, user_num, request)

# Update user role to admin
@router.put('/update_role')
def update_user_role(user_num: int, db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    return db_admin_functions.update_user_role(db, user_num)

# Delete user
@router.delete('/delete/{user_num}')
def delete_user(user_num: int, db: Session = Depends(get_db), admin: DbUser = Depends(require_admin)):
    return db_admin_functions.delete_user_admin(db, user_num)