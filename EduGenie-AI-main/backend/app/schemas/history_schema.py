from pydantic import BaseModel
from datetime import datetime


# ==========================================
# CHAT HISTORY
# ==========================================

class ChatHistoryResponse(BaseModel):

    id: int

    question: str

    answer: str

    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# QUIZ HISTORY
# ==========================================

class QuizHistoryResponse(BaseModel):

    id: int

    topic: str

    difficulty: str

    questions: int

    quiz: str

    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# SUMMARY HISTORY
# ==========================================

class SummaryHistoryResponse(BaseModel):

    id: int

    original_text: str

    summary: str

    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# ROADMAP HISTORY
# ==========================================

class RoadmapHistoryResponse(BaseModel):

    id: int

    topic: str

    roadmap: str

    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# DASHBOARD STATS
# ==========================================

class DashboardStatsResponse(BaseModel):

    chatCount: int

    quizCount: int

    summaryCount: int

    roadmapCount: int