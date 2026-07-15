from pydantic import BaseModel


class DashboardStats(BaseModel):

    questions: int

    quizzes: int

    summaries: int

    roadmaps: int

    total_requests: int