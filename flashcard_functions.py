import re

from db.db_user_functions import login
from db.db_flashcard_functions import create_flashcard

# input -> frontend, regexp -> FastAPI?
def input_new_user(text, regexp):
    """Colleting input data for new user or for changing settings/ password. 
    Checking correctness of inputs from user with regexp"""
    newu = input(text)
    pattern = re.compile(regexp)
    res = pattern.search(newu)
    if res:
        return newu
    else:
        return False

# login -> authentication part in FastAPI 
def login_in():
    """Loggin into the system. Fetching data from db for next actions."""
    print("Please enter login and password to log in")
    your_login = input("Login: ")
    your_password = input("Password: ")
    user = login(your_login, your_password)
    if user:
        print(f"{your_login} logged in !")
        logged_flag = True
        return {'logged_flag': logged_flag, 
                'user_num': user.user_num, 
                'login': user.login, 
                'flash_amount': user.flash_amount, 
                'new_flash_amount': user.new_flash_amount
                }
    else:
        print("You login data is incorrect")
        logged_flag = False
        return {'logged_flag': logged_flag}

# input -> frontend
def add_flashcard():
    """Collecting inputs, creating and adding new flashcard to database"""
    newf_topic = input("What topic this flashcard refers to?: ")
    newf_pol = input("Provide polish verion of this word or sentence: ")
    newf_translate = input("Provide translation of this word or sentence: ")
    create_flashcard(newf_pol.lower(), newf_translate.lower(), newf_topic.lower())