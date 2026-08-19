"""Flashcards learning program"""

# Import
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from csv import reader

from router import user, flashcard, learning
from db import models
from auth import authentication

from db.database import engine
# from db.db_flashcard_functions import create_flashcard
# from db.db_user_functions import create_user

app = FastAPI()

app.include_router(user.router)
app.include_router(flashcard.router)
app.include_router(learning.router)
app.include_router(authentication.router)

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