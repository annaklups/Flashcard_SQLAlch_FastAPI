from pydantic import BaseModel
from typing import List

class Wages(BaseModel):
    score: int
    class Config():
        orm_mode = True

class UserBase(BaseModel):
    login: str
    password: str
    flash_amount: int
    new_flash_amount: int

class UserDisplay(UserBase):
    login: str
    password: str
    flash_amount: int
    new_flash_amount: int
    wages_user: List[Wages]
    class Config():
        orm_mode = True           