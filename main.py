"""Flashcards learning program"""

# Import
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from csv import reader

from router import user, flashcard, learning
from db import models

from db.database import engine
# from db.db_flashcard_functions import create_flashcard
# from db.db_user_functions import create_user

app = FastAPI()

app.include_router(user.router)
app.include_router(flashcard.router)
app.include_router(learning.router)

@app.get('/')
def start():
    return "hello world"

# Create new file with tables:
models.Base.metadata.create_all(engine)

# Middleware to eliminate CORS error
origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)



# def main():
#     # Create new file with tables:
#     models.Base.metadata.create_all(engine)

#     # Adding starting pack of flashcards to database:
#     with open(directory_path("flashcards_csv.csv"), encoding='utf-8') as file:
#         csv_reader = reader(file)
#         flashcards_source = list(csv_reader)
    
#         for line in flashcards_source:
#             create_flashcard(line[0], line[1], line[2])

#     # Main menu 
#     print("Hi, This is your flashcard learning program!")
#     while True:
#         user_choice = int(input(
#             "What do you wish to do? (type number):  \n " \
#             "1 - create new user \n " \
#             "2 - log in to program \n " \
#             "3 - add your own flashcards \n "  \
#             "4 - close the program \n "))

#     # 1. creating new user
#         if user_choice == Choice.create_new_user:
#             newu_login = False
#             while newu_login == False:
#                 newu_login = input_new_user(
#                     "New user login (use letters only): ", r'^[A-Za-z]+$')

#             newu_password = False
#             while newu_password == False:
#                 newu_password = input_new_user(
#                     "Password (use at least 1 uppercase letter, " \
#                     "1 lowercase letter and 1 digit): ", 
#                     r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$')

#             newu_flash_amount = False
#             while newu_flash_amount == False:        
#                 newu_flash_amount = int(input_new_user(
#                     "How many flashcard do you want to train per session?: ",
#                     r'^[0-9]+$'
#                     ))

#             newu_new_flash_amount = False
#             while newu_new_flash_amount == False:
#                 newu_new_flash_amount = int(input_new_user(
#                     "How many of them you want to be completely new? "\
#                     "(must be less than your previous answer): ", 
#                     r'^[0-9]+$'))
#                 if (newu_new_flash_amount == False) or (newu_new_flash_amount > newu_flash_amount):
#                     print('Please, provide correct number of new flashcards')           
#                     newu_new_flash_amount = False

#             create_user(
#                 newu_login, 
#                 newu_password, 
#                 newu_flash_amount, 
#                 newu_new_flash_amount)

#     # 2. login in
#         elif user_choice == Choice.login_in_to_program:
#             login_data = login_in()
#             if login_data['logged_flag'] == True:
#                 main_menu = False
#                 while main_menu == False:
#                     main_menu = inner_menu_func(login_data)
#             else:
#                 continue

#     # 3. add your own flashcard
#         elif user_choice == Choice.add_flashcard:
#             repeat_function(add_flashcard, "Do you want to add another flashcard? (Y/N)")  

#     # 4. exit the program
#         elif user_choice == Choice.exit:
#             print("Thank you for learning languages with us. See you soon!")
#             break
        
#     # Else
#         else:
#             continue


# if __name__ == "__main__":
#     main()

# To do:
#- dodać możliwość przeglądania statystyk dla każdego usera:
#       -dodatkowa tabela z datą i listą poprawnych/niepoprawnych odpowiedzi: data, login, fiszka, poprawne/niepoprawne
#       -możliwość podsumowania: ilość poprawnych/ niepoprawnych odpowiedzi, najczęściej/najrzadziej trenowana fiszka, ilość dni treningu