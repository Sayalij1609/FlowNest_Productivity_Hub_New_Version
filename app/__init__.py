import os
from flask import Flask, send_from_directory, redirect
from config import Config
from app.extensions import db, login_manager, migrate, mail, jwt, cors
from app.routes.reminders import reminder_bp
from app.routes.api import api
from app.services.scheduler import start_scheduler


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    migrate.init_app(app, db)

    mail.init_app(app)

    jwt.init_app(app)

    # CORS — allow React dev server and same-origin
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "supports_credentials": True
        }
    })

    # Import models
    from app import models

    # Start background scheduler for email reminders
    start_scheduler(app)

    # Register active blueprints
    app.register_blueprint(reminder_bp)
    app.register_blueprint(api)

    # Serve React build in production
    react_build = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "frontend", "dist"
    )

    @app.route("/")
    def root():
        return redirect("/app/")

    @app.route("/app/", defaults={"path": ""})
    @app.route("/app/<path:path>")
    def serve_react(path):
        if path and os.path.exists(os.path.join(react_build, path)):
            return send_from_directory(react_build, path)
        return send_from_directory(react_build, "index.html")

    return app