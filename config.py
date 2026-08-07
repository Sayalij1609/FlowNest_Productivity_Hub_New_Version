import os
from dotenv import load_dotenv

# Load variables from the .env file
load_dotenv()


BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """
    Application configuration class.
    All project settings are stored here.
    """

    # Secret key used by Flask
    SECRET_KEY = os.getenv("SECRET_KEY")

    # Database URI
    SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL",
    "sqlite:///" + os.path.join(BASE_DIR, "instance", "database.db")
    )

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

    REMINDER_TOKEN = os.getenv("REMINDER_TOKEN")

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = MAIL_USERNAME