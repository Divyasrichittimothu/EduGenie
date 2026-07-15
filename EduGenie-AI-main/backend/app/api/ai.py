from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database.database import get_db
from app.database.models import User

from app.api.dependencies import get_current_user

from app.schemas.ai_schema import (
    AskRequest,
    AskResponse,
    QuizRequest,
    QuizResponse,
    SummaryRequest,
    SummaryResponse,
    RoadmapRequest,
    RoadmapResponse
)

from app.services.ai_service import (
    ask_ai,
    summarize_text,
    generate_quiz,
    generate_roadmap
)

from app.services.history_service import (
    save_chat,
    save_summary,
    save_quiz,
    save_roadmap
)

router = APIRouter(
    prefix="/ai",
    tags=["Artificial Intelligence"]
)

# ==========================================================
# ASK AI
# ==========================================================

@router.post(
    "/ask",
    response_model=AskResponse
)
def ask(
    request: AskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        answer = ask_ai(request.question)

        save_chat(
            db=db,
            user_id=current_user.id,
            question=request.question,
            answer=answer
        )

        return AskResponse(
            answer=answer
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================================
# SUMMARIZER
# ==========================================================

@router.post(
    "/summarize",
    response_model=SummaryResponse
)
def summarize(
    request: SummaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        summary = summarize_text(
            request.text
        )

        save_summary(
            db=db,
            user_id=current_user.id,
            original_text=request.text,
            summary=summary
        )

        return SummaryResponse(
            summary=summary
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================================
# QUIZ GENERATOR
# ==========================================================

@router.post(
    "/quiz",
    response_model=QuizResponse
)
def quiz(
    request: QuizRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        quiz = generate_quiz(
            topic=request.topic,
            difficulty=request.difficulty,
            questions=request.questions
        )

        save_quiz(
            db=db,
            user_id=current_user.id,
            topic=request.topic,
            difficulty=request.difficulty,
            questions=request.questions,
            quiz=json.dumps(quiz)
        )

        return QuizResponse(
            quiz=quiz
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================================
# LEARNING ROADMAP
# ==========================================================

@router.post(
    "/roadmap",
    response_model=RoadmapResponse
)
def roadmap(
    request: RoadmapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        roadmap = generate_roadmap(
            request.topic
        )

        save_roadmap(
            db=db,
            user_id=current_user.id,
            topic=request.topic,
            roadmap=roadmap
        )

        return RoadmapResponse(
            roadmap=roadmap
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================================
# AI STATUS
# ==========================================================

@router.get("/status")
def ai_status():

    return {

        "service": "Google Gemini AI",

        "status": "Running",

        "version": "1.0.0",

        "features": [

            "Ask AI",

            "Quiz Generator",

            "Summarizer",

            "Learning Roadmap"

        ]

    }