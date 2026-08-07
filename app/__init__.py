from flask import Flask
from config import Config
from app.extensions import db, login_manager, migrate , mail
from app.routes.dashboard import dashboard
from app.routes.main import main
from app.routes.auth import auth
from app.routes.tasks import tasks
from app.routes.categories import categories
from app.routes.habits import habits
from app.routes.notes import notes
from app.routes.calendar import calendar_bp
from app.routes.stats import stats
from app.routes.profile import profile
from app.routes.notifications import notifications
from app.routes.reminders import reminder_bp
from app.services.scheduler import start_scheduler





def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)

    login_manager.init_app(app)      # <-- REQUIRED

    login_manager.login_view = "auth.login"

    migrate.init_app(app, db)

    mail.init_app(app)

    # Import models
    from app import models

    # Start background scheduler for email reminders
    start_scheduler(app)
    

    # Register blueprints
    app.register_blueprint(main)
    app.register_blueprint(auth)
    app.register_blueprint(dashboard)
    app.register_blueprint(tasks)
    app.register_blueprint(categories)
    app.register_blueprint(habits)
    app.register_blueprint(notes)
    app.register_blueprint(calendar_bp)
    app.register_blueprint(stats)
    app.register_blueprint(profile)
    app.register_blueprint(notifications)
    app.register_blueprint(reminder_bp)
   
    return app