from apscheduler.schedulers.background import BackgroundScheduler

from app.services.reminder_service import check_reminders

scheduler = BackgroundScheduler()


def start_scheduler(app):

    def reminder_job():

        with app.app_context():
            check_reminders()

    scheduler.add_job(
        func=reminder_job,
        trigger="interval",
        minutes=1,
        id="reminder_job",
        replace_existing=True
    )

    if not scheduler.running:
        scheduler.start()
