
import os
import re
import sqlite3
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field

from app.database import get_db_connection

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()
security = HTTPBearer(auto_error=False)

ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60


# Request and response models

class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str = Field(max_length=254)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# JWT secret must be configured in the environment

def get_secret_key():
    key = os.getenv("JWT_SECRET_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="Authentication secret is not configured."
        )
    return key


def create_access_token(user_id: int):
    expires = datetime.now(timezone.utc) + timedelta(
        minutes=TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expires
    }

    return jwt.encode(payload, get_secret_key(), algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Please log in.")

    try:
        payload = jwt.decode(
            credentials.credentials,
            get_secret_key(),
            algorithms=[ALGORITHM]
        )
        user_id = int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    conn = get_db_connection()
    try:
        user = conn.execute(
            "SELECT id, name, email FROM users WHERE id = ?",
            (user_id,)
        ).fetchone()
    finally:
        conn.close()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found.")

    return dict(user)


# Register a new user

@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(data: UserRegister):
    name = data.name.strip()
    email = data.email.strip().lower()

    if not name:
        raise HTTPException(status_code=400, detail="Name is required.")

    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        raise HTTPException(status_code=400, detail="Enter a valid email.")

    hashed_password = password_hash.hash(data.password)

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (name, email, hashed_password)
        )
        conn.commit()

        return {
            "id": cursor.lastrowid,
            "name": name,
            "email": email
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )
    finally:
        conn.close()


# Log in an existing user

@router.post("/login", response_model=TokenResponse)
def login_user(data: UserLogin):
    email = data.email.strip().lower()

    conn = get_db_connection()
    try:
        user = conn.execute(
            "SELECT id, password_hash FROM users WHERE email = ?",
            (email,)
        ).fetchone()
    finally:
        conn.close()

    if user is None or not password_hash.verify(
        data.password, user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password."
        )

    return {"access_token": create_access_token(user["id"])}


# Get the currently logged-in user's profile

@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: dict = Depends(get_current_user)):
    return current_user
