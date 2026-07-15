from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database.models import User
from app.api.dependencies import get_current_user

from app.schemas.history_schema import (
    ChatHistoryResponse,
    QuizHistoryResponse,
    SummaryHistoryResponse,
    RoadmapHistoryResponse,
    DashboardStatsResponse
)

from app.services.history_service import (
    get_chats,
    get_quizzes,
    get_summaries,
    get_roadmaps,
    dashboard_counts
)

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


# ==========================================
#            CHAT HISTORY
# ==========================================

@router.get(
    "/chats",
    response_model=List[ChatHistoryResponse]
)
def chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_chats(
        db,
        current_user.id
    )


# ==========================================
#            QUIZ HISTORY
# ==========================================

@router.get(
    "/quizzes",
    response_model=List[QuizHistoryResponse]
)
def quiz_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_quizzes(
        db,
        current_user.id
    )


# ==========================================
#          SUMMARY HISTORY
# ==========================================

@router.get(
    "/summaries",
    response_model=List[SummaryHistoryResponse]
)
def summary_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_summaries(
        db,
        current_user.id
    )


# ==========================================
#          ROADMAP HISTORY
# ==========================================

@router.get(
    "/roadmaps",
    response_model=List[RoadmapHistoryResponse]
)
def roadmap_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return get_roadmaps(
        db,
        current_user.id
    )


# ==========================================
#        DASHBOARD STATISTICS
# ==========================================

@router.get(
    "/dashboard",
    response_model=DashboardStatsResponse
)
def dashboard_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    return dashboard_counts(
        db,
        current_user.id
    )