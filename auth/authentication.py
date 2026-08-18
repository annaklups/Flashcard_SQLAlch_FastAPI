from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm.session import Session

from db.database import get_db
from db.models import DbUser
from db.hashing import Hash
from auth.oauth import create_access_token

router = APIRouter(tags=['authentication'])

# endpoint do logowania
@router.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(DbUser).filter(DbUser.login == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Invalid credentials')
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Incorrect password')
    
    access_token = create_access_token(data = {'username': user.login})
    
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user_id': user.user_num,
        'username': user.login
    }

# request w odpowiedniej klasie - to jest login i hasło, które wysyła użytkownik
# sprawdzenie czy jest w db
# stworzenie tokenu
# zwrócenie tokenu i jego typu, wraz z userem i loginem do którego są przypisane