from pydantic import BaseModel, Field
from typing import List


# ==========================================
#           ASK AI
# ==========================================

class AskRequest(BaseModel):

    question: str = Field(
        ...,
        min_length=1,
        description="Question asked by the user"
    )


class AskResponse(BaseModel):

    answer: str

    class Config:
        from_attributes = True


# ==========================================
#          QUIZ GENERATOR
# ==========================================

class QuizRequest(BaseModel):

    topic: str = Field(
        ...,
        min_length=2
    )

    difficulty: str = Field(
        default="Easy"
    )

    questions: int = Field(
        default=5,
        ge=1,
        le=20
    )


class QuizQuestion(BaseModel):

    question: str

    options: List[str]

    answer: str


class QuizResponse(BaseModel):

    quiz: List[QuizQuestion]

    class Config:
        from_attributes = True


# ==========================================
#          TEXT SUMMARIZER
# ==========================================

class SummaryRequest(BaseModel):

    text: str = Field(
        ...,
        min_length=10
    )


class SummaryResponse(BaseModel):

    summary: str

    class Config:
        from_attributes = True


# ==========================================
#        LEARNING ROADMAP
# ==========================================

class RoadmapRequest(BaseModel):

    topic: str = Field(
        ...,
        min_length=2
    )


class RoadmapResponse(BaseModel):

    roadmap: str

    class Config:
        from_attributes = True


# ==========================================
#          AI STATUS
# ==========================================

class AIStatusResponse(BaseModel):

    service: str

    status: str

    version: str

    features: List[str]

    class Config:
        from_attributes = True