from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from .database import Base


# ==========================================
# USER
# ==========================================

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))

    email = Column(String(150), unique=True, index=True)

    password = Column(String(255))

    chats = relationship(
        "ChatHistory",
        back_populates="user",
        cascade="all, delete"
    )

    quizzes = relationship(
        "QuizHistory",
        back_populates="user",
        cascade="all, delete"
    )

    summaries = relationship(
        "SummaryHistory",
        back_populates="user",
        cascade="all, delete"
    )

    roadmaps = relationship(
        "RoadmapHistory",
        back_populates="user",
        cascade="all, delete"
    )


# ==========================================
# CHAT HISTORY
# ==========================================

class ChatHistory(Base):

    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(Text)

    answer = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="chats"
    )


# ==========================================
# QUIZ HISTORY
# ==========================================

class QuizHistory(Base):

    __tablename__ = "quiz_history"

    id = Column(Integer, primary_key=True, index=True)

    topic = Column(String(200))

    difficulty = Column(String(50))

    questions = Column(Integer)

    quiz = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="quizzes"
    )


# ==========================================
# SUMMARY HISTORY
# ==========================================

class SummaryHistory(Base):

    __tablename__ = "summary_history"

    id = Column(Integer, primary_key=True, index=True)

    original_text = Column(Text)

    summary = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="summaries"
    )


# ==========================================
# ROADMAP HISTORY
# ==========================================

class RoadmapHistory(Base):

    __tablename__ = "roadmap_history"

    id = Column(Integer, primary_key=True, index=True)

    topic = Column(String(200))

    roadmap = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="roadmaps"
    )