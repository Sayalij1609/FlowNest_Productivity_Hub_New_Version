from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_cors import CORS

mail = Mail()

# Database object
db = SQLAlchemy()

# Login manager (kept for legacy Jinja routes)
login_manager = LoginManager()

# Database migration manager
migrate = Migrate()

# JWT manager for API auth
jwt = JWTManager()

# CORS
cors = CORS()

@login_manager.user_loader
def load_user(user_id):
    from app.models import User
    return User.query.get(int(user_id))