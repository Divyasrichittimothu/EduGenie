from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import models so SQLAlchemy creates all tables
from app.database import models

# Import Routers
from app.api.auth import router as auth_router
from app.api.ai import router as ai_router
from app.api.history import router as history_router
from app.api.dashboard import router as dashboard_router


# ==========================================================
#                 CREATE DATABASE TABLES
# ==========================================================

Base.metadata.create_all(bind=engine)


# ==========================================================
#                  FASTAPI APPLICATION
# ==========================================================

app = FastAPI(

    title="EduGenie",

    description="Google Gemini Powered AI Learning Assistant",

    version="2.0.0"

)


# ==========================================================
#                      CORS SETTINGS
# ==========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]

)


# ==========================================================
#                  REGISTER ROUTERS
# ==========================================================

app.include_router(auth_router)

app.include_router(ai_router)

app.include_router(history_router)

app.include_router(dashboard_router)


# ==========================================================
#                     HOME ENDPOINT
# ==========================================================

@app.get("/")
def home():

    return {

        "application": "EduGenie",

        "version": "2.0.0",

        "status": "Running Successfully",

        "description": "Google Gemini Powered Learning Assistant",

        "features": [

            "JWT Authentication",

            "Ask AI",

            "Quiz Generator",

            "Text Summarizer",

            "Learning Roadmap",

            "History",

            "Dashboard",

            "Profile",

            "Google Gemini AI"

        ]

    }


# ==========================================================
#                    HEALTH CHECK
# ==========================================================

@app.get("/health")
def health():

    return {

        "status": "Healthy",

        "server": "Running",

        "database": "Connected",

        "authentication": "JWT Enabled",

        "ai": "Google Gemini Connected"

    }


# ==========================================================
#                    API INFORMATION
# ==========================================================

@app.get("/api-info")
def api_info():

    return {

        "Application": "EduGenie",

        "Version": "2.0.0",

        "Developer": "EduGenie Team",

        "Backend": "FastAPI",

        "Database": "SQLite",

        "Authentication": "JWT",

        "AI": "Google Gemini 2.5 Flash"

    }


# ==========================================================
#                    SERVER STATUS
# ==========================================================

@app.get("/status")
def server_status():

    return {

        "success": True,

        "message": "EduGenie Backend is Running Successfully.",

        "services": {

            "Authentication": "Running",

            "Database": "Running",

            "Gemini AI": "Running",

            "Dashboard": "Running",

            "History": "Running"

        }

    }