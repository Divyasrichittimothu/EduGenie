from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.api.dependencies import get_current_user

from app.services.dashboard_service import (
    get_dashboard_stats,
    get_recent_activities
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ==========================================
#         DASHBOARD STATISTICS
# ==========================================

@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    stats = get_dashboard_stats(
        db=db,
        user_id=current_user.id
    )

    return {
        "success": True,
        "message": "Dashboard statistics fetched successfully.",
        "data": stats
    }


# ==========================================
#        RECENT ACTIVITIES
# ==========================================

@router.get("/recent-activities")
def recent_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    activities = get_recent_activities(
        db=db,
        user_id=current_user.id
    )

    return {
        "success": True,
        "message": "Recent activities fetched successfully.",
        "count": len(activities),
        "data": activities
    }


# ==========================================
#          COMPLETE DASHBOARD
# ==========================================

@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    stats = get_dashboard_stats(
        db=db,
        user_id=current_user.id
    )

    activities = get_recent_activities(
        db=db,
        user_id=current_user.id
    )

    return {

        "success": True,

        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email
        },

        "statistics": stats,

        "recentActivities": activities

    }


# ==========================================
#          DASHBOARD HEALTH
# ==========================================

@router.get("/health")
def dashboard_health():

    return {

        "service": "Dashboard",

        "status": "Running",

        "version": "1.0.0"

    }