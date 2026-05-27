from gen_classes import ChoiceInner
from gen_functions import repeat_function
from flashcard_functions import input_new_user
from db.db_user_functions import change_settings, change_password, delete_user
from services.flashcard_service import FlashService


def inner_menu_func(login_data):
    """Inner menu function - allows to choose from changing settings, 
    changing password, deleting user, learning or goin back to main menu"""
    user_choice = int(input(
        "What do you wish to do now? (type number):  \n " \
        "1 - change settings for existing user \n " \
        "2 - change password for existing user \n " \
        "3 - delete user \n " \
        "4 - start learning \n " \
        "5 - go back to main menu \n"))
    
    # 1. change settings
    if user_choice == ChoiceInner.change_settings:
        cs_flash_amount = False
        while cs_flash_amount == False:
            cs_flash_amount = input_new_user(
                "How many flashcard do you want to train per session?: ", 
                r'^[0-9]+$')
        
        cs_new_flash_amount = False
        while cs_new_flash_amount == False:    
            cs_new_flash_amount = input_new_user(
                "How many of them you want to be completely new?: ", 
                r'^[0-9]+$')
            if (cs_new_flash_amount == False) or (cs_new_flash_amount > cs_flash_amount):
                print('Please, provide correct number of new flashcards')           
                cs_new_flash_amount = False

        change_settings(login_data['login'], cs_flash_amount, cs_new_flash_amount)
        return False
    
    # 2. change password
    elif user_choice == ChoiceInner.change_password:
        new_password1 = False
        while new_password1 == False:
            new_password1 = input_new_user(
                "Provide new password (use at least 1 uppercase letter, 1 lowercase letter and 1 digit): ", 
                r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$'
                )
        new_password2 = False
        while new_password2 == False:
            new_password2 = input_new_user(
                "Repeat your new password (use at least 1 uppercase letter, 1 lowercase letter and 1 digit): ", 
                r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$'
                )
        
        if new_password1 == new_password2:
            change_password(login_data['login'], new_password1)
        else:
            print("New passwords are not identical!")
        return False
    
    # 3. delete user
    elif user_choice == ChoiceInner.delete_user:
        confirmation = ''
        while confirmation not in ('yes', 'YES', 'Yes', 'y', 'Y', 'no', 'NO', 'No', 'n', 'N'):
            confirmation = input(f"Are you sure you want to delete {login_data['login']}? (Y/N) ")
            if confirmation in ('yes', 'YES', 'Yes', 'y', 'Y'):
                delete_user(login_data['login'])
                return True
            elif confirmation in ('no', 'NO', 'No', 'n', 'N'):
                return False
    
    # 4. learning
    elif user_choice == ChoiceInner.learning:
        # repeat_function(learning, 'Do you want to continue learning?', login_data)
        flash_service = FlashService()
        repeat_function(flash_service.learning, 'Do you want to continue learning?', login_data)        
        return False      

    # 5. go back to main menu
    elif user_choice == ChoiceInner.main_menu:
        return True
    
    # Else
    else:
        return False