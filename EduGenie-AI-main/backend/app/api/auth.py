from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User

from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UserResponse
)

from app.services.auth_service import (
    create_user,
    login_user
)

from app.api.dependencies import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================================
#                    REGISTER USER
# ==========================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(

    request: UserRegister,

    db: Session = Depends(get_db)

):

    user = create_user(

        db=db,

        name=request.name,

        email=request.email,

        password=request.password

    )

    if user is None:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Email already registered."

        )

    return user


# ==========================================================
#                     LOGIN USER
# ==========================================================

@router.post("/login")
def login(

    request: UserLogin,

    db: Session = Depends(get_db)

):

    token = login_user(

        db=db,

        email=request.email,

        password=request.password

    )

    if token is None:

        raise HTTPException(

            status_code=status.HTTP_401_UNAUTHORIZED,

            detail="Invalid Email or Password."

        )

    return token


# ==========================================================
#                  CURRENT USER
# ==========================================================

@router.get(
    "/me",
    response_model=UserResponse
)
def current_user(

    user: User = Depends(get_current_user)

):

    return user


# ==========================================================
#                  UPDATE PROFILE
# ==========================================================

@router.put(
    "/profile",
    response_model=UserResponse
)
def update_profile(

    request: UserRegister,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    existing = db.query(User).filter(

        User.email == request.email,

        User.id != current_user.id

    ).first()

    if existing:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Email already exists."

        )

    current_user.name = request.name

    current_user.email = request.email

    db.commit()

    db.refresh(current_user)

    return current_user


# ==========================================================
#                AUTHENTICATION STATUS
# ==========================================================

@router.get("/status")
def auth_status(

    current_user: User = Depends(get_current_user)

):

    return {

        "authenticated": True,

        "user": {

            "id": current_user.id,

            "name": current_user.name,

            "email": current_user.email

        }

    }


# ==========================================================
#                    LOGOUT
# ==========================================================

@router.post("/logout")
def logout(

    current_user: User = Depends(get_current_user)

):

    return {

        "success": True,

        "message": "Logout successful. Please remove the JWT token on the client side."

    }