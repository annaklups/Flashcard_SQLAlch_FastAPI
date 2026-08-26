from pydantic import BaseModel, Field
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
    login: str = Field(pattern=r'^[A-Za-z0-9]+$')
    password: str = Field(pattern=r'^[A-Za-z0-9]+$')
    # regex ^[A-Za-z0-9]+$ expects one or more big letters, small letters or digits
    flash_amount: int = Field(ge = 1)
    new_flash_amount: int = Field(ge = 0)

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

# class for authentication
class UserAuth(BaseModel):
    user_num: int
    login: str
    password: str

# class for change settings and password
class UserChangeSet(BaseModel):
    flash_amount: int
    new_flash_amount: int

class UserChangePass(BaseModel):
    password: str