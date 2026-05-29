# from sqlalchemy import select

# from db.database import SessionLocal
# from db.models import Flashcard, User, Wage

# def create_flashcard(newf_pol, newf_translate, newf_topic):
#     """Creating new flashcard. Updating wage tabel with new flashcard number"""
#     db = SessionLocal()
#     try:
#         flashcard = Flashcard(
#             pol = newf_pol,
#             translate = newf_translate,
#             topic = newf_topic
#         )
#         db.add(flashcard)
#         db.commit()
#         flashcard = db.scalars(select(Flashcard).filter_by(pol = newf_pol)).first()  
#         users = db.scalars(select(User)).all()
#         for user in users:
#             wage = Wage(
#                 user_num = user.user_num,
#                 flash_num = flashcard.flash_num,
#                 score=5)
#             db.add(wage)            
#         db.commit()
#         print(f"Flashcard {flashcard.flash_num}: {flashcard.pol} added to database")        
#     except:
#         print(f"Flashcard with {newf_pol} word exist in database already")
#     finally:
#         db.close()

# def get_all_flashcards():
#     """Getting all flashcards from db and printing it"""
#     db = SessionLocal()
#     flashcards = db.scalars(select(Flashcard)).all()
#     print(flashcards)
#     db.close()

# def get_flashcard(flashcard_number):
#     """Getting one flashcard from db based on its number"""
#     db = SessionLocal()
#     flashcard = db.scalars(select(Flashcard).filter_by(flash_num = flashcard_number)).first()
#     db.close()
#     return flashcard

# # create_flashcard('szafa','drawer','everyday objects')
# # get_all_flashcards()
# # get_flashcard(1)