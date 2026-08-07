from datetime import datetime

from sqlalchemy import or_

from app.models import Task

from app.extensions import db

from app.services.email_service import send_reminder_email


def check_reminders():

    now = datetime.now()

    tasks = Task.query.filter(

        Task.reminder.isnot(None),

        Task.reminder <= now,

        or_(
            Task.reminder_sent == False,
            Task.reminder_sent.is_(None)
        )

    ).all()

    print(f"[Reminder] Checking at {now} — found {len(tasks)} pending reminders")

    for task in tasks:

        try:
            send_reminder_email(
                task.user,
                task
            )

            task.reminder_sent = True
            print(f"[Reminder] Email sent for task: {task.title}")

        except Exception as e:
            print(f"[Reminder] Failed to send email for task '{task.title}': {e}")
            task.reminder_sent = True  # Mark sent to stop retrying

    db.session.commit()