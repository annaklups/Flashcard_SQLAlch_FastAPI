from sqlalchemy import select, update

from db.database import SessionLocal
from db.models import User, Flashcard, Wage

def create_user(newu_login, newu_password, newu_flash_amount, newu_new_flash_amount):
    """Creating user and adding user to db. Adding base wages to db for this user"""
    db = SessionLocal()
    try:
        user = User(
            login=newu_login, 
            password=newu_password, 
            flash_amount=newu_flash_amount, 
            new_flash_amount=newu_new_flash_amount)
        db.add(user)
        db.commit() 
        user = db.scalars(select(User).filter_by(login = newu_login)).first()
        flashcards = db.scalars(select(Flashcard)).all()
        for flash in flashcards:
            wage = Wage(
                user_num = user.user_num,
                flash_num = flash.flash_num,
                score = 5)
            db.add(wage)
        db.commit()
        print(f"User {newu_login} added to db")        
    except:
        print(f"User with {newu_login} exist in database already")
    finally:
        db.close()

def get_all_users():
    """Getting all users data from db and printing it"""
    db = SessionLocal()
    users = db.scalars(select(User)).all()
    print(users)
    db.close()

def get_user(log_login):
    """Getting one user from based ont its login"""
    db = SessionLocal()
    user = db.scalars(select(User).filter_by(login = log_login)).first()
    db.close()
    return user

def login(log_login, log_password):
    """Login function, returning user data if provided login and password are correct."""
    db = SessionLocal()
    user = db.scalars(select(User).filter_by(login = log_login, password = log_password)).first()
    db.close()
    return user

def change_settings(log_login, cs_flash_amount, cs_new_flash_amount):
    """Changing number of new and old flashcard to provided values for selected user"""
    try:
        db = SessionLocal()
        db.execute(update(User).where(User.login == log_login).values(
            flash_amount=cs_flash_amount, 
            new_flash_amount=cs_new_flash_amount
            ))
        db.commit()
        print("Settings changed correctly")
    except:
        print("Error occured during changing settings")
    finally:
        db.close()

def delete_user(log_login):
    """Deleting user and all its data from db"""
    try:
        db = SessionLocal()
        user = db.scalars(select(User).filter_by(login = log_login)).first()
        db.delete(user)
        db.commit()
        print(f"User {log_login} delete from database")
    except:
        print("Error occured during deleting user process")
    finally:
        db.close()

def change_password(log_login, new_password1):
    """Changing password to new one for provided user."""
    try:
        db = SessionLocal()
        db.execute(update(User).where(User.login == log_login).values(password=new_password1))
        db.commit()
        print("Password changed correctly")
    except:
        print("Error occured during changing password")
    finally:
        db.close()


# create_user('ania1','pass', 9, 3)
# get_all_users()
# get_user('AniaK')
# get_user("buba")
# login('AniaK', 'Qwerty1')
# change_settings('ania1', 8, 3)
# change_password('AniaK', 'Qwerty1')
# delete_user('aniaa3456')
