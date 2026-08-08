import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()


BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Ensure instance directory exists
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)

class Config:
    """
    Application configuration class.
    All project settings are stored here.
    """

    # Secret key used by Flask
    SECRET_KEY = os.getenv("SECRET_KEY") or "flownest-dev-secret-key-12345"

    # Database URI — support Render/Heroku postgres:// scheme fix and fallback to SQLite
    db_url = os.getenv("DATABASE_URL")
    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = db_url or ("sqlite:///" + os.path.join(BASE_DIR, "instance", "flownest.db"))

    # Disable unnecessary tracking
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Folder for uploaded files
    UPLOAD_FOLDER = os.path.join( BASE_DIR,
        "app",
        "static",
        "uploads"
    )
    
    # Maximum upload size (16 MB)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    REMINDER_TOKEN = os.getenv("REMINDER_TOKEN") or "flownest-reminder-token"

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = MAIL_USERNAME

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or SECRET_KEY or "flownest-jwt-dev-secret-12345"
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"