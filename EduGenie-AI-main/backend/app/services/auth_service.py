from sqlalchemy.orm import Session

from app.database.models import User

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


# ==========================================================
#                  CREATE USER
# ==========================================================

def create_user(
    db: Session,
    name: str,
    email: str,
    password: str
):

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:

        return None

    new_user = User(

        name=name,

        email=email,

        password=hash_password(password)

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return new_user


# ==========================================================
#                  LOGIN USER
# ==========================================================

def login_user(
    db: Session,
    email: str,
    password: str
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:

        return None

    if not verify_password(
        password,
        user.password
    ):

        return None

    access_token = create_access_token(

        data={

            "sub": user.email

        }

    )

    return {

        "access_token": access_token,

        "token_type": "bearer"

    }


# ==========================================================
#               GET USER BY EMAIL
# ==========================================================

def get_user_by_email(
    db: Session,
    email: str
):

    return db.query(User).filter(
        User.email == email
    ).first()


# ==========================================================
#               GET USER BY ID
# ==========================================================

def get_user_by_id(
    db: Session,
    user_id: int
):

    return db.query(User).filter(
        User.id == user_id
    ).first()


# ==========================================================
#               UPDATE USER PROFILE
# ==========================================================

def update_user(
    db: Session,
    user: User,
    name: str,
    email: str
):

    existing = db.query(User).filter(

        User.email == email,

        User.id != user.id

    ).first()

    if existing:

        return None

    user.name = name

    user.email = email

    db.commit()

    db.refresh(user)

    return user


# ==========================================================
#             CHANGE USER PASSWORD
# ==========================================================

def change_password(
    db: Session,
    user: User,
    old_password: str,
    new_password: str
):

    if not verify_password(
        old_password,
        user.password
    ):

        return False

    user.password = hash_password(
        new_password
    )

    db.commit()

    db.refresh(user)

    return True


# ==========================================================
#                 DELETE USER
# ==========================================================

def delete_user(
    db: Session,
    user: User
):

    db.delete(user)

    db.commit()

    return True


# ==========================================================
#               TOTAL USERS
# ==========================================================

def total_users(
    db: Session
):

    return db.query(User).count()


# ==========================================================
#             USER EXISTS CHECK
# ==========================================================

def user_exists(
    db: Session,
    email: str
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    return user is not None