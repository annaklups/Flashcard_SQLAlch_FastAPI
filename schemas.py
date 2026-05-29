from pydantic import BaseModel
from typing import List

# Wages class for UserDisplay and FlashcardDisplay
class Wages(BaseModel):
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
    pol: str
    translate: str
    topic: str
    wages_flash: List[Wages]
    class Config():
        orm_mode = True        