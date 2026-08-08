from flask import Blueprint

api = Blueprint("api", __name__, url_prefix="/api")

from app.routes.api.auth import auth_api
from app.routes.api.dashboard import dashboard_api
from app.routes.api.tasks import tasks_api
from app.routes.api.categories import categories_api
from app.routes.api.habits import habits_api
from app.routes.api.notes import notes_api
from app.routes.api.calendar_api import calendar_api
from app.routes.api.stats import stats_api
from app.routes.api.profile import profile_api
from app.routes.api.notifications import notifications_api

api.register_blueprint(auth_api)
api.register_blueprint(dashboard_api)
api.register_blueprint(tasks_api)
api.register_blueprint(categories_api)
api.register_blueprint(habits_api)
api.register_blueprint(notes_api)
api.register_blueprint(calendar_api)
api.register_blueprint(stats_api)
api.register_blueprint(profile_api)
api.register_blueprint(notifications_api)
