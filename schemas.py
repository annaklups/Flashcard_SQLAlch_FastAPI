from pydantic import BaseModel
from typing import List

# Wages class for UserDisplay and FlashcardDisplay
class Wages(BaseModel):
    user_num: int
    flash_num: int
    score: int
    class Config():
        orm_mode = True

# Users classes
class UserBase(BaseModel):
    login: str
    password: str
    flash_amount: int
    new_flash_amount: int

class UserDisplay(BaseModel):
    user_num: int
    login: str
    password: str
    flash_amount: int
    new_flash_amount: int
    wages_user: List[Wages]
    class Config():
        orm_mode = True

# Flashcard classes
class FlashcardBase(BaseModel):
    pol: str
    translate: str
    topic: str

class FlashcardDisplay(BaseModel):
    flash_num: int
    pol: str
    translate: str
    topic: str
    wages_flash: List[Wages]
    class Config():
        orm_mode = True

# Classes for learning requests and responses
class LearningDisplay(BaseModel):
    pol: str
    translate: str
    topic: str
    flash_num: int
    class Config():
        orm_mode = True

class AnswerBase(BaseModel):
    flash_num: int
    pol: str
    answer: str
    user_num: int

class AnswerDisplay(BaseModel):
    flash_num: int
    translate: str
    pol: str
    wage_change: int