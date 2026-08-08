import os
from apscheduler.schedulers.background import BackgroundScheduler

from app.services.reminder_service import check_reminders

scheduler = BackgroundScheduler()


def start_scheduler(app):
    """
    Start the APScheduler background job for email reminders.
    Only starts in single-process environments or Gunicorn's first worker
    to prevent duplicate jobs across multiple workers.
    """

    def reminder_job():
        with app.app_context():
            check_reminders()

    # Prevent duplicate schedulers in Gunicorn multi-worker or Flask debug reloader
    # In production (Gunicorn), only start if not already running
    # In development (Flask reloader), skip the reloader child process
    is_reloader = os.environ.get("WERKZEUG_RUN_MAIN") == "true"
    is_main_process = not is_reloader or os.environ.get("WERKZEUG_RUN_MAIN") == "true"

    if is_main_process and not scheduler.running:
        scheduler.add_job(
            func=reminder_job,
            trigger="interval",
            minutes=1,
            id="reminder_job",
            replace_existing=True
        )
        scheduler.start()
        print("[Scheduler] APScheduler started — checking reminders every 60 seconds")
