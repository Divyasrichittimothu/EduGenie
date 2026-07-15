from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.models import (
    ChatHistory,
    QuizHistory,
    SummaryHistory,
    RoadmapHistory
)


# ==========================================
#       DASHBOARD STATISTICS
# ==========================================

def get_dashboard_stats(
    db: Session,
    user_id: int
):

    chat_count = db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).count()

    quiz_count = db.query(QuizHistory).filter(
        QuizHistory.user_id == user_id
    ).count()

    summary_count = db.query(SummaryHistory).filter(
        SummaryHistory.user_id == user_id
    ).count()

    roadmap_count = db.query(RoadmapHistory).filter(
        RoadmapHistory.user_id == user_id
    ).count()

    return {

        "chatCount": chat_count,

        "quizCount": quiz_count,

        "summaryCount": summary_count,

        "roadmapCount": roadmap_count

    }


# ==========================================
#         RECENT CHAT HISTORY
# ==========================================

def recent_chats(
    db: Session,
    user_id: int,
    limit: int = 5
):

    return db.query(ChatHistory).filter(

        ChatHistory.user_id == user_id

    ).order_by(

        desc(ChatHistory.created_at)

    ).limit(limit).all()


# ==========================================
#         RECENT QUIZZES
# ==========================================

def recent_quizzes(
    db: Session,
    user_id: int,
    limit: int = 5
):

    return db.query(QuizHistory).filter(

        QuizHistory.user_id == user_id

    ).order_by(

        desc(QuizHistory.created_at)

    ).limit(limit).all()


# ==========================================
#        RECENT SUMMARIES
# ==========================================

def recent_summaries(
    db: Session,
    user_id: int,
    limit: int = 5
):

    return db.query(SummaryHistory).filter(

        SummaryHistory.user_id == user_id

    ).order_by(

        desc(SummaryHistory.created_at)

    ).limit(limit).all()


# ==========================================
#        RECENT ROADMAPS
# ==========================================

def recent_roadmaps(
    db: Session,
    user_id: int,
    limit: int = 5
):

    return db.query(RoadmapHistory).filter(

        RoadmapHistory.user_id == user_id

    ).order_by(

        desc(RoadmapHistory.created_at)

    ).limit(limit).all()


# ==========================================
#      RECENT ACTIVITIES
# ==========================================

def get_recent_activities(
    db: Session,
    user_id: int
):

    activities = []

    chats = recent_chats(db, user_id)

    for chat in chats:

        activities.append({

            "type": "Ask AI",

            "title": chat.question,

            "date": chat.created_at

        })

    quizzes = recent_quizzes(db, user_id)

    for quiz in quizzes:

        activities.append({

            "type": "Quiz",

            "title": quiz.topic,

            "date": quiz.created_at

        })

    summaries = recent_summaries(db, user_id)

    for summary in summaries:

        activities.append({

            "type": "Summary",

            "title": summary.original_text[:60] + "...",

            "date": summary.created_at

        })

    roadmaps = recent_roadmaps(db, user_id)

    for roadmap in roadmaps:

        activities.append({

            "type": "Roadmap",

            "title": roadmap.topic,

            "date": roadmap.created_at

        })

    activities = sorted(

        activities,

        key=lambda x: x["date"],

        reverse=True

    )

    return activities[:10]