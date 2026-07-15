from sqlalchemy.orm import Session

from app.database.models import (
    ChatHistory,
    QuizHistory,
    SummaryHistory,
    RoadmapHistory
)


# ==========================================
#           SAVE CHAT
# ==========================================

def save_chat(
    db: Session,
    user_id: int,
    question: str,
    answer: str
):

    chat = ChatHistory(
        user_id=user_id,
        question=question,
        answer=answer
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


# ==========================================
#           SAVE QUIZ
# ==========================================

def save_quiz(
    db: Session,
    user_id: int,
    topic: str,
    difficulty: str,
    questions: int,
    quiz: str
):

    quiz_history = QuizHistory(
        user_id=user_id,
        topic=topic,
        difficulty=difficulty,
        questions=questions,
        quiz=quiz
    )

    db.add(quiz_history)
    db.commit()
    db.refresh(quiz_history)

    return quiz_history


# ==========================================
#         SAVE SUMMARY
# ==========================================

def save_summary(
    db: Session,
    user_id: int,
    original_text: str,
    summary: str
):

    summary_history = SummaryHistory(
        user_id=user_id,
        original_text=original_text,
        summary=summary
    )

    db.add(summary_history)
    db.commit()
    db.refresh(summary_history)

    return summary_history


# ==========================================
#        SAVE ROADMAP
# ==========================================

def save_roadmap(
    db: Session,
    user_id: int,
    topic: str,
    roadmap: str
):

    roadmap_history = RoadmapHistory(
        user_id=user_id,
        topic=topic,
        roadmap=roadmap
    )

    db.add(roadmap_history)
    db.commit()
    db.refresh(roadmap_history)

    return roadmap_history


# ==========================================
#          GET CHATS
# ==========================================

def get_chats(
    db: Session,
    user_id: int
):

    return db.query(ChatHistory).filter(
        ChatHistory.user_id == user_id
    ).order_by(
        ChatHistory.created_at.desc()
    ).all()


# ==========================================
#          GET QUIZZES
# ==========================================

def get_quizzes(
    db: Session,
    user_id: int
):

    return db.query(QuizHistory).filter(
        QuizHistory.user_id == user_id
    ).order_by(
        QuizHistory.created_at.desc()
    ).all()


# ==========================================
#         GET SUMMARIES
# ==========================================

def get_summaries(
    db: Session,
    user_id: int
):

    return db.query(SummaryHistory).filter(
        SummaryHistory.user_id == user_id
    ).order_by(
        SummaryHistory.created_at.desc()
    ).all()


# ==========================================
#         GET ROADMAPS
# ==========================================

def get_roadmaps(
    db: Session,
    user_id: int
):

    return db.query(RoadmapHistory).filter(
        RoadmapHistory.user_id == user_id
    ).order_by(
        RoadmapHistory.created_at.desc()
    ).all()


# ==========================================
#        DASHBOARD COUNTS
# ==========================================

def dashboard_counts(
    db: Session,
    user_id: int
):

    return {

        "chatCount": db.query(ChatHistory).filter(
            ChatHistory.user_id == user_id
        ).count(),

        "quizCount": db.query(QuizHistory).filter(
            QuizHistory.user_id == user_id
        ).count(),

        "summaryCount": db.query(SummaryHistory).filter(
            SummaryHistory.user_id == user_id
        ).count(),

        "roadmapCount": db.query(RoadmapHistory).filter(
            RoadmapHistory.user_id == user_id
        ).count()

    }