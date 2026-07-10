import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()


def _build_database_uri():
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url

    mysql_user = os.getenv("MYSQL_USER", "root")
    mysql_password = os.getenv("MYSQL_PASSWORD", "")
    mysql_host = os.getenv("MYSQL_HOST", "localhost")
    mysql_db = os.getenv("MYSQL_DB", "ai_notes_summarizer")

    if os.getenv("MYSQL_USER") or os.getenv("MYSQL_PASSWORD") or os.getenv("MYSQL_HOST") or os.getenv("MYSQL_DB"):
        return (
            f"mysql+pymysql://{quote_plus(mysql_user)}:"
            f"{quote_plus(mysql_password)}@{mysql_host}/{quote_plus(mysql_db)}"
        )

    return "sqlite:///development.db"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")

    SQLALCHEMY_DATABASE_URI = _build_database_uri()

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")