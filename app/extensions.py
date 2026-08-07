from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_mail import Mail

mail = Mail()

# Database object
db = SQLAlchemy()

# Login manager
login_manager = LoginManager()

# Database migration manager
migrate = Migrate()

@login_manager.user_loader
def load_user(user_id):
    from app.models import User
    return User.query.get(int(user_id))