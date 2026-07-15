from app.database.database import Base, engine

# Import ALL models so SQLAlchemy registers every table
from app.database.models import (
    User,
    ChatHistory,
    QuizHistory,
    SummaryHistory,
    RoadmapHistory
)

# ==========================================
#         CREATE ALL TABLES
# ==========================================

def init_database():

    Base.metadata.create_all(bind=engine)

    print("=" * 60)
    print("EduGenie Database Initialized Successfully")
    print("=" * 60)
    print("Tables Created:")
    print("✔ users")
    print("✔ chat_history")
    print("✔ quiz_history")
    print("✔ summary_history")
    print("✔ roadmap_history")
    print("=" * 60)


if __name__ == "__main__":
    init_database()